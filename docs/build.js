#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const README_PATH = path.join(__dirname, '..', 'README.md');
const OUTPUT_PATH = path.join(__dirname, 'data.js');
const CACHE_PATH = path.join(__dirname, '.github-cache.json');
const CATEGORIES_PATH = path.join(__dirname, 'categories.json');
const CACHE_TTL = 60 * 60 * 1000;
const REQUEST_TIMEOUT = 15000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const args = process.argv.slice(2);
const noGithub = args.includes('--no-github');
const noCache = args.includes('--no-cache');

let CATEGORY_OVERRIDES = {};
try {
  const raw = JSON.parse(require('fs').readFileSync(CATEGORIES_PATH, 'utf8'));
  CATEGORY_OVERRIDES = raw.categories || raw || {};
} catch (error) {
  console.warn(`Could not read categories.json: ${error.message}`);
}

function httpsRequest(url, options = {}, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(new Error('Too many redirects'));
  }
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'awesome-jax-builder',
        ...options.headers
      }
    };

    const request = https.get(requestOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).toString();
        res.resume();
        resolve(httpsRequest(nextUrl, options, redirectCount + 1));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`Invalid JSON (HTTP ${res.statusCode}): ${err.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    request.setTimeout(REQUEST_TIMEOUT, () => {
      request.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT}ms`));
    });
    request.on('error', reject);
  });
}

async function fetchGithubData(owner, repo) {
  const headers = GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {};
  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const repoData = await httpsRequest(repoUrl, { headers });
  if (!Number.isInteger(repoData.stargazers_count) || !repoData.default_branch) {
    throw new Error('Repository response is missing stars or default branch');
  }

  const branch = encodeURIComponent(repoData.default_branch);
  const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`;
  const commitsData = await httpsRequest(commitsUrl, { headers });
  const lastCommit = commitsData[0]?.commit?.committer?.date;
  if (!lastCommit || Number.isNaN(new Date(lastCommit).getTime())) {
    throw new Error('Commit response is missing a valid date');
  }

  return { stars: repoData.stargazers_count, lastCommit };
}

async function loadCache() {
  if (noCache) return { data: {}, timestamp: 0 };

  try {
    const cacheContent = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(cacheContent);
  } catch (error) {
    if (error.code === 'ENOENT') return { data: {}, timestamp: 0 };
    throw error;
  }
}

async function saveCache(cache) {
  if (noGithub) return;
  const tempPath = `${CACHE_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(cache, null, 2));
  await fs.rename(tempPath, CACHE_PATH);
}

async function parseReadme() {
  const content = await fs.readFile(README_PATH, 'utf8');
  const lines = content.split('\n');

  const libraries = [];
  let currentCategory = null;
  let currentStatus = 'active';
  let inLibrarySection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '## Libraries') {
      inLibrarySection = true;
      currentStatus = 'active';
      currentCategory = null;
      continue;
    }

    if (line.startsWith('## ') && line.trim() !== '## Libraries') {
      inLibrarySection = false;
      continue;
    }

    if (!inLibrarySection) continue;

    if (/^###\s+Up[\s-]and[\s-]Coming/i.test(line)) {
      currentStatus = 'up-and-coming';
      currentCategory = null;
      continue;
    }
    if (/^###\s+Inactive/i.test(line)) {
      currentStatus = 'inactive';
      currentCategory = null;
      continue;
    }
    if (line.startsWith('### ')) {
      currentCategory = null;
      continue;
    }

    const categoryMatch = line.match(/^- (.+ Libraries)\s*$/);
    if (categoryMatch && !line.includes('](')) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    const libraryMatch = line.match(/^(\s*)- \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/);
    if (libraryMatch) {
      const [, indentStr, name, url, restOfLine] = libraryMatch;
      const indent = indentStr.length;

      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        continue;
      }
      const [owner, repo] = parsedUrl.pathname.split('/').filter(Boolean);
      if (parsedUrl.protocol === 'https:' && parsedUrl.hostname === 'github.com' && owner && repo) {
        const repoKey = `${owner}/${repo}`;

        let status = currentStatus;
        if (line.includes('inactive-red')) {
          status = 'inactive';
        } else if (line.includes('upcoming-brightgreen')) {
          status = 'up-and-coming';
        }

        let category;
        const catTag = line.match(/<!--\s*cat:\s*([^>]+?)\s*-->/i);
        if (catTag) {
          category = catTag[1].trim();
        } else if (indent > 0 && currentCategory) {
          category = currentCategory;
        } else {
          category = CATEGORY_OVERRIDES[repoKey] || 'Other';
        }

        const cleanDesc = restOfLine
          ? restOfLine
              .replace(/<!--[\s\S]*?-->/g, '')
              .replace(/<img[^>]*>/g, '')
              .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
              .replace(/\s+/g, ' ')
              .trim()
          : '';

        libraries.push({
          name: name.trim(),
          url,
          owner,
          repo,
          description: cleanDesc,
          category,
          status,
          stars: null,
          lastCommit: null
        });
      }
    }
  }

  return libraries;
}

async function build() {
  try {
    console.log('Building awesome-jax data');
    const libraries = await parseReadme();
    console.log(`Found ${libraries.length} libraries`);

    const cache = await loadCache();
    const now = Date.now();
    const cacheExpired = now - cache.timestamp > CACHE_TTL;

    if (!noGithub) {
      let cacheHits = 0;
      const toFetch = [];
      for (const lib of libraries) {
        const cacheKey = `${lib.owner}/${lib.repo}`;
        const cached = cache.data[cacheKey];
        const cacheValid = Number.isInteger(cached?.stars) && !Number.isNaN(new Date(cached?.lastCommit).getTime());
        if (cacheValid && !cacheExpired) {
          lib.stars = cached.stars;
          lib.lastCommit = cached.lastCommit;
          cacheHits++;
        } else {
          toFetch.push(lib);
        }
      }

      if (toFetch.length > 0) {
        if (!GITHUB_TOKEN) {
          throw new Error('GITHUB_TOKEN is required to refresh GitHub metadata');
        }

        const batchSize = 10;
        const failures = [];
        console.log(`Refreshing ${toFetch.length} repositories (${cacheHits} cached)`);
        for (let i = 0; i < toFetch.length; i += batchSize) {
          const batch = toFetch.slice(i, i + batchSize);
          const results = await Promise.all(batch.map(async (lib) => {
            try {
              const data = await fetchGithubData(lib.owner, lib.repo);
              lib.stars = data.stars;
              lib.lastCommit = data.lastCommit;
              const cacheKey = `${lib.owner}/${lib.repo}`;
              cache.data[cacheKey] = { stars: data.stars, lastCommit: data.lastCommit };
              return null;
            } catch (error) {
              return `${lib.owner}/${lib.repo}: ${error.message}`;
            }
          }));
          failures.push(...results.filter(Boolean));
          console.log(`Refreshed ${Math.min(i + batch.length, toFetch.length)}/${toFetch.length}`);
          if (i + batchSize < toFetch.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        if (failures.length > 0) {
          throw new Error(`GitHub refresh failed:\n${failures.join('\n')}`);
        }
        cache.timestamp = now;
        await saveCache(cache);
      }
    } else {
      let cacheHits = 0;
      for (const lib of libraries) {
        const cached = cache.data[`${lib.owner}/${lib.repo}`];
        if (Number.isInteger(cached?.stars) && !Number.isNaN(new Date(cached?.lastCommit).getTime())) {
          lib.stars = cached.stars;
          lib.lastCommit = cached.lastCommit;
          cacheHits++;
        }
      }
      const cacheDate = cache.timestamp ? new Date(cache.timestamp).toISOString() : 'unknown';
      console.log(`Using cached metadata for ${cacheHits}/${libraries.length} libraries from ${cacheDate}`);
    }

    libraries.sort((a, b) => {
      if (a.stars == null) return b.stars == null ? a.name.localeCompare(b.name) : 1;
      if (b.stars == null) return -1;
      return b.stars - a.stars || a.name.localeCompare(b.name);
    });

    const generatedAt = new Date().toISOString();
    const meta = {
      generatedAt,
      metadataAsOf: cache.timestamp ? new Date(cache.timestamp).toISOString() : null,
      total: libraries.length,
      active: libraries.filter(l => l.status === 'active').length,
      upAndComing: libraries.filter(l => l.status === 'up-and-coming').length,
      inactive: libraries.filter(l => l.status === 'inactive').length,
      categories: [...new Set(libraries.map(l => l.category))].sort().length
    };
    const output = `// Generated by build.js. Do not edit.

const awesomeJaxData = ${JSON.stringify(libraries, null, 2)};

const awesomeJaxMeta = ${JSON.stringify(meta, null, 2)};

if (typeof window !== 'undefined') {
  window.awesomeJaxData = awesomeJaxData;
  window.awesomeJaxMeta = awesomeJaxMeta;
}
`;

    const tempOutputPath = `${OUTPUT_PATH}.tmp`;
    await fs.writeFile(tempOutputPath, output);
    await fs.rename(tempOutputPath, OUTPUT_PATH);

    const stats = {
      total: libraries.length,
      active: libraries.filter(l => l.status === 'active').length,
      inactive: libraries.filter(l => l.status === 'inactive').length,
      upAndComing: libraries.filter(l => l.status === 'up-and-coming').length,
      withStars: libraries.filter(l => l.stars !== null).length
    };
    console.log(`Wrote ${OUTPUT_PATH}`);
    console.log(`${stats.total} total, ${stats.active} active, ${stats.upAndComing} up and coming, ${stats.inactive} inactive, ${stats.withStars} with GitHub metadata`);
  } catch (error) {
    console.error('Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

build();
