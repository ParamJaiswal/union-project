/* Catalogue PDF Builder — Core Engine */
'use strict';

// ===== State =====
const state = {
  title: 'Product Catalogue',
  subtitle: 'Premium Collection 2024',
  products: [], // { id, name, price, sku, image, description }
};

let productIdCounter = 1;
let pendingImageDataUrl = null; // set when user uploads an image file

// ===== Toast =====
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
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

// ===== Product CRUD =====
function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const priceRaw = document.getElementById('productPrice').value.trim();
  const sku = document.getElementById('productSku').value.trim();
  const imageUrl = document.getElementById('productImage').value.trim();
  const desc = document.getElementById('productDesc').value.trim();

  if (!name) {
    showToast('Product name is required.');
    return;
  }

  const product = {
    id: productIdCounter++,
    name: name,
    price: priceRaw ? parseFloat(priceRaw) : null,
    sku: sku || '',
    image: pendingImageDataUrl || imageUrl || '',
    description: desc,
  };

  state.products.push(product);
  pendingImageDataUrl = null;

  // Clear form
  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productSku').value = '';
  document.getElementById('productImage').value = '';
  document.getElementById('productDesc').value = '';

  renderProductList();
  renderPreview();
  showToast('✓ Added: ' + name);
}

function removeProduct(id) {
  state.products = state.products.filter(p => p.id !== id);
  renderProductList();
  renderPreview();
  showToast('Product removed.');
}

// ===== Editor-side product list =====
function renderProductList() {
  const list = document.getElementById('productList');
  document.getElementById('productCount').textContent = state.products.length;

  if (state.products.length === 0) {
    list.innerHTML = '<p class="text-secondary" style="text-align:center; padding:1rem 0;">' +
      'No products added yet. Add a product to get started.</p>';
    return;
  }

  list.innerHTML = state.products.map(p => {
    const imgHtml = p.image
      ? '<img src="' + escapeAttr(p.image) + '" alt="" onerror="this.style.visibility=\'hidden\'">'
      : '<img alt="" style="visibility:hidden">';
    const meta = [];
    if (p.price !== null) meta.push('₹' + p.price);
    if (p.sku) meta.push(p.sku);
    return '<div class="product-item">' + imgHtml +
      '<div class="pi-info"><div class="pi-name">' + escapeHtml(p.name) + '</div>' +
      '<div class="pi-meta">' + escapeHtml(meta.join(' · ')) + '</div></div>' +
      '<button class="pi-remove" data-id="' + p.id + '" title="Remove">✕</button></div>';
  }).join('');

  list.querySelectorAll('.pi-remove').forEach(btn => {
    btn.addEventListener('click', () => removeProduct(parseInt(btn.dataset.id)));
  });
}

// ===== Preview rendering =====
function renderPreview() {
  document.getElementById('previewTitle').textContent = state.title;
  document.getElementById('previewSubtitle').textContent = state.subtitle;

  const grid = document.getElementById('previewProductGrid');
  if (state.products.length === 0) {
    grid.innerHTML = '<p class="text-secondary" style="text-align:center; padding:2rem 0;">' +
      'No products to display. Add products in the Editor tab.</p>';
    return;
  }

  grid.innerHTML = state.products.map(p => {

// ===== CSV Import/Export =====
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });
    if (!row.name) continue;
    products.push({
      id: productIdCounter++,
      name: row.name,
      price: row.price ? parseFloat(row.price) : null,
      sku: row.sku || '',
      image: row.image || '',
      description: row.description || '',
    });
  }
  return products;
}

// Handles quoted CSV fields containing commas
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function exportCSV() {
  if (state.products.length === 0) { showToast('No products to export.'); return; }
  const header = 'name,price,sku,image,description';
  const rows = state.products.map(p => {
    return [p.name, p.price !== null ? p.price : '', p.sku, p.image, p.description]
      .map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',');
  });
  downloadFile(header + '\n' + rows.join('\n'), 'catalogue.csv', 'text/csv');
  showToast('✓ Exported CSV (' + state.products.length + ' products)');
}

function exportJSON() {
  if (state.products.length === 0) { showToast('No products to export.'); return; }
  const data = { title: state.title, subtitle: state.subtitle, products: state.products };
  downloadFile(JSON.stringify(data, null, 2), 'catalogue.json', 'application/json');
  showToast('✓ Exported JSON (' + state.products.length + ' products)');
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// ===== Image file upload → data URL =====
function handleImageFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please choose a valid image file.');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('Image too large (max 2 MB for embedded data URLs).');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    pendingImageDataUrl = e.target.result;
    document.getElementById('productImage').value = '';
    showToast('✓ Image ready — will attach to next product added.');
  };
  reader.readAsDataURL(file);
}

// ===== PDF Export =====
function downloadPDF() {
  if (state.products.length === 0) {
    showToast('Add at least one product before exporting.');
    return;
  }
  if (typeof html2pdf === 'undefined') {
    showToast('PDF library still loading — try again in a moment.');
    return;
  }
  showToast('Generating PDF…');
  const element = document.getElementById('catalogueContent');
  const filename = (state.title || 'catalogue').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.pdf';
  html2pdf().set({
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(element).save().then(() => {
    showToast('✓ PDF downloaded: ' + filename);
  }).catch(() => {
    showToast('PDF export failed. Try fewer/external images.');
  });
}

// ===== Reset =====
function resetCatalogue() {
  state.title = 'Product Catalogue';
  state.subtitle = 'Premium Collection 2024';

// ===== Initialization =====
function init() {
  // Tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Title / subtitle live sync
  document.getElementById('catalogueTitle').addEventListener('input', e => {
    state.title = e.target.value || 'Product Catalogue';
    renderPreview();
  });
  document.getElementById('catalogueSubtitle').addEventListener('input', e => {
    state.subtitle = e.target.value;
    renderPreview();
  });

  // Add product
  document.getElementById('addProductBtn').addEventListener('click', addProduct);
  document.getElementById('productName').addEventListener('keydown', e => {
    if (e.key === 'Enter') addProduct();
  });

  // Image upload (click + drag/drop)
  const imageInput = document.getElementById('imageFileInput');
  const imageArea = document.getElementById('imageUploadArea');
  imageArea.addEventListener('click', () => imageInput.click());
  ['dragenter', 'dragover'].forEach(evt => {
    imageArea.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      imageArea.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    imageArea.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      imageArea.classList.remove('dragover');
    });
  });
  imageArea.addEventListener('drop', e => {
    if (e.dataTransfer.files.length > 0) handleImageFile(e.dataTransfer.files[0]);
  });
  imageInput.addEventListener('change', e => {
    if (e.target.files.length > 0) handleImageFile(e.target.files[0]);
  });

  // CSV import
  document.getElementById('importCsvBtn').addEventListener('click', () => {
    document.getElementById('csvInput').click();
  });
  document.getElementById('csvInput').addEventListener('change', e => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const imported = parseCSV(ev.target.result);
      if (imported.length === 0) { showToast('No valid rows found in CSV.'); return; }
      state.products = state.products.concat(imported);
      renderProductList();
      renderPreview();
      showToast('✓ Imported ' + imported.length + ' products from CSV');
    };
    reader.readAsText(e.target.files[0]);
    e.target.value = '';
  });

  // JSON import
  document.getElementById('importJsonBtn').addEventListener('click', () => {
    document.getElementById('jsonInput').click();
  });
  document.getElementById('jsonInput').addEventListener('change', e => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        const items = Array.isArray(data) ? data : (data.products || []);
        if (data.title) {
          state.title = data.title;
          document.getElementById('catalogueTitle').value = data.title;
        }
        if (data.subtitle) {
          state.subtitle = data.subtitle;
          document.getElementById('catalogueSubtitle').value = data.subtitle;
        }
        items.forEach(item => {
          if (!item.name) return;
          state.products.push({
            id: productIdCounter++,
            name: String(item.name),
            price: item.price !== undefined && item.price !== '' && item.price !== null
              ? parseFloat(item.price) : null,
            sku: item.sku || '',
            image: item.image || '',
            description: item.description || '',
          });
        });
        renderProductList();
        renderPreview();
        showToast('✓ Imported ' + items.length + ' products from JSON');
      } catch (err) {
        showToast('Invalid JSON file.');
      }
    };
    reader.readAsText(e.target.files[0]);
    e.target.value = '';
  });

  // Export buttons
  document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
  document.getElementById('exportJsonBtn').addEventListener('click', exportJSON);
  document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
  document.getElementById('resetCatalogueBtn').addEventListener('click', resetCatalogue);

  // Initial render
  renderProductList();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);

  state.products = [];
  pendingImageDataUrl = null;
  document.getElementById('catalogueTitle').value = state.title;
  document.getElementById('catalogueSubtitle').value = state.subtitle;
  renderProductList();
  renderPreview();
  showToast('Catalogue reset.');
}

    const imgHtml = p.image
      ? '<img src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(p.name) + '" loading="lazy" onerror="this.parentElement.style.minHeight=\'0\'">'
      : '<div style="height:160px; background:#f3f4f6; display:flex; align-items:center; justify-content:center; color:#9ca3af;">No image</div>';
    const priceHtml = p.price !== null
      ? '<div class="pc-price">₹' + p.price.toLocaleString('en-IN') + '</div>' : '';
    const skuHtml = p.sku ? '<div class="pc-sku">SKU: ' + escapeHtml(p.sku) + '</div>' : '';
    const descHtml = p.description ? '<div class="pc-desc">' + escapeHtml(p.description) + '</div>' : '';
    return '<div class="product-card">' + imgHtml +
      '<div class="pc-body"><div class="pc-name">' + escapeHtml(p.name) + '</div>' +
      priceHtml + skuHtml + descHtml + '</div></div>';
  }).join('');
}

// ===== Helpers =====
function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeAttr(str) { return escapeHtml(str); }
