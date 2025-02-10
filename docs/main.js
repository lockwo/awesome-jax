$(document).ready(function () {
  const tbody = $("#softwareTable tbody");

  softwareData.forEach((item) => {
    const row = $("<tr></tr>");

    const nameTd = $("<td></td>").text(item.name);

    const typeTd = $("<td></td>").text(item.type);

    const repoLink = $("<a></a>")
      .attr("href", item.repo)
      .attr("target", "_blank")
      .text(item.repo.replace("https://github.com/", ""));
    const repoTd = $("<td></td>").append(repoLink);

    const starsTd = $("<td></td>").text(item.stars);

    const dependenciesTd = $("<td></td>").addClass("dependencies");
    (item.dependencies || []).forEach((dep) => {
      const depLink = $("<a></a>")
        .attr("href", "#")
        .addClass("dependency-link")
        .text(dep);
      dependenciesTd.append(depLink).append(" ");
    });

    const statusTd = $("<td></td>").text(item.status);

    if (item.status === "Inactive") {
      row.addClass("inactive-row");
    }

    row.append(nameTd);
    row.append(typeTd);
    row.append(repoTd);
    row.append(starsTd);
    row.append(dependenciesTd);
    row.append(statusTd);

    tbody.append(row);

    // TODO: use api key to get around rate limiting and get stars,
    // last commit, and make inactive/active automatically from url
  });

  const table = $("#softwareTable").DataTable({
    pageLength: 10,
    lengthMenu: [
      [5, 10, 25, -1],
      [5, 10, 25, "All"],
    ],
    columnDefs: [
      // Make columns not sortable
      { targets: [1, 4, 5], orderable: false },
    ],
  });

  const allTypes = new Set();
  softwareData.forEach((item) => allTypes.add(item.type));
  allTypes.forEach((typeVal) => {
    const li = $("<li></li>");
    const link = $("<a></a>")
      .addClass("dropdown-item")
      .attr("href", "#")
      .text(typeVal);
    link.on("click", function (e) {
      e.preventDefault();
      table.column(1).search(typeVal, false, false).draw();
    });
    li.append(link);
    $("#typeDropdown").append(li);
  });

  const allDeps = new Set();
  softwareData.forEach((item) => {
    (item.dependencies || []).forEach((dep) => allDeps.add(dep));
  });
  allDeps.forEach((depVal) => {
    const li = $("<li></li>");
    const link = $("<a></a>")
      .addClass("dropdown-item")
      .attr("href", "#")
      .text(depVal);
    link.on("click", function (e) {
      e.preventDefault();
      table.column(4).search(depVal, false, false).draw();
    });
    li.append(link);
    $("#dependenciesDropdown").append(li);
  });

  // Also allow clicking the "bubble" itself
  $("#softwareTable tbody").on("click", ".dependency-link", function (e) {
    e.preventDefault();
    const clickedDep = $(this).text().trim();
    table.column(4).search(clickedDep, false, false).draw();
  });

  const possibleStatus = ["Active", "Inactive"];
  possibleStatus.forEach((stat) => {
    const li = $("<li></li>");
    const link = $("<a></a>")
      .addClass("dropdown-item")
      .attr("href", "#")
      .text(stat);
    link.on("click", function (e) {
      e.preventDefault();
      table.column(5).search(stat, false, false).draw();
    });
    li.append(link);
    $("#statusDropdown").append(li);
  });

  $("#clearTypeFilter").on("click", function () {
    table.column(1).search("").draw();
  });
  $("#clearDependencyFilter").on("click", function () {
    table.column(4).search("").draw();
  });
  $("#clearStatusFilter").on("click", function () {
    table.column(5).search("").draw();
  });

  table.on("draw", function () {
    const depFilter = table.column(4).search();
    if (!depFilter) {
      $(".dependency-link").removeClass("filtered-dep");
    } else {
      $(".dependency-link").each(function () {
        const depName = $(this).text().trim();
        if (depName === depFilter) {
          $(this).addClass("filtered-dep");
        } else {
          $(this).removeClass("filtered-dep");
        }
      });
    }
  });

  // see TODO
  function fetchStarsFromGitHub(githubUrl, starsCell) {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)(\/|$)/);
    if (!match) {
      // If it's not a valid GitHub URL, just show N/A
      starsCell.text("N/A");
      return;
    }
    const owner = match[1];
    const repoName = match[2];
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        starsCell.text(data.stargazers_count ?? "??");
      })
      .catch((err) => {
        console.error("GitHub API error:", apiUrl, err);
        starsCell.text("Error");
      });
  }
});
