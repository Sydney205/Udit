const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.pointerEvents = "none";
overlay.style.border = "2px solid red";
overlay.style.zIndex = "9999";
document.body.appendChild(overlay);

document.addEventListener("mousemove", (e) => {
  const el = e.target;
  const rect = el.getBoundingClientRect();

  overlay.style.top = rect.top + "px";
  overlay.style.left = rect.left + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
});

document.addEventListener("click", (e) => {
  e.preventDefault();
  const el = e.target;

  const file = el.dataset.sourceFile;
  const line = el.dataset.sourceLine;

  if (!file || !line) return;

  fetch("/udit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, line }),
  });
});
