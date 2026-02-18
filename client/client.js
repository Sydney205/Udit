(() => {
  let lastX = null;
  let lastY = null;
  let currentEl = null;

  const overlays = {};
  let tooltip;

  /* ---------- Overlay Layers ---------- */

  function createLayer(name, color) {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      pointerEvents: "none",
      border: `2px solid ${color}`,
      background: color.replace("1)", "0.15)"),
      zIndex: "999999",
      display: "none",
      boxSizing: "border-box"
    });
    document.body.appendChild(el);
    overlays[name] = el;
  }

  function initOverlays() {
    createLayer("margin", "rgba(245, 158, 11, 1)");
    createLayer("border", "rgba(234, 179, 8, 1)");
    createLayer("padding", "rgba(34, 197, 94, 1)");
    createLayer("content", "rgba(59, 130, 246, 1)");
  }

  /* ---------- Tooltip ---------- */

  function createTooltip() {
    tooltip = document.createElement("div");
    Object.assign(tooltip.style, {
      position: "fixed",
      pointerEvents: "none",
      background: "#111827",
      color: "#e5e7eb",
      fontFamily: "monospace",
      fontSize: "12px",
      padding: "6px 8px",
      borderRadius: "6px",
      zIndex: "1000000",
      display: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
      whiteSpace: "nowrap"
    });
    document.body.appendChild(tooltip);
  }

  /* ---------- Helpers ---------- */

  function px(v) {
    return parseFloat(v) || 0;
  }

  function clear() {
    currentEl = null;
    Object.values(overlays).forEach(o => (o.style.display = "none"));
    tooltip.style.display = "none";
  }

  function updateTooltip(el) {
    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(el);

    const tag = el.tagName.toLowerCase();
    const cls = el.className
      ? "." + el.className.trim().split(/\s+/).join(".")
      : "";

    tooltip.innerHTML = `
      <strong>${tag}${cls}</strong><br>
      ${Math.round(rect.width)} × ${Math.round(rect.height)}<br>
      margin: ${styles.margin}<br>
      padding: ${styles.padding}
    `;

    let top = rect.top - tooltip.offsetHeight - 8;
    if (top < 0) top = rect.bottom + 8;

    tooltip.style.top = top + "px";
    tooltip.style.left = rect.left + "px";
    tooltip.style.display = "block";
  }

  /* ---------- Highlight Logic ---------- */

  function highlight(el) {
    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(el);

    const sx = window.scrollX;
    const sy = window.scrollY;

    const margin = {
      t: px(styles.marginTop),
      r: px(styles.marginRight),
      b: px(styles.marginBottom),
      l: px(styles.marginLeft)
    };

    const border = {
      t: px(styles.borderTopWidth),
      r: px(styles.borderRightWidth),
      b: px(styles.borderBottomWidth),
      l: px(styles.borderLeftWidth)
    };

    const padding = {
      t: px(styles.paddingTop),
      r: px(styles.paddingRight),
      b: px(styles.paddingBottom),
      l: px(styles.paddingLeft)
    };

    Object.assign(overlays.margin.style, {
      display: "block",
      top: rect.top + sy - margin.t + "px",
      left: rect.left + sx - margin.l + "px",
      width: rect.width + margin.l + margin.r + "px",
      height: rect.height + margin.t + margin.b + "px"
    });

    Object.assign(overlays.border.style, {
      display: "block",
      top: rect.top + sy + "px",
      left: rect.left + sx + "px",
      width: rect.width + "px",
      height: rect.height + "px"
    });

    Object.assign(overlays.padding.style, {
      display: "block",
      top: rect.top + sy + border.t + "px",
      left: rect.left + sx + border.l + "px",
      width: rect.width - border.l - border.r + "px",
      height: rect.height - border.t - border.b + "px"
    });

    Object.assign(overlays.content.style, {
      display: "block",
      top: rect.top + sy + border.t + padding.t + "px",
      left: rect.left + sx + border.l + padding.l + "px",
      width:
        rect.width -
        border.l -
        border.r -
        padding.l -
        padding.r +
        "px",
      height:
        rect.height -
        border.t -
        border.b -
        padding.t -
        padding.b +
        "px"
    });

    updateTooltip(el);
  }

  function update() {
    if (lastX == null || lastY == null) return;

    const el = document.elementFromPoint(lastX, lastY);
    if (!el || el === document.body || el === document.documentElement) {
      clear();
      return;
    }

    if (el !== currentEl) {
      currentEl = el;
      highlight(el);
    }
  }

  /* ---------- Events ---------- */

  document.addEventListener("mousemove", e => {
    lastX = e.clientX;
    lastY = e.clientY;
    update();
  });

  document.addEventListener("scroll", update, true);

  /* ---------- Init ---------- */

  initOverlays();
  createTooltip();
})();

