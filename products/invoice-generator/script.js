/* Invoice & Quotation Generator — Core Engine */
'use strict';

const state = {
  docType: 'invoice',
  docNumber: 'INV-001',
  docDate: '',
  docDue: '',
  bizName: '',
  bizDetails: '',
  logoDataUrl: null,
  clientName: '',
  clientDetails: '',
  items: [], // { id, desc, qty, rate }
  gstRate: 18,
  discount: 0,
  notes: '',
};
let itemId = 1;

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmt(n) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ===== Items =====
function addItem() {
  const desc = document.getElementById('itemDesc').value.trim();
  const qty = parseFloat(document.getElementById('itemQty').value) || 1;
  const rate = parseFloat(document.getElementById('itemRate').value);
  if (!desc) { showToast('Item description is required.'); return; }
  if (isNaN(rate) || rate < 0) { showToast('Enter a valid rate.'); return; }
  state.items.push({ id: itemId++, desc, qty, rate });
  document.getElementById('itemDesc').value = '';
  document.getElementById('itemRate').value = '';
  document.getElementById('itemQty').value = '1';
  document.getElementById('itemDesc').focus();
  renderItemList();
  renderDocument();
}

function removeItem(id) {
  state.items = state.items.filter(it => it.id !== id);
  renderItemList();
  renderDocument();
}

function renderItemList() {
  const list = document.getElementById('itemList');
  if (state.items.length === 0) {
    list.innerHTML = '<p class="text-secondary" style="text-align:center; padding:0.75rem 0;">No items yet.</p>';
    return;
  }
  list.innerHTML = state.items.map(it => {
    return '<div class="item-row">' +
      '<span class="ir-desc" title="' + escapeHtml(it.desc) + '">' + escapeHtml(it.desc) + '</span>' +
      '<span class="ir-qty">×' + it.qty + '</span>' +
      '<span class="ir-amt">' + fmt(it.qty * it.rate) + '</span>' +
      '<button class="ir-del" data-id="' + it.id + '" title="Remove">✕</button></div>';
  }).join('');
  list.querySelectorAll('.ir-del').forEach(btn => {
    btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
  });
}

// ===== Totals =====
function calcTotals() {
  const subtotal = state.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const discount = Math.min(state.discount, subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const gst = taxable * (state.gstRate / 100);
  return { subtotal, discount, taxable, gst, grand: taxable + gst };
}

// ===== Document rendering =====
function docTitle() {
  return { invoice: 'Invoice', quotation: 'Quotation', estimate: 'Estimate' }[state.docType] || 'Invoice';
}

function dateOrEmpty(d) { return d || '—'; }

function renderDocument() {
  const t = calcTotals();
  const logo = state.logoDataUrl
    ? '<img class="inv-logo" src="' + state.logoDataUrl + '" alt="logo">' : '';

  const rowsHtml = state.items.length === 0
    ? '<tr><td colspan="4" class="inv-empty">No line items added</td></tr>'
    : state.items.map(it => {
        return '<tr><td>' + escapeHtml(it.desc) + '</td><td>' + it.qty + '</td>' +
          '<td>' + fmt(it.rate) + '</td><td>' + fmt(it.qty * it.rate) + '</td></tr>';
      }).join('');

  const gstRow = state.gstRate > 0
    ? '<tr><td>GST (' + state.gstRate + '%)</td><td>' + fmt(t.gst) + '</td></tr>' : '';
  const discRow = t.discount > 0
    ? '<tr><td>Discount</td><td>−' + fmt(t.discount) + '</td></tr>' : '';

  document.getElementById('invoiceDoc').innerHTML =
    '<div class="inv-header"><div>' + logo +
      '<div class="inv-title">' + docTitle() + '</div></div>' +
      '<div class="inv-meta"><strong>' + escapeHtml(docTitle().toUpperCase() + ' ' + state.docNumber) + '</strong><br>' +
      'Date: ' + dateOrEmpty(state.docDate) + '<br>' +
      (state.docDue ? 'Due / Valid Until: ' + state.docDue : '') + '</div></div>' +
    '<div class="inv-parties">' +

// ===== Logo upload =====
function handleLogoFile(file) {
  if (!file || !file.type.startsWith('image/')) { showToast('Please choose a valid image file.'); return; }
  if (file.size > 1024 * 1024) { showToast('Logo too large (max 1 MB).'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    state.logoDataUrl = e.target.result;
    renderDocument();
    showToast('✓ Logo added');
  };
  reader.readAsDataURL(file);
}

// ===== PDF Export =====
function downloadPDF() {
  if (state.items.length === 0) { showToast('Add at least one line item first.'); return; }
  if (!state.bizName.trim() || !state.clientName.trim()) {
    showToast('Fill in your business name and client name first.'); return;
  }
  if (typeof html2pdf === 'undefined') { showToast('PDF library still loading — try again in a moment.'); return; }
  showToast('Generating PDF…');
  const element = document.getElementById('invoiceDoc');
  const filename = (docTitle() + '-' + (state.docNumber || 'doc') + '.pdf').toLowerCase().replace(/[^a-z0-9\-\.]+/g, '-');
  html2pdf().set({
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(element).save().then(() => {
    showToast('✓ PDF downloaded: ' + filename);
  }).catch(() => {
    showToast('PDF export failed. Try removing the logo or retry.');

// ===== Reset =====
function resetAll() {
  state.docType = 'invoice'; state.docNumber = 'INV-001';
  state.docDate = todayStr(); state.docDue = '';
  state.bizName = ''; state.bizDetails = ''; state.logoDataUrl = null;
  state.clientName = ''; state.clientDetails = '';
  state.items = []; state.gstRate = 18; state.discount = 0; state.notes = '';
  bindInputs();
  renderItemList();
  renderDocument();
  showToast('Reset to blank document.');
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ===== Input binding =====
const bindings = [
  ['docType', v => state.docType = v],
  ['docNumber', v => state.docNumber = v || 'INV-001'],
  ['docDate', v => state.docDate = v],
  ['docDue', v => state.docDue = v],
  ['bizName', v => state.bizName = v],
  ['bizDetails', v => state.bizDetails = v],
  ['clientName', v => state.clientName = v],
  ['clientDetails', v => state.clientDetails = v],
  ['gstRate', v => state.gstRate = parseInt(v)],
  ['discount', v => state.discount = parseFloat(v) || 0],
  ['notes', v => state.notes = v],
];

function bindInputs() {
  bindings.forEach(([id]) => {
    const el = document.getElementById(id);
    if (el.type === 'number') el.value = state[id] ?? 0;
    else el.value = state[id] ?? '';
  });
}

// ===== Initialization =====
function init() {
  state.docDate = todayStr();
  bindInputs();

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(btn.dataset.tab + 'Tab').classList.add('active');
      btn.classList.add('active');
    });
  });

  // Live bindings
  bindings.forEach(([id, setter]) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => { setter(el.value); renderDocument(); });
    el.addEventListener('change', () => { setter(el.value); renderDocument(); });
  });

  // Items
  document.getElementById('addItemBtn').addEventListener('click', addItem);
  ['itemDesc', 'itemQty', 'itemRate'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') addItem();
    });
  });

  // Logo upload
  const logoInput = document.getElementById('logoFileInput');
  const logoArea = document.getElementById('logoUploadArea');
  logoArea.addEventListener('click', () => logoInput.click());
  ['dragenter', 'dragover'].forEach(evt => {
    logoArea.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); logoArea.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(evt => {
    logoArea.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); logoArea.classList.remove('dragover'); });
  });
  logoArea.addEventListener('drop', e => {
    if (e.dataTransfer.files.length > 0) handleLogoFile(e.dataTransfer.files[0]);
  });
  logoInput.addEventListener('change', e => {
    if (e.target.files.length > 0) handleLogoFile(e.target.files[0]);
  });

  // Buttons
  document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
  document.getElementById('resetBtn').addEventListener('click', resetAll);

  renderItemList();
  renderDocument();
}

document.addEventListener('DOMContentLoaded', init);

  });
}

      '<div class="inv-party"><h4>From</h4><div class="name">' +
        (escapeHtml(state.bizName) || '<span style="color:#9ca3af">Your Business Name</span>') + '</div>' +
        '<div class="lines">' + escapeHtml(state.bizDetails) + '</div></div>' +
      '<div class="inv-party"><h4>Bill To</h4><div class="name">' +
        (escapeHtml(state.clientName) || '<span style="color:#9ca3af">Client Name</span>') + '</div>' +
        '<div class="lines">' + escapeHtml(state.clientDetails) + '</div></div></div>' +
    '<table class="inv-table"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>' +
      '<tbody>' + rowsHtml + '</tbody></table>' +
    '<div class="inv-totals"><table>' +
      '<tr><td>Subtotal</td><td>' + fmt(t.subtotal) + '</td></tr>' + discRow + gstRow +
      '<tr class="grand"><td>Total</td><td>' + fmt(t.grand) + '</td></tr></table></div>' +
    (state.notes ? '<div class="inv-notes">' + escapeHtml(state.notes) + '</div>' : '') +
    '<div class="inv-footer">Generated with Union Project Invoice Generator · paramjaiswal.github.io/union-project</div>';
}
