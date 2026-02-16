(() => {
  // Reliable circular tab icon for Chrome/Safari.
  // Uses the existing avatar PNG, scales it to "contain" (full body),
  // and applies a circle mask with transparent corners.

  const AVATAR_SRC = "./images/jaime-avatar.png";
  const SIZE = 96;

  const clearExistingIcons = () => {
    // Chrome can keep the first-loaded icon around; removing + re-adding helps.
    document
      .querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')
      .forEach((link) => link.remove());
  };

  const addLink = (rel, href) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.type = "image/png";
    link.href = href;
    document.head.appendChild(link);
  };

  const setIcon = (dataUrl) => {
    clearExistingIcons();
    addLink("icon", dataUrl);
    addLink("shortcut icon", dataUrl);
  };

  const img = new Image();
  img.decoding = "async";
  img.src = AVATAR_SRC;

  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return;

      // Circle mask
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Subtle background helps the icon read on light tabs.
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Contain the full avatar inside the square.
      const pad = SIZE * 0.08;
      const maxW = SIZE - pad * 2;
      const maxH = SIZE - pad * 2;
      const scale = Math.min(maxW / w, maxH / h);
      const dw = w * scale;
      const dh = h * scale;
      const dx = (SIZE - dw) / 2;
      const dy = (SIZE - dh) / 2 + SIZE * 0.02; // tiny nudge down

      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      setIcon(canvas.toDataURL("image/png"));
    } catch (e) {
      // Leave static favicon links as fallback.
    }
  };
})();

