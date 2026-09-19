/* Festival Greeting Generator — Core Engine */
'use strict';

// ===== State =====
const state = {
  template: 'diwali',
  englishText: 'Happy Diwali to you and your family!',
  hindiText: 'आपको और आपके परिवार को शुभ दिवाली!',
  fontSize: 48,
  fontFamily: 'Hind',
  primaryColor: '#FFD700',
  secondaryColor: '#D97706',
  accentColor: '#FFFFFF',
  logo: null,
  logoScale: 100,
  logoPosX: 50,
  logoPosY: 20,
};

// ===== Template Definitions =====
const templates = {
  diwali: {
    bgGradient: ['#1A1A2E', '#16213E'],
    name: 'Diwali',
    deco: 'diyas',
  },
  holi: {
    bgGradient: ['#FFB347', '#FF6B6B'],
    name: 'Holi',
    deco: 'powder',
  },
  eid: {
    bgGradient: ['#0F0C29', '#302B63', '#24243e'],
    name: 'Eid',
    deco: 'crescent',
  },
  christmas: {
    bgGradient: ['#141E3B', '#243B53'],
    name: 'Christmas',
    deco: 'snow',
  },
  newyear: {
    bgGradient: ['#0F0F23', '#590D22'],
    name: 'New Year',
    deco: 'fireworks',
  },
    winter: {
    bgGradient: ['#1E3C72', '#2A5298'],
    name: 'Winter',
    deco: 'snowflakes',
  },
};

// ===== Canvas Utilities =====
const canvas = document.getElementById('greetingCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

function getDPI() {
  // Export at 2x for crisp downloads
  return 2;
}

function fitCanvasToWrapper() {
  const wrapper = document.getElementById('canvasWrapper');
  const rect = wrapper.getBoundingClientRect();
  const ratio = 800 / 600;
  let w = rect.width;
  let h = w / ratio;
  if (h > rect.height) {
    h = rect.height;
    w = h * ratio;
  }
  canvas.style.width = Math.round(w) + 'px';
  canvas.style.height = Math.round(h) + 'px';
}

// ===== Background Rendering =====
function drawBackground(ctx, w, h, tpl) {
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  tpl.bgGradient.forEach((color, i) => {
    grd.addColorStop(i / (tpl.bgGradient.length - 1 || 1), color);
  });
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

// ===== Decorative Elements =====
function drawDecorations(ctx, w, h, tpl, state) {
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const s = Math.min(w, h) / 800;

  switch (tpl.deco) {
    case 'diyas':
      drawDiyas(ctx, w, h, s, state.primaryColor, state.secondaryColor);
      break;
    case 'powder':
      drawPowderExplosion(ctx, w, h, s, state.primaryColor);
      break;
    case 'crescent':
      drawCrescent(ctx, w, h, s, state.primaryColor, state.accentColor);
      break;
    case 'snow':
      drawChristmasDecos(ctx, w, h, s, state.primaryColor, state.secondaryColor);
      break;
    case 'fireworks':
      drawFireworks(ctx, w, h, s, state.primaryColor);
      break;
    case 'snowflakes':
      drawSnowScene(ctx, w, h, s, state.primaryColor);
      break;
  }
    ctx.restore();
}

// ===== Diwali: Diyas & Sparks =====
function drawDiyas(ctx, w, h, s, gold, amber) {
  ctx.save();
  ctx.fillStyle = gold;
  ctx.strokeStyle = amber;
  ctx.lineWidth = 2 * s;
  // Draw diyas along bottom
  for (let i = 0; i < 8; i++) {
    const x = -w / 3 + (w / 3.5) * i;
    const y = h / 2 - 80 * s;
    ctx.beginPath();
    ctx.ellipse(x, y, 18 * s, 10 * s, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Flame
    ctx.beginPath();
    ctx.moveTo(x, y - 10 * s);
    ctx.bezierCurveTo(x - 5 * s, y - 25 * s, x + 5 * s, y - 25 * s, x, y - 10 * s);
    ctx.fillStyle = amber;
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 1 * s;
    ctx.fill(); ctx.stroke();
  }
  // Sparks
  ctx.fillStyle = gold;
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * w * 0.8;
    const y = (Math.random() - 0.5) * h * 0.8;
    const r = Math.random() * 3 * s;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ===== Holi: Powder Explosion =====
function drawPowderExplosion(ctx, w, h, s, color) {
  ctx.save();
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 2;
    const radius = Math.random() * (w / 2) * 0.6 + 50 * s;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.7;
    const hue = (i * 10 + Date.now() * 0) % 360;
    ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
    const r = Math.random() * 12 * s + 5 * s;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ===== Eid: Crescent & Stars =====
function drawCrescent(ctx, w, h, s, deepBlue, accent) {
  ctx.save();
  ctx.translate(0, -h / 6);
  // Crescent
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(0, 0, 80 * s, Math.PI * 0.2, Math.PI * 0.8, false);
  ctx.arc(0, 0, 65 * s, Math.PI * 0.2, Math.PI * 0.8, true);
  ctx.fill('evenodd');
  // Stars
  ctx.fillStyle = accent;
  const starCount = 40;
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2;
    const radius = 220 * s + Math.sin(i) * 20 * s;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.6;
    const size = 4 * s + Math.random() * 3 * s;
        drawStar(ctx, x, y, 5, size, size * 0.5);
  }
  ctx.restore();
}

function drawStar(ctx, x, y, spikes, outerR, innerR) {
  ctx.beginPath();
  const step = Math.PI / spikes;
  ctx.moveTo(x, y - outerR);
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = i * step - Math.PI / 2;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
}

// ===== Christmas: Snow & Tree =====
function drawChristmasDecos(ctx, w, h, s, red, green) {
  ctx.save();
  // Snowflakes
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 100; i++) {
    const x = (Math.random() - 0.5) * w;
    const y = (Math.random() - 0.5) * h;
    const r = Math.random() * 3 * s;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  // Christmas tree
  ctx.translate(0, -h / 8);
  ctx.fillStyle = green;
  const treeW = 100 * s;
  const treeH = 140 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-treeW, treeH);
  ctx.lineTo(treeW, treeH);
  ctx.closePath();
  ctx.fill();
  // Tree trunk
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-15 * s, treeH, 30 * s, 30 * s);
  // Ornaments
  ctx.fillStyle = red;
  ctx.beginPath(); ctx.arc(-treeW / 2, treeH / 3, 8 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(treeW / 2, treeH / 2, 8 * s, 0, Math.PI * 2); ctx.fill();
  // Star
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(0, -10 * s, 10 * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ===== New Year: Fireworks =====
function drawFireworks(ctx, w, h, s, gold) {
  ctx.save();
  const fireworks = [
    { x: -w / 4, y: 0, color: gold },
    { x: w / 4, y: -50 * s, color: '#FF6B6B' },
    { x: 0, y: 80 * s, color: '#4ECDC4' },
  ];
  fireworks.forEach(fw => {
    ctx.strokeStyle = fw.color;
    ctx.lineWidth = 2 * s;
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const len = 60 * s + Math.random() * 20 * s;
      ctx.beginPath();
      ctx.moveTo(fw.x, fw.y);
      ctx.lineTo(fw.x + Math.cos(angle) * len, fw.y + Math.sin(angle) * len);
      ctx.stroke();
    }
    // Center burst
    ctx.fillStyle = fw.color;
    ctx.beginPath(); ctx.arc(fw.x, fw.y, 6 * s, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  });
      ctx.restore();
}

// ===== Winter: Snow & Deer Silhouette =====
function drawSnowScene(ctx, w, h, s, blue) {
  ctx.save();
  // Snowflakes
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 120; i++) {
    const x = (Math.random() - 0.5) * w;
    const y = (Math.random() - 0.5) * h;
    const r = Math.random() * 2.5 * s;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  // Deer silhouette
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.25, 60 * s, 80 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ===== Text Rendering =====
function drawText(ctx, w, h, state) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // English text (drawn with a Latin-friendly font)
  ctx.font = `700 ${state.fontSize * 0.8}px 'Roboto', sans-serif`;
  let englishY = h * 0.55;
  ctx.fillStyle = state.primaryColor;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  wrapText(ctx, state.englishText, w / 2, englishY, w * 0.8, state.fontSize * 0.8);

  // Hindi text (drawn with Hind font for Devanagari support)
  ctx.font = `700 ${state.fontSize * 0.6}px 'Hind', sans-serif`;
  let hindiY = englishY + state.fontSize * 1.3;
  ctx.fillStyle = state.secondaryColor;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  wrapText(ctx, state.hindiText, w / 2, hindiY, w * 0.85, state.fontSize * 0.6);

  ctx.restore();
}

// Text wrapping utility — breaks text into multiple lines
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const totalHeight = lines.length * lineHeight;
  let currentY = y - totalHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    // Draw stroke (outline) for readability
    ctx.strokeText(lines[i], x, currentY);
    ctx.fillText(lines[i], x, currentY);
    currentY += lineHeight;
  }
}

// ===== Logo Rendering =====
function drawLogo(ctx, w, h, state) {
  if (!state.logo) return;
  ctx.save();
  const scale = (state.logoScale / 100) * 0.25;
  const img = state.logo.element;
  const aspect = img.width / img.height;
  let logoW = w * scale;
  let logoH = logoW / aspect;
  if (logoH > h * 0.3) {
    logoH = h * 0.3;
    logoW = logoH * aspect;
  }
  const posX = (w * state.logoPosX / 100) - logoW / 2;
  const posY = (h * state.logoPosY / 100) - logoH / 2;
  // Draw drop shadow
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  ctx.drawImage(img, Math.round(posX), Math.round(posY), Math.round(logoW), Math.round(logoH));
  ctx.restore();
}

// ===== Main Render =====
function render() {
  const tpl = templates[state.template];
  const displayW = canvas.width;
  const displayH = canvas.height;

  // Clear
  ctx.clearRect(0, 0, displayW, displayH);

  // Draw background
  drawBackground(ctx, displayW, displayH, tpl);

  // Draw decorations
  drawDecorations(ctx, displayW, displayH, tpl, state);

  // Draw logo
  drawLogo(ctx, displayW, displayH, state);

  // Draw text
  drawText(ctx, displayW, displayH, state);
}

// ===== Async render with font loading =====
async function renderWithFonts() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
      render();
}

// ===== Toast Notifications =====
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== Tab Navigation =====
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#' + tabName + 'Tab').classList.add('active');
  document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
}

// ===== Color Palettes =====
const palettes = {
  diwali:    { primary: '#FFD700', secondary: '#D97706', accent: '#FFFFFF' },
  holi:      { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' },
  eid:       { primary: '#4A90D9', secondary: '#1A1A2E', accent: '#E8E8E8' },
  christmas: { primary: '#E53935', secondary: '#1565C0', accent: '#FFFFFF' },
  newyear:   { primary: '#FFD700', secondary: '#0F0F23', accent: '#C0C0C0' },
  winter:    { primary: '#93C5FD', secondary: '#1E3A8A', accent: '#FFFFFF' },
};

// ===== Template Selection =====
function switchTemplate(templateName) {
  const tpl = templates[templateName];
  if (!tpl) return;
  state.template = templateName;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-template="' + templateName + '"]').classList.add('active');
  // Apply template's default colors
  const palette = palettes[templateName];
  state.primaryColor = palette.primary;
  state.secondaryColor = palette.secondary;
  state.accentColor = palette.accent;
  updateColorInputs();
  renderWithFonts();
  showToast('Template: ' + tpl.name);
}

function selectPalette(paletteName) {
  const palette = palettes[paletteName];
  if (!palette) return;
  state.primaryColor = palette.primary;
  state.secondaryColor = palette.secondary;
  state.accentColor = palette.accent;
  updateColorInputs();
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  document.querySelector('.color-swatch[data-palette="' + paletteName + '"]').classList.add('active');
  renderWithFonts();
}

function updateColorInputs() {
  document.getElementById('primaryColor').value = state.primaryColor;
  document.getElementById('secondaryColor').value = state.secondaryColor;
  document.getElementById('accentColor').value = state.accentColor;
}

// ===== Logo Upload =====
function handleLogoUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please upload a valid image (PNG, JPG, GIF, SVG).');
    return;
  }
  const img = new Image();
  img.onload = function() {
    state.logo = { file: file, element: img, url: URL.createObjectURL(img) };
    state.logoScale = 100;
    state.logoPosX = 50;
    state.logoPosY = 20;
    document.getElementById('clearLogoBtn').style.display = 'block';
    renderWithFonts();
  };
  img.onerror = function() {
    showToast('Failed to load image. Please try another file.');
  };
  img.src = URL.createObjectURL(file);
}

function clearLogo() {
  if (state.logo && state.logo.url) URL.revokeObjectURL(state.logo.url);
  state.logo = null;
    document.getElementById('clearLogoBtn').style.display = 'none';
  renderWithFonts();
}

// ===== Export =====
function exportCanvas() {
  const link = document.createElement('a');
  link.download = 'festival-greeting-' + state.template + '-' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png', 0.95);
  link.click();
  showToast('✓ Downloaded as PNG!');
}

// ===== Reset =====
function resetAll() {
  state.template = 'diwali';
  state.englishText = 'Happy Diwali to you and your family!';
  state.hindiText = 'आपको और आपके परिवार को शुभ दिवाली!';
  state.fontSize = 48;
  state.fontFamily = 'Hind';
  state.primaryColor = '#FFD700';
  state.secondaryColor = '#D97706';
  state.accentColor = '#FFFFFF';
  clearLogo();

  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-template="diwali"]').classList.add('active');
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  document.querySelector('.color-swatch[data-palette="diwali"]').classList.add('active');

  document.getElementById('englishText').value = state.englishText;
  document.getElementById('hindiText').value = state.hindiText;
  document.getElementById('fontSize').value = state.fontSize;
  document.getElementById('fontSizeVal').textContent = state.fontSize;
  document.getElementById('fontFamily').value = state.fontFamily;
  document.getElementById('logoScale').value = state.logoScale;
  document.getElementById('logoScaleVal').textContent = state.logoScale;
  document.getElementById('logoPosX').value = state.logoPosX;
  document.getElementById('logoPosXVal').textContent = state.logoPosX;
  document.getElementById('logoPosY').value = state.logoPosY;
  document.getElementById('logoPosYVal').textContent = state.logoPosY;
  updateColorInputs();
  renderWithFonts();
  showToast('Reset to defaults.');
}

// ===== Initialization =====
function init() {
  fitCanvasToWrapper();
  window.addEventListener('resize', () => {
    fitCanvasToWrapper();
    renderWithFonts();
  });

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Template selection
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => switchTemplate(card.dataset.template));
  });

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => selectPalette(swatch.dataset.palette));
  });

  // Color inputs
  document.getElementById('primaryColor').addEventListener('input', e => {
    state.primaryColor = e.target.value;
    renderWithFonts();
  });
  document.getElementById('secondaryColor').addEventListener('input', e => {
    state.secondaryColor = e.target.value;
    renderWithFonts();
  });
  document.getElementById('accentColor').addEventListener('input', e => {
    state.accentColor = e.target.value;
    renderWithFonts();
  });

  // Font size
  const fs = document.getElementById('fontSize');
  const fsVal = document.getElementById('fontSizeVal');
  fs.addEventListener('input', e => {
    state.fontSize = parseInt(e.target.value);
    fsVal.textContent = state.fontSize;
    renderWithFonts();
  });

  // Font family
  document.getElementById('fontFamily').addEventListener('change', e => {
    state.fontFamily = e.target.value;
    renderWithFonts();
  });

  // Text inputs
  document.getElementById('englishText').addEventListener('input', e => {
    state.englishText = e.target.value || 'Happy Greetings!';
    renderWithFonts();
  });
  document.getElementById('hindiText').addEventListener('input', e => {
    state.hindiText = e.target.value || '';
    renderWithFonts();
  });

  // Logo upload (click)
  const logoInput = document.getElementById('logoInput');
  const uploadArea = document.getElementById('uploadArea');
  uploadArea.addEventListener('click', () => logoInput.click());

  // Logo upload (drag & drop)
  ['dragenter', 'dragover'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      uploadArea.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      uploadArea.classList.remove('dragover');
    });
  });
  uploadArea.addEventListener('drop', e => {
    if (e.dataTransfer.files.length > 0) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  });
  logoInput.addEventListener('change', e => {
    if (e.target.files.length > 0) {
      handleLogoUpload(e.target.files[0]);
    }
  });

  // Clear logo
  document.getElementById('clearLogoBtn').addEventListener('click', clearLogo);

  // Logo position/scale sliders
  const sliders = [
    { id: 'logoScale', valId: 'logoScaleVal', prop: 'logoScale' },
    { id: 'logoPosX', valId: 'logoPosXVal', prop: 'logoPosX' },
    { id: 'logoPosY', valId: 'logoPosYVal', prop: 'logoPosY' },
  ];
  sliders.forEach(({ id, valId, prop }) => {
    const slider = document.getElementById(id);
    const valLabel = document.getElementById(valId);
    slider.addEventListener('input', e => {
      state[prop] = parseInt(e.target.value);
      valLabel.textContent = state[prop];
      renderWithFonts();
    });
  });

  // Export & Reset buttons
  document.getElementById('exportBtn').addEventListener('click', exportCanvas);
  document.getElementById('resetBtn').addEventListener('click', resetAll);

  // Activate default template & palette
  document.querySelector('[data-template="diwali"]').classList.add('active');
  document.querySelector('.color-swatch[data-palette="diwali"]').classList.add('active');

  // Initial render
  renderWithFonts();
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);





