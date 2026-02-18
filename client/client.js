(() => {
  let lastX = null;
  let lastY = null;
  let currentEl = null;

  const overlays = {};

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

  function clear() {
    currentEl = null;
    Object.values(overlays).forEach(o => (o.style.display = "none"));
  }

  function px(n) {
    return parseFloat(n) || 0;
  }

  function highlight(el) {
    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(el);

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const margin = {
      top: px(styles.marginTop),
      right: px(styles.marginRight),
      bottom: px(styles.marginBottom),
      left: px(styles.marginLeft)
    };

    const border = {
      top: px(styles.borderTopWidth),
      right: px(styles.borderRightWidth),
      bottom: px(styles.borderBottomWidth),
      left: px(styles.borderLeftWidth)
    };

    const padding = {
      top: px(styles.paddingTop),
      right: px(styles.paddingRight),
      bottom: px(styles.paddingBottom),
      left: px(styles.paddingLeft)
    };

    // Margin box
    Object.assign(overlays.margin.style, {
      display: "block",
      top: rect.top + scrollY - margin.top + "px",
      left: rect.left + scrollX - margin.left + "px",
      width: rect.width + margin.left + margin.right + "px",
      height: rect.height + margin.top + margin.bottom + "px"
    });

    // Border box
    Object.assign(overlays.border.style, {
      display: "block",
      top: rect.top + scrollY + "px",
      left: rect.left + scrollX + "px",
      width: rect.width + "px",
      height: rect.height + "px"
    });

    // Padding box
    Object.assign(overlays.padding.style, {
      display: "block",
      top: rect.top + scrollY + border.top + "px",
      left: rect.left + scrollX + border.left + "px",
      width: rect.width - border.left - border.right + "px",
      height: rect.height - border.top - border.bottom + "px"
    });

    // Content box
    Object.assign(overlays.content.style, {
      display: "block",
      top: rect.top + scrollY + border.top + padding.top + "px",
      left: rect.left + scrollX + border.left + padding.left + "px",
      width:
        rect.width -
        border.left -
        border.right -
        padding.left -
        padding.right +
        "px",
      height:
        rect.height -
        border.top -
        border.bottom -
        padding.top -
        padding.bottom +
        "px"
    });
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

  document.addEventListener("mousemove", e => {
    lastX = e.clientX;
    lastY = e.clientY;
    update();
  });

  document.addEventListener(
    "scroll",
    () => {
      update();
    },
    true
  );

  initOverlays();
})();
