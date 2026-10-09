// QuickAdd user script: copies the active note for messaging apps like WhatsApp.
// The text is converted to WhatsApp formatting (*bold* headings, _italic_,
// ~strike~, lists, quotes, ``` blocks), tables become lists and links become plain
// text. Mermaid diagrams become PNG images, named by their title when they have one; since the clipboard holds one thing at
// a time, a panel opens with a button to copy each diagram after pasting the text.

const MERMAID_TIMEOUT_MS = 5000;

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

// Markdown inline syntax → WhatsApp inline syntax.
function convertInline(text) {
    const codeSpans = [];
    const BOLD = "\u0001";
    return text
        .replace(/`([^`]+)`/g, (_, code) => `\u0002${codeSpans.push(code) - 1}\u0002`)
        .replace(/!\[\[[^\]]*\]\]/g, "")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) =>
            /^(https?|mailto):/.test(url) ? `${label} (${url})` : label)
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
        .replace(/\[\[([^\]]+)\]\]/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/(\*\*\*|___)(?!\s)(.+?)\1/g, `${BOLD}_$2_${BOLD}`)
        .replace(/(\*\*|__)(?!\s)(.+?)\1/g, `${BOLD}$2${BOLD}`)
        .replace(/(^|[^\w*])\*(?!\s)([^*]+?)\*(?!\w)/g, "$1_$2_")
        .replace(/~~(.+?)~~/g, "~$1~")
        .replace(new RegExp(BOLD, "g"), "*")
        .replace(/\u0002(\d+)\u0002/g, (_, i) => `\`${codeSpans[i]}\``);
}

function splitRow(line) {
    return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

// A diagram's name, from (in order) its frontmatter `title:`, an `accTitle:` line or a
// `title …` line (timeline, pie, gantt, journey…). Falls back to "Diagrama N".
function diagramName(source, number) {
    const patterns = [
        /^\s*---\s*\n[\s\S]*?^\s*title:\s*(.+?)\s*$[\s\S]*?^\s*---\s*$/m,
        /^\s*accTitle\s*:\s*(.+?)\s*$/m,
        /^\s*title\s+(.+?)\s*$/m,
    ];
    for (const pattern of patterns) {
        const match = source.match(pattern);
        if (match) return match[1].replace(/^["']|["']$/g, "");
    }
    return `Diagrama ${number}`;
}

// Tables don't exist in WhatsApp: each row becomes a list item with its non-empty cells.
function convertTable(rows) {
    return rows
        .slice(1)
        .filter((row) => !/^[\s|:-]+$/.test(row))
        .map((row) => splitRow(row).filter(Boolean).map(convertInline).join(" · "))
        .filter(Boolean)
        .map((row) => `- ${row}`);
}

// Returns the note as WhatsApp-formatted text plus each Mermaid diagram's name and
// source. Each diagram is replaced in the text by a "[name]" marker.
function toMessageText(markdown) {
    const out = [];
    const diagrams = [];
    let fence = null;
    let fenceLines = [];
    let table = [];

    const flushTable = () => {
        if (table.length) out.push(...convertTable(table));
        table = [];
    };

    for (const line of markdown.replace(/%%[\s\S]*?%%/g, "").split("\n")) {
        const fenceMatch = line.match(/^\s*```\s*(\S*)/);
        if (fence) {
            if (!fenceMatch) {
                fenceLines.push(line);
                continue;
            }
            if (fence === "mermaid") {
                const source = fenceLines.join("\n");
                const name = diagramName(source, diagrams.length + 1);
                diagrams.push({ name, source });
                out.push(`[${name}]`);
            } else {
                out.push("```", ...fenceLines, "```");
            }
            fence = null;
            fenceLines = [];
            continue;
        }
        if (fenceMatch) {
            flushTable();
            fence = fenceMatch[1] || "code";
            continue;
        }
        if (/^\s*\|.*\|\s*$/.test(line)) {
            table.push(line);
            continue;
        }
        flushTable();

        const heading = line.match(/^#{1,6}\s+(.*)$/);
        const listItem = line.match(/^(\s*)[*+-]\s+(.*)$/);
        const quote = line.match(/^\s*>\s?(.*)$/);
        if (heading) {
            out.push(`*${convertInline(heading[1]).replace(/\*/g, "").trim()}*`);
        } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
            out.push("");
        } else if (listItem) {
            out.push(`${listItem[1]}- ${convertInline(listItem[2])}`);
        } else if (quote) {
            out.push(`> ${convertInline(quote[1])}`);
        } else {
            out.push(convertInline(line));
        }
    }
    flushTable();

    return { text: out.join("\n").replace(/\n{3,}/g, "\n\n").trim(), diagrams };
}

async function waitForMermaid(el, expected) {
    const start = Date.now();
    while (el.querySelectorAll(".mermaid svg").length < expected) {
        if (Date.now() - start > MERMAID_TIMEOUT_MS) return false;
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return true;
}

async function svgToPng(svg) {
    const { width, height } = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    clone.style.maxWidth = "none";

    const source = new Image();
    await new Promise((resolve, reject) => {
        source.onload = resolve;
        source.onerror = reject;
        source.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
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
    return canvas.toDataURL("image/png");
}

// Renders each diagram with Obsidian's Mermaid and returns PNG data URLs, in order.
async function renderDiagrams(app, obsidian, file, diagrams) {
    const { MarkdownRenderer, Component } = obsidian;
    const markdown = diagrams.map(({ source }) => "```mermaid\n" + source + "\n```").join("\n\n");

    // Mermaid needs the element in the document to measure its layout.
    const el = document.createElement("div");
    el.className = "markdown-rendered";
    el.style.cssText = "position: fixed; left: -10000px; top: 0; width: 800px;";
    document.body.appendChild(el);

    const component = new Component();
    component.load();
    try {
        await MarkdownRenderer.render(app, markdown, el, file.path, component);
        await waitForMermaid(el, diagrams.length);
        const pngs = [];
        for (const svg of el.querySelectorAll(".mermaid svg")) {
            try {
                pngs.push(await svgToPng(svg));
            } catch (err) {
                console.warn("copyFormatted: PNG conversion failed", err);
                pngs.push(null);
            }
        }
        return pngs;
    } finally {
        component.unload();
        el.remove();
    }
}

async function copyText(text) {
    try {
        window.require("electron").clipboard.writeText(text);
    } catch (err) {
        await navigator.clipboard.writeText(text);
    }
}

async function copyPng(dataUrl) {
    try {
        const { clipboard, nativeImage } = window.require("electron");
        clipboard.writeImage(nativeImage.createFromDataURL(dataUrl));
    } catch (err) {
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    }
}

function openDiagramPanel(app, obsidian, text, diagrams, pngs) {
    const { Modal, Notice } = obsidian;

    class DiagramPanel extends Modal {
        onOpen() {
            const { contentEl } = this;
            contentEl.createEl("h3", { text: "Copy for messaging" });
            contentEl.createEl("p", {
                text: "The text is in the clipboard. Paste it, then come back to copy each diagram and paste it where its [name] marker was.",
            });

            const addButton = (label, onCopy) => {
                const button = contentEl.createEl("button", { text: label });
                button.style.cssText = "display: block; margin: 8px 0;";
                button.onclick = async () => {
                    await onCopy();
                    button.setText(`${label} ✓`);
                    new Notice(`📋 ${label}: copied.`);
                };
            };

            addButton("Text", () => copyText(text));
            diagrams.forEach(({ name }, i) => {
                if (pngs[i]) addButton(name, () => copyPng(pngs[i]));
                else contentEl.createEl("p", { text: `${name} couldn't be rendered.` });
            });
        }

        onClose() {
            this.contentEl.empty();
        }
    }

    new DiagramPanel(app).open();
}

module.exports = async (params) => {
    const { app } = params;
    const obsidian = getObsidian(params);
    const { Notice } = obsidian;

    const file = app.workspace.getActiveFile();
    if (!file) {
        new Notice("No active note found!");
        return;
    }

    const { text, diagrams } = toMessageText(noteBody(app, file, await app.vault.cachedRead(file)));
    await copyText(text);

    if (!diagrams.length) {
        new Notice("📋 Note copied for messaging.");
        return;
    }
    const pngs = await renderDiagrams(app, obsidian, file, diagrams);
    openDiagramPanel(app, obsidian, text, diagrams, pngs);
};
module.exports.toMessageText = toMessageText;
