import fs from "fs";
import path from "path";
import { marked } from "marked";

const __dirname = process.cwd();

// Paths
const postsPath = path.join(__dirname, "blog/posts.json");
const templatePath = path.join(__dirname, "press/blog-template.html");
const outputBase = path.join(__dirname, "press");

// Load data
const posts = JSON.parse(fs.readFileSync(postsPath, "utf-8"));
const template = fs.readFileSync(templatePath, "utf-8");

function ensureMetaTags(html) {
  const hasHead = /<head>[\s\S]*<\/head>/i.test(html);
  if (!hasHead) {
    throw new Error("Template missing <head> section.");
  }

  let headContent = html.match(/<head>([\s\S]*?)<\/head>/i)[1];

  // Inject meta tags if missing
  if (!headContent.includes("<meta name=\"description\""))
    headContent += `\n<meta name="description" content="">`;
  if (!headContent.includes("<meta property=\"og:title\""))
    headContent += `\n<meta property="og:title" content="">`;
  if (!headContent.includes("<meta property=\"og:description\""))
    headContent += `\n<meta property="og:description" content="">`;
  if (!headContent.includes("<meta property=\"og:image\""))
    headContent += `\n<meta property="og:image" content="">`;
  if (!headContent.includes("<meta property=\"og:type\""))
    headContent += `\n<meta property="og:type" content="article">`;
  if (!headContent.includes("<meta name=\"twitter:card\""))
    headContent += `\n<meta name="twitter:card" content="summary_large_image">`;
  if (!headContent.includes("<meta name=\"twitter:title\""))
    headContent += `\n<meta name="twitter:title" content="">`;
  if (!headContent.includes("<meta name=\"twitter:description\""))
    headContent += `\n<meta name="twitter:description" content="">`;
  if (!headContent.includes("<meta name=\"twitter:image\""))
    headContent += `\n<meta name="twitter:image" content="">`;

  return html.replace(/<head>[\s\S]*<\/head>/i, `<head>${headContent}</head>`);
}

function injectContent(template, postHtml, post, allPosts) {
  let result = ensureMetaTags(template);

  // Inject <title>
  result = result.replace(/<title>.*<\/title>/, `<title>${post.title}</title>`);

  // Inject meta tags
  result = result
    .replace(/<meta name="description" content=".*">/, `<meta name="description" content="${post.excerpt}">`)
    .replace(/<meta property="og:title" content=".*">/, `<meta property="og:title" content="${post.title}">`)
    .replace(/<meta property="og:description" content=".*">/, `<meta property="og:description" content="${post.excerpt}">`)
    .replace(/<meta property="og:image" content=".*">/, `<meta property="og:image" content="${post.image}">`)
    .replace(/<meta name="twitter:title" content=".*">/, `<meta name="twitter:title" content="${post.title}">`)
    .replace(/<meta name="twitter:description" content=".*">/, `<meta name="twitter:description" content="${post.excerpt}">`)
    .replace(/<meta name="twitter:image" content=".*">/, `<meta name="twitter:image" content="${post.image}">`);

  // Inject blog post content
  result = result.replace(
    /<main id="blog-content">[\s\S]*?<\/main>/,
    `<main id="blog-content">${postHtml}</main>`
  );

  // Related posts
  const related = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3)
    .map(
      (p) => `
      <div class="related-post">
        <a href="/press/${p.id}/">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
        </a>
      </div>`
    )
    .join("\n");

  result = result.replace(
    /<div id="related-posts-container">[\s\S]*?<\/div>/,
    `<div id="related-posts-container">${related}</div>`
  );

  return result;
}

async function build() {
  console.log("⚙️ Building static blog pages...");

  for (const post of posts) {
    const mdPath = path.join(__dirname, post.contentFile);
    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠️ Missing markdown: ${mdPath}`);
      continue;
    }

    const mdContent = fs.readFileSync(mdPath, "utf-8");
    const html = marked.parse(mdContent);
    const outputHtml = injectContent(template, html, post, posts);

    const postDir = path.join(outputBase, post.id);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, "index.html"), outputHtml);

    console.log(`✅ Built /press/${post.id}/index.html`);
  }

  console.log("✨ All posts generated successfully!");
}

build().catch(console.error);
