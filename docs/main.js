/* ============================================================
   Awesome JAX — interactive explorer logic (vanilla JS)
   Reads `awesomeJaxData` / `awesomeJaxMeta` from data.js.
   ============================================================ */
(function () {
  "use strict";

  const data = Array.isArray(window.awesomeJaxData) ? window.awesomeJaxData.slice() : [];

  const els = {
    stats: document.getElementById("stats"),
    search: document.getElementById("search"),
    clearSearch: document.getElementById("clearSearch"),
    statusFilter: document.getElementById("statusFilter"),
    sort: document.getElementById("sort"),
    categoryFilter: document.getElementById("categoryFilter"),
    grid: document.getElementById("grid"),
    empty: document.getElementById("empty"),
    emptyReset: document.getElementById("emptyReset"),
    resultCount: document.getElementById("resultCount"),
    clearFilters: document.getElementById("clearFilters"),
  };

  // ---- Fallback if data failed to load ----
  if (!data.length) {
    els.grid.innerHTML = "";
    els.empty.hidden = false;
    els.empty.querySelector("h2").textContent = "No data found";
    els.empty.querySelector("p").textContent = "Run `npm run build` in the docs folder to generate data.js.";
    if (els.emptyReset) els.emptyReset.hidden = true;
    return;
  }

  const STATUS_META = {
    active: { label: "Active", dot: "dot-active" },
    "up-and-coming": { label: "Up and coming", dot: "dot-up-and-coming" },
    inactive: { label: "Inactive", dot: "dot-inactive" },
  };
  const STATUS_ORDER = ["active", "up-and-coming", "inactive"];

  const state = { query: "", status: null, category: null, sort: "stars-desc" };

  // ---------- helpers ----------
  function shortCategory(cat) {
    return cat.replace(/\s+Libraries$/, "");
  }

  function formatStars(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function relativeDate(iso) {
    if (!iso) return "Unknown";
    const then = new Date(iso).getTime();
    if (isNaN(then)) return "Unknown";
    const days = Math.floor((Date.now() - then) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return days + " days ago";
    if (days < 30) { const w = Math.floor(days / 7); return w + (w > 1 ? " weeks" : " week") + " ago"; }
    if (days < 365) { const m = Math.floor(days / 30); return m + (m > 1 ? " months" : " month") + " ago"; }
    const y = Math.floor(days / 365);
    return y + (y > 1 ? " years" : " year") + " ago";
  }

  function ts(iso) {
    const t = iso ? new Date(iso).getTime() : 0;
    return isNaN(t) ? 0 : t;
  }

  function svg(markup) {
    const span = document.createElement("span");
    span.style.display = "inline-flex";
    span.innerHTML = markup;
    return span.firstElementChild;
  }
  const ICON_STAR = '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M8 1.2l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>';
  const ICON_CLOCK = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.25"/><path d="M8 4.5V8l2.4 1.6" stroke-linecap="round"/></svg>';

  // ---------- stats (single summary line) ----------
  function renderStats() {
    const parts = [
      [data.length, "libraries"],
      [data.filter((l) => l.status === "active").length, "active"],
      [data.filter((l) => l.status === "up-and-coming").length, "up and coming"],
      [data.filter((l) => l.status === "inactive").length, "inactive"],
    ];
    els.stats.replaceChildren();
    parts.forEach((p, i) => {
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "sep";
        sep.textContent = "·";
        els.stats.appendChild(sep);
      }
      const strong = document.createElement("strong");
      strong.textContent = formatStars(p[0]);
      els.stats.append(strong, " " + p[1]);
    });
  }

  // ---------- status segmented control ----------
  function renderStatusFilter() {
    const frag = document.createDocumentFragment();
    const opts = [{ value: null, label: "All", count: data.length }].concat(
      STATUS_ORDER.map((s) => ({
        value: s,
        label: STATUS_META[s].label,
        count: data.filter((l) => l.status === s).length,
        dot: STATUS_META[s].dot,
      }))
    );
    opts.forEach((o) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seg-btn";
      btn.setAttribute("aria-pressed", String(state.status === o.value));
      btn.dataset.value = o.value === null ? "" : o.value;
      if (o.dot) {
        const d = document.createElement("span");
        d.className = "dot " + o.dot;
        btn.appendChild(d);
      }
      btn.appendChild(document.createTextNode(o.label));
      const c = document.createElement("span");
      c.className = "seg-count";
      c.textContent = o.count;
      btn.appendChild(c);
      btn.addEventListener("click", () => {
        state.status = state.status === o.value ? null : o.value;
        syncStatusFilter();
        render();
      });
      frag.appendChild(btn);
    });
    els.statusFilter.replaceChildren(frag);
  }
  function syncStatusFilter() {
    els.statusFilter.querySelectorAll(".seg-btn").forEach((b) => {
      b.setAttribute("aria-pressed", String((b.dataset.value || null) === state.status));
    });
  }

  // ---------- category chips ----------
  function renderCategoryFilter() {
    const counts = {};
    data.forEach((l) => { counts[l.category] = (counts[l.category] || 0) + 1; });
    const cats = Object.keys(counts).sort((a, b) => (counts[b] - counts[a]) || a.localeCompare(b));

    const frag = document.createDocumentFragment();
    const all = makeChip(null, "All categories", data.length);
    frag.appendChild(all);
    cats.forEach((c) => frag.appendChild(makeChip(c, shortCategory(c), counts[c])));
    els.categoryFilter.replaceChildren(frag);
  }
  function makeChip(value, label, count) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.title = value || "Show all categories";
    btn.setAttribute("aria-pressed", String(state.category === value));
    btn.dataset.value = value === null ? "" : value;
    btn.appendChild(document.createTextNode(label));
    const c = document.createElement("span");
    c.className = "chip-count";
    c.textContent = count;
    btn.appendChild(c);
    btn.addEventListener("click", () => {
      state.category = state.category === value ? null : value;
      syncCategoryFilter();
      render();
    });
    return btn;
  }
  function syncCategoryFilter() {
    els.categoryFilter.querySelectorAll(".chip").forEach((b) => {
      b.setAttribute("aria-pressed", String((b.dataset.value || null) === state.category));
    });
  }

  // ---------- card ----------
  function buildCard(lib) {
    const card = document.createElement("a");
    card.className = "card is-" + lib.status;
    card.href = lib.url;
    card.target = "_blank";
    card.rel = "noopener";

    // head: name + stars (stars shown only when the count is known)
    const head = document.createElement("div");
    head.className = "card-head";
    const name = document.createElement("span");
    name.className = "card-name";
    name.textContent = lib.name;
    head.append(name);
    if (lib.stars != null) {
      const stars = document.createElement("span");
      stars.className = "card-stars";
      stars.appendChild(svg(ICON_STAR));
      stars.appendChild(document.createTextNode(formatStars(lib.stars)));
      head.append(stars);
    }

    // meta: category + status
    const metaRow = document.createElement("div");
    metaRow.className = "card-meta";
    const cat = document.createElement("span");
    cat.className = "card-cat";
    cat.textContent = shortCategory(lib.category);
    cat.title = lib.category;
    const status = document.createElement("span");
    status.className = "card-status";
    const sm = STATUS_META[lib.status] || { label: lib.status, dot: "dot-inactive" };
    const dot = document.createElement("span");
    dot.className = "dot " + sm.dot;
    status.append(dot, document.createTextNode(sm.label));
    metaRow.append(cat, status);

    // description
    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = lib.description || "No description available.";

    // foot: last updated
    const foot = document.createElement("div");
    foot.className = "card-foot";
    foot.appendChild(svg(ICON_CLOCK));
    foot.appendChild(
      document.createTextNode(lib.lastCommit ? "Updated " + relativeDate(lib.lastCommit) : "Update date unknown")
    );

    card.append(head, metaRow, desc, foot);
    return card;
  }

  // ---------- filter + sort + render ----------
  function getFiltered() {
    const q = state.query.trim().toLowerCase();
    let rows = data.filter((lib) => {
      if (state.status && lib.status !== state.status) return false;
      if (state.category && lib.category !== state.category) return false;
      if (q) {
        const hay = (lib.name + " " + (lib.description || "") + " " + lib.category).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const cmp = {
      "stars-desc": (a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name),
      "stars-asc": (a, b) => (a.stars || 0) - (b.stars || 0) || a.name.localeCompare(b.name),
      "name-asc": (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      "name-desc": (a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
      "updated-desc": (a, b) => ts(b.lastCommit) - ts(a.lastCommit) || a.name.localeCompare(b.name),
    }[state.sort];
    rows.sort(cmp);
    return rows;
  }

  function setResultCount(shown, total) {
    const strong = document.createElement("strong");
    strong.textContent = shown;
    els.resultCount.replaceChildren();
    if (shown === total) {
      strong.textContent = total;
      els.resultCount.append("Showing all ", strong, " libraries");
    } else {
      els.resultCount.append("Showing ", strong, " of " + total + " libraries");
    }
  }

  function render() {
    const rows = getFiltered();

    if (rows.length === 0) {
      els.grid.replaceChildren();
      els.empty.hidden = false;
    } else {
      els.empty.hidden = true;
      const frag = document.createDocumentFragment();
      rows.forEach((lib) => frag.appendChild(buildCard(lib)));
      els.grid.replaceChildren(frag);
    }

    // result bar (built with DOM nodes — no innerHTML)
    setResultCount(rows.length, data.length);

    const hasFilters = !!(state.query || state.status || state.category) || state.sort !== "stars-desc";
    els.clearFilters.hidden = !hasFilters;
    els.clearSearch.hidden = !state.query;
  }

  // ---------- reset ----------
  function resetFilters() {
    clearTimeout(searchTimer);
    state.query = "";
    state.status = null;
    state.category = null;
    state.sort = "stars-desc";
    els.search.value = "";
    els.sort.value = "stars-desc";
    syncStatusFilter();
    syncCategoryFilter();
    render();
  }

  // ---------- events ----------
  let searchTimer = null;
  els.search.addEventListener("input", (e) => {
    const v = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = v; render(); }, 110);
  });
  els.clearSearch.addEventListener("click", () => {
    clearTimeout(searchTimer);
    els.search.value = "";
    state.query = "";
    els.search.focus();
    render();
  });
  els.sort.addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  els.clearFilters.addEventListener("click", resetFilters);
  if (els.emptyReset) els.emptyReset.addEventListener("click", resetFilters);

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== els.search) {
      e.preventDefault();
      els.search.focus();
    } else if (e.key === "Escape" && document.activeElement === els.search) {
      clearTimeout(searchTimer);
      els.search.value = "";
      state.query = "";
      els.search.blur();
      render();
    }
  });

  // ---------- init ----------
  renderStats();
  renderStatusFilter();
  renderCategoryFilter();
  render();
})();
