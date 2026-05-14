const files = {
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Timi's project</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vscode/codicons@0.0.35/dist/codicon.css">
  <link rel="stylesheet" href="project.css">
</head>
<body>
<div class="Top menu">
  <span class="firstitem">File</span>
  <span class="firstitem">Edit</span>
  <span class="firstitem">Selection</span>
  <span class="firstitem">View</span>
  <span class="firstitem">Go</span>
  <span class="firstitem">Run</span>
  <span class="firstitem">Terminal</span>
  <span class="firstitem">Help</span>
</div>>`,
  "styles.css": `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Consolas, monospace;
}
body { background: #1e1e1e; color: #d4d4d4; }
.Top menu {
  display: flex;
  background: #3c3c3c;
  padding: 4px 8px;
  gap: 4px;
  flex-shrink: 0;
}
.firstitem {
  padding: 2px 8px;
  font-size: 13px;
  color: #cccccc;
  cursor: pointer;
  border-radius: 3px;
  font-family: 'Segoe UI', sans-serif;
}
.firstitem:hover { background: rgba(255,255,255,0.1); }
.app { display: flex; height: calc(100vh - 29px); }
`,
  "app.js": `let openTabs = [], currentFile = null;

const editor = document.getElementById("editor");
const lines  = document.getElementById("lines");
const tabs   = document.getElementById("tabs");

function openFile(name) {
  document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
  document.getElementById("fi-" + name).classList.add("active");
  if (!openTabs.includes(name)) openTabs.push(name);
  currentFile = name;
  editor.innerText = files[name];
  document.getElementById("statusLang").textContent =
    { html:"HTML", css:"CSS", js:"JavaScript", md:"Markdown" }[name.split(".").pop()] || "Text";
  updateLines();
  renderTabs();`,
  
};

let openTabs = [], currentFile = null;

const editor = document.getElementById("editor");
const lines  = document.getElementById("lines");
const tabs   = document.getElementById("tabs");

function openFile(name) {
  document.querySelectorAll(".file").forEach(f => f.classList.remove("active"));
  document.getElementById("fi-" + name).classList.add("active");
  if (!openTabs.includes(name)) openTabs.push(name);
  currentFile = name;
  editor.innerText = files[name];
  document.getElementById("statusLang").textContent =
    { html:"HTML", css:"CSS", js:"JavaScript", md:"Markdown" }[name.split(".").pop()] || "Text";
  updateLines();
  renderTabs();
}

function renderTabs() {
  tabs.innerHTML = "";
  openTabs.forEach(name => {
    const t = document.createElement("div");
    t.className = "tab" + (name === currentFile ? " active" : "");
    t.innerHTML = `<i class="codicon codicon-symbol-file" style="color:${{ "index.html":"#e37933","styles.css":"#519aba","app.js":"#e5c07b","README.md":"#89ca78" }[name]};font-size:15px"></i> ${name} <span class="tab-close">×</span>`;
    t.onclick = () => openFile(name);
    t.querySelector(".tab-close").onclick = e => { e.stopPropagation(); closeTab(name); };
    tabs.appendChild(t);
  });
}

function closeTab(name) {
  openTabs.splice(openTabs.indexOf(name), 1);
  if (!openTabs.length) { editor.innerText = ""; lines.textContent = ""; tabs.innerHTML = ""; currentFile = null; return; }
  openFile(openTabs[0]);
}

function updateLines() {
  lines.textContent = editor.innerText.split("\n").map((_, i) => i + 1).join("\n");
}

editor.addEventListener("input", () => { if (currentFile) files[currentFile] = editor.innerText; updateLines(); });
editor.addEventListener("keydown", e => {
  if (e.key === "Tab") { e.preventDefault(); document.execCommand("insertText", false, "  "); }
  if (e.ctrlKey && e.key === "s" && currentFile) { e.preventDefault(); const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([editor.innerText])), download: currentFile }); a.click(); }
});
editor.addEventListener("keyup", updateCursor);
editor.addEventListener("click", updateCursor);

function updateCursor() {
  try {
    const r = window.getSelection().getRangeAt(0).cloneRange();
    r.setStart(editor, 0);
    const rows = r.toString().split("\n");
    document.getElementById("statusPos").textContent = `Ln ${rows.length}, Col ${rows.at(-1).length + 1}`;
  } catch(e) {}
}

function toggleSidebar() { document.getElementById("sidebar").classList.toggle("hidden"); }
function toggleFolder() {
  const fl = document.getElementById("fileList");
  const ar = document.getElementById("arrow");
  fl.style.display = fl.style.display === "none" ? "" : "none";
  ar.classList.toggle("open");
}

openFile("index.html");
