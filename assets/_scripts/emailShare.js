// QuickAdd user script: copies the active note as formatted HTML and opens the
// default email app so it can be pasted into a new message.
// Markdown is rendered with Obsidian's own renderer, Mermaid diagrams become PNG
// images, and internal links become plain text.
// Optional frontmatter: `email-to`, `email-subject` (falls back to `title`).

const MERMAID_TIMEOUT_MS = 5000;

// Inline styles, since email clients drop Obsidian's classes and stylesheets.
const EMAIL_STYLES = {
    table: "border-collapse: collapse; margin: 8px 0;",
    "th, td": "border: 1px solid #ccc; padding: 4px 8px; text-align: left; vertical-align: top;",
    th: "background: #f3f3f3;",
    blockquote: "border-left: 3px solid #ccc; margin: 8px 0; padding: 0 12px; color: #555;",
    code: "font-family: Menlo, Consolas, monospace; background: #f3f3f3; padding: 1px 4px; border-radius: 3px;",
    pre: "background: #f3f3f3; padding: 8px; border-radius: 4px; overflow-x: auto;",
};

function getObsidian(params) {
    if (params.obsidian) return params.obsidian;
    try {
        return window.require("obsidian");
    } catch (err) {
        throw new Error("Obsidian API not available; run this script from QuickAdd.");
    }
}

function noteBody(app, file, content) {
    const end = app.metadataCache.getFileCache(file)?.frontmatterPosition?.end?.offset;
    return end ? content.slice(end).replace(/^\s+/, "") : content;
}

async function waitForMermaid(el, expected) {
    const start = Date.now();
    while (el.querySelectorAll(".mermaid svg").length < expected) {
        if (Date.now() - start > MERMAID_TIMEOUT_MS) return false;
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return true;
}

async function svgToImage(svg) {
    const { width, height } = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    clone.style.maxWidth = "none";
    const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));

    const img = document.createElement("img");
    img.width = Math.round(width);
    img.height = Math.round(height);
    img.alt = "Diagrama";

    try {
        const source = new Image();
        await new Promise((resolve, reject) => {
            source.onload = resolve;
            source.onerror = reject;
            source.src = svgUrl;
        });
        const scale = 2;
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(width * scale);
        canvas.height = Math.ceil(height * scale);
        const ctx = canvas.getContext("2d");
        // Keep the theme background so diagrams rendered in dark mode stay readable.
        ctx.fillStyle = getComputedStyle(document.body).backgroundColor || "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(source, 0, 0, width, height);
        img.src = canvas.toDataURL("image/png");
    } catch (err) {
        console.warn("emailShare: PNG conversion failed, using SVG instead", err);
        img.src = svgUrl;
    }
    return img;
}

function prepareForEmail(el) {
    el.querySelectorAll(".copy-code-button, .frontmatter, .frontmatter-container").forEach((node) => node.remove());

    // Links to other notes mean nothing outside the vault: keep their text only.
    el.querySelectorAll("a.internal-link").forEach((link) => link.replaceWith(document.createTextNode(link.textContent)));

    for (const [selector, style] of Object.entries(EMAIL_STYLES)) {
        el.querySelectorAll(selector).forEach((node) => {
            node.setAttribute("style", (node.getAttribute("style") || "") + style);
        });
    }
}

async function writeClipboard(html, text) {
    try {
        window.require("electron").clipboard.write({ html, text });
        return;
    } catch (err) {
        console.warn("emailShare: Electron clipboard unavailable, using the web API", err);
    }
    await navigator.clipboard.write([
        new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
        }),
    ]);
}

// Copies the active note as HTML. Returns the note's file, or null if nothing was copied.
async function copyNote(params) {
    const { app } = params;
    const { Notice, MarkdownRenderer, Component } = getObsidian(params);

    const file = app.workspace.getActiveFile();
    if (!file) {
        new Notice("No active note found!");
        return null;
    }

    const markdown = noteBody(app, file, await app.vault.cachedRead(file));
    const mermaidCount = (markdown.match(/^\s*```mermaid/gm) || []).length;

    // Mermaid needs the element in the document to measure its layout.
    const el = document.createElement("div");
    el.className = "markdown-rendered";
    el.style.cssText = "position: fixed; left: -10000px; top: 0; width: 800px;";
    document.body.appendChild(el);

    const component = new Component();
    component.load();
    try {
        await MarkdownRenderer.render(app, markdown, el, file.path, component);

        if (!(await waitForMermaid(el, mermaidCount))) {
            new Notice("⚠️ Some Mermaid diagrams didn't render in time and were left out.");
        }
        for (const svg of el.querySelectorAll(".mermaid svg")) {
            const container = svg.closest(".mermaid");
            container.replaceWith(await svgToImage(svg));
        }

        prepareForEmail(el);
        await writeClipboard(el.innerHTML, markdown);
    } finally {
        component.unload();
        el.remove();
    }

    return file;
}

function openExternal(url) {
    try {
        window.require("electron").shell.openExternal(url);
    } catch (err) {
        window.open(url);
    }
}

module.exports = async (params) => {
    const { app } = params;
    const { Notice } = getObsidian(params);

    const file = await copyNote(params);
    if (!file) return;

    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter || {};
    const to = frontmatter["email-to"] || "";
    const subject = frontmatter["email-subject"] || frontmatter["title"] || file.basename;

    openExternal(`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}`);
    new Notice("🚀 Email ready! Press Cmd+V to paste the note.");
};
