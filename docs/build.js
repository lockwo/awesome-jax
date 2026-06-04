#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Configuration
const README_PATH = path.join(__dirname, '..', 'README.md');
const OUTPUT_PATH = path.join(__dirname, 'data.js');
const CACHE_PATH = path.join(__dirname, '.github-cache.json');
const CATEGORIES_PATH = path.join(__dirname, 'categories.json');
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Parse command line arguments
const args = process.argv.slice(2);
const noGithub = args.includes('--no-github');
const noCache = args.includes('--no-cache');

// Category resolution (README is never modified by this script):
//   1. Libraries indented under a "- X Libraries" header in the README take that
//      header as their category (the existing top-level categories).
//   2. Everything else (the flat list, Up-and-Coming, Inactive) is categorized
//      via docs/categories.json — a website-only map of "owner/repo" -> category.
//   3. Anything still unmatched falls back to "Other".
// Status is derived from the "### Up and Coming" / "### Inactive" sub-headers.
let CATEGORY_OVERRIDES = {};
try {
  const raw = JSON.parse(require('fs').readFileSync(CATEGORIES_PATH, 'utf8'));
  CATEGORY_OVERRIDES = raw.categories || raw || {};
} catch {
  console.warn('⚠️  Could not read categories.json — flat libraries will be "Other"');
}

// Helper function to make HTTPS requests (follows redirects)
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

    https.get(requestOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Resolve relative redirect targets against the current URL.
        const nextUrl = new URL(res.headers.location, url).toString();
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
    }).on('error', reject);
  });
}

// Fetch GitHub data for a repository
async function fetchGithubData(owner, repo) {
  const headers = GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {};

  try {
    // Fetch repo data
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoData = await httpsRequest(repoUrl, { headers });

    // Fetch latest commit
    const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
    const commitsData = await httpsRequest(commitsUrl, { headers });

    return {
      stars: repoData.stargazers_count,
      lastCommit: commitsData[0]?.commit?.committer?.date || null
    };
  } catch (error) {
    console.error(`  ⚠️  Failed to fetch ${owner}/${repo}: ${error.message}`);
    return null;
  }
}

// Load cache
async function loadCache() {
  if (noCache) return { data: {}, timestamp: 0 };

  try {
    const cacheContent = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(cacheContent);
  } catch {
    return { data: {}, timestamp: 0 };
  }
}

// Save cache
async function saveCache(cache) {
  if (noGithub) return; // Don't save cache in no-github mode

  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Failed to save cache:', error.message);
  }
}

// Parse README and extract libraries
async function parseReadme() {
  const content = await fs.readFile(README_PATH, 'utf8');
  const lines = content.split('\n');

  const libraries = [];
  let currentCategory = null;
  let currentStatus = 'active';
  let inLibrarySection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Enter the Libraries section
    if (line.trim() === '## Libraries') {
      inLibrarySection = true;
      currentStatus = 'active';
      currentCategory = null;
      continue;
    }

    // Exit when we hit the next major (H2) section
    if (line.startsWith('## ') && line.trim() !== '## Libraries') {
      inLibrarySection = false;
      continue;
    }

    if (!inLibrarySection) continue;

    // Status sub-sections (H3 headers). Each one resets the active category so
    // libraries don't inherit a category from the previous section.
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
    // Any other H3 (e.g. a future "### Active Libraries") just resets category.
    if (line.startsWith('### ')) {
      currentCategory = null;
      continue;
    }

    // Category header: a top-level bullet ending in "Libraries" that is not a link.
    const categoryMatch = line.match(/^- (.+ Libraries)\s*$/);
    if (categoryMatch && !line.includes('](')) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Library entry (at any indentation level).
    const libraryMatch = line.match(/^(\s*)- \[([^\]]+)\]\(([^)]+)\)(?:\s*-\s*(.+))?/);
    if (libraryMatch) {
      const [, indentStr, name, url, restOfLine] = libraryMatch;
      const indent = indentStr.length;

      // Extract GitHub owner/repo from URL
      const githubMatch = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
      if (githubMatch) {
        const [, owner, repo] = githubMatch;
        const repoKey = `${owner}/${repo.replace(/[#?].*$/, '').replace(/\/$/, '')}`;

        // Status comes from the current sub-section, but an inline shields.io
        // badge (legacy format) takes precedence if present.
        let status = currentStatus;
        if (line.includes('inactive-red')) {
          status = 'inactive';
        } else if (line.includes('upcoming-brightgreen')) {
          status = 'up-and-coming';
        }

        // Category precedence:
        //   inline <!--cat:X--> tag  >  README header (if indented under one)
        //   >  categories.json override  >  "Other".
        // Flat (un-indented) libraries never inherit a header's category.
        let category;
        const catTag = line.match(/<!--\s*cat:\s*([^>]+?)\s*-->/i);
        if (catTag) {
          category = catTag[1].trim();
        } else if (indent > 0 && currentCategory) {
          category = currentCategory;
        } else {
          category = CATEGORY_OVERRIDES[repoKey] || 'Other';
        }

        // Clean description: strip HTML comments and image badges, flatten any
        // markdown links ([text](url) -> text), then collapse whitespace.
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
          repo: repo.replace(/[#?].*$/, '').replace(/\/$/, ''), // strip anchors/queries/trailing slash
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

// Main build function
async function build() {
  try {
    console.log('🚀 Building awesome-jax data...\n');

    // Parse README
    console.log('📖 Reading README.md...');
    const libraries = await parseReadme();
    console.log(`✅ Found ${libraries.length} libraries\n`);

    // Load cache
    const cache = await loadCache();
    const now = Date.now();
    const cacheExpired = now - cache.timestamp > CACHE_TTL;

    // Fetch GitHub data if enabled
    if (!noGithub) {
      console.log('🔍 Fetching GitHub data...');
      if (GITHUB_TOKEN) {
        console.log('✅ GitHub token detected - using higher rate limits');
      } else {
        console.log('⚠️  No GitHub token detected - using lower rate limits');
        console.log('   Set GITHUB_TOKEN environment variable for 50x faster fetching');
      }

      // Determine batch size based on token availability
      const BATCH_SIZE = GITHUB_TOKEN ? 10 : 3; // Parallel requests per batch
      const BATCH_DELAY = GITHUB_TOKEN ? 200 : 2000; // Delay between batches

      let fetchCount = 0;
      let cacheHits = 0;
      let toFetch = [];

      // First, identify what needs fetching
      for (const lib of libraries) {
        const cacheKey = `${lib.owner}/${lib.repo}`;

        // Check cache
        const cached = cache.data[cacheKey];
        if (cached && !cacheExpired) {
          lib.stars = cached.stars;
          lib.lastCommit = cached.lastCommit;
          cacheHits++;
        } else {
          toFetch.push(lib);
        }
      }

      console.log(`📊 Status: ${cacheHits} from cache, ${toFetch.length} to fetch`);

      if (toFetch.length > 0) {
        console.log(`🚀 Fetching in parallel (batch size: ${BATCH_SIZE})...\n`);

        // Process in batches
        for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
          const batch = toFetch.slice(i, i + BATCH_SIZE);
          const batchNum = Math.floor(i / BATCH_SIZE) + 1;
          const totalBatches = Math.ceil(toFetch.length / BATCH_SIZE);

          console.log(`  Batch ${batchNum}/${totalBatches}: Fetching ${batch.map(l => l.name).join(', ')}...`);

          // Fetch batch in parallel
          const promises = batch.map(async (lib) => {
            const data = await fetchGithubData(lib.owner, lib.repo);
            if (data) {
              lib.stars = data.stars;
              lib.lastCommit = data.lastCommit;
              const cacheKey = `${lib.owner}/${lib.repo}`;
              cache.data[cacheKey] = { stars: data.stars, lastCommit: data.lastCommit };
              return { lib: lib.name, success: true };
            } else {
              return { lib: lib.name, success: false };
            }
          });

          const results = await Promise.all(promises);

          const successful = results.filter(r => r.success).length;
          const failed = results.filter(r => !r.success).length;

          console.log(`    ✓ Completed: ${successful} successful${failed > 0 ? `, ${failed} failed` : ''}`);
          fetchCount += batch.length;

          // Delay between batches to respect rate limits
          if (i + BATCH_SIZE < toFetch.length) {
            if (!GITHUB_TOKEN && batchNum % 3 === 0) {
              console.log(`  ⏸️  Pausing to respect rate limits...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
              await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
          }
        }
      }

      cache.timestamp = now;
      await saveCache(cache);
    } else {
      console.log('⏩ Skipping GitHub fetch (--no-github) — reusing cached values where available\n');
      let cacheHits = 0;
      for (const lib of libraries) {
        const cached = cache.data[`${lib.owner}/${lib.repo}`];
        if (cached) {
          lib.stars = cached.stars;
          lib.lastCommit = cached.lastCommit;
          cacheHits++;
        }
      }
      console.log(`📊 Applied cached GitHub data to ${cacheHits}/${libraries.length} libraries`);
    }

    // Sort libraries by stars (descending)
    libraries.sort((a, b) => (b.stars || 0) - (a.stars || 0));

    // Generate output
    console.log('\n📝 Generating data.js...');
    const generatedAt = new Date().toISOString();
    const meta = {
      generatedAt,
      total: libraries.length,
      active: libraries.filter(l => l.status === 'active').length,
      upAndComing: libraries.filter(l => l.status === 'up-and-coming').length,
      inactive: libraries.filter(l => l.status === 'inactive').length,
      categories: [...new Set(libraries.map(l => l.category))].sort().length
    };
    const output = `// Auto-generated from README.md — do not edit by hand.
// Last updated: ${generatedAt}
// Total libraries: ${libraries.length}

const awesomeJaxData = ${JSON.stringify(libraries, null, 2)};

const awesomeJaxMeta = ${JSON.stringify(meta, null, 2)};

// Make available for browser
if (typeof window !== 'undefined') {
  window.awesomeJaxData = awesomeJaxData;
  window.awesomeJaxMeta = awesomeJaxMeta;
}
`;

    await fs.writeFile(OUTPUT_PATH, output);
    console.log(`✅ Generated ${OUTPUT_PATH}`);

    // Summary
    const stats = {
      total: libraries.length,
      active: libraries.filter(l => l.status === 'active').length,
      inactive: libraries.filter(l => l.status === 'inactive').length,
      upAndComing: libraries.filter(l => l.status === 'up-and-coming').length,
      withStars: libraries.filter(l => l.stars !== null).length
    };

    console.log('\n📊 Summary:');
    console.log(`  Total: ${stats.total} libraries`);
    console.log(`  Active: ${stats.active}`);
    console.log(`  Inactive: ${stats.inactive}`);
    console.log(`  Up and Coming: ${stats.upAndComing}`);
    if (!noGithub) {
      console.log(`  With GitHub data: ${stats.withStars}`);
    }

    console.log('\n✨ Build complete!');
    console.log('   Run "npm run serve" to view the site locally');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run build
build();