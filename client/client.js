(() => {
  let lastX = null;
  let lastY = null;
  let currentEl = null;

  let overlay = null;
  let tooltip = null;

  /* ---------------- Overlay ---------------- */

  function createOverlay() {
    overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      pointerEvents: "none",
      border: "2px solid #4ade80",
      background: "rgba(74, 222, 128, 0.08)",
      zIndex: "999999",
      display: "none",
      boxSizing: "border-box"
    });

    document.body.appendChild(overlay);
  }

  /* ---------------- Tooltip ---------------- */

  function createTooltip() {
    tooltip = document.createElement("div");
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      background: "#111827",
      color: "#e5e7eb",
      fontSize: "12px",
      fontFamily: "monospace",
      padding: "6px 8px",
      borderRadius: "6px",
      zIndex: "1000000",
      whiteSpace: "nowrap",
      display: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });

    document.body.appendChild(tooltip);
  }

  /* ---------------- Helpers ---------------- */

  function formatSpacing(value) {
    return value.replace(/\s+/g, " ");
  }

  function updateTooltip(el) {
    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(el);

    const tag = el.tagName.toLowerCase();
    const cls = el.className ? `.${el.className.split(" ").join(".")}` : "";

    tooltip.innerHTML = `
      <strong>${tag}${cls}</strong><br>
      ${Math.round(rect.width)} × ${Math.round(rect.height)}<br>
      margin: ${formatSpacing(styles.margin)}<br>
      padding: ${formatSpacing(styles.padding)}
    `;

    let top = rect.top - tooltip.offsetHeight - 8;
    let left = rect.left;

    if (top < 0) {
      top = rect.bottom + 8;
    }

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
  }

  function highlight(el) {
    const rect = el.getBoundingClientRect();

    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
    overlay.style.display = "block";

    tooltip.style.display = "block";
    updateTooltip(el);
  }

  function clearHighlight() {
    currentEl = null;
    overlay.style.display = "none";
    tooltip.style.display = "none";
  }

  /* ---------------- Core Logic ---------------- */

  function updateHighlight() {
    if (lastX === null || lastY === null) return;

    const el = document.elementFromPoint(lastX, lastY);

    if (!el || el === document.documentElement || el === document.body) {
      clearHighlight();
      return;
    }

    if (el !== currentEl) {
      currentEl = el;
      highlight(el);
    }
  }

  /* ---------------- Events ---------------- */

  document.addEventListener("mousemove", (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    updateHighlight();
  });

  document.addEventListener(
    "scroll",
    () => {
      updateHighlight();
    },
    true
  );

  /* ---------------- Init ---------------- */

  createOverlay();
  createTooltip();
})();
