// =============================================
// LANDLORD DASHBOARD — app.js
// =============================================

let currentFilter = 'all';

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderRooms();
  generateQR();
});

// ---- STATS ----
function renderStats() {
  const s = getRoomStats();
  const el = document.getElementById('statsSection');
  el.innerHTML = `
    <div class="stat-card fade-in" style="animation-delay:.05s">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/></svg>
        </div>
        <span class="text-xs font-medium text-gray-500">Total</span>
      </div>
      <p class="text-2xl font-bold text-gray-900">${s.total}</p>
    </div>
    <div class="stat-card fade-in" style="animation-delay:.1s">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
        </div>
        <span class="text-xs font-medium text-gray-500">Vacant</span>
      </div>
      <p class="text-2xl font-bold text-green-600">${s.vacant}</p>
    </div>
    <div class="stat-card fade-in" style="animation-delay:.15s">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>
        </div>
        <span class="text-xs font-medium text-gray-500">Occupied</span>
      </div>
      <p class="text-2xl font-bold text-red-500">${s.occupied}</p>
    </div>
    <div class="stat-card fade-in" style="animation-delay:.2s">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg>
        </div>
        <span class="text-xs font-medium text-gray-500">Reserved</span>
      </div>
      <p class="text-2xl font-bold text-amber-600">${s.reserved}</p>
    </div>
  `;
}

// ---- FILTER ----
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === filter);
  });
  renderRooms();
}

// ---- ROOM CARDS ----
function renderRooms() {
  const rooms = loadRooms();
  const filtered = currentFilter === 'all' ? rooms : rooms.filter(r => r.status === currentFilter);
  const grid = document.getElementById('roomGrid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full">
        <svg class="mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
        <p class="text-lg font-semibold mb-1">No rooms found</p>
        <p class="text-sm">No ${currentFilter} rooms at the moment.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((room, i) => `
    <div class="room-card fade-in" style="animation-delay:${i * 0.06}s" onclick="openModal('${room.roomNumber}')">
      <img src="${room.image}" alt="Room ${room.roomNumber}" class="room-img" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'">
      <div class="p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-lg text-gray-900">Room ${room.roomNumber}</h3>
          <span class="badge badge-${room.status}">${room.status}</span>
        </div>
        <p class="text-sm text-gray-500 mb-1">${room.type}</p>
        <p class="text-lg font-bold text-teal-700 mb-2">${formatRent(room.rent)}<span class="text-xs font-normal text-gray-400">/mo</span></p>
        <p class="text-xs text-gray-400">Updated ${timeAgo(room.updatedAt)}</p>
      </div>
    </div>
  `).join('');
}

// ---- MODAL ----
function openModal(roomNumber) {
  const room = findRoom(roomNumber);
  if (!room) return;
  const modal = document.getElementById('roomModal');
  const body = document.getElementById('modalBody');

  body.innerHTML = `
    <img src="${room.image}" alt="Room ${room.roomNumber}" class="w-full h-48 sm:h-56 object-cover" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'">
    <div class="p-5 space-y-5">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Room ${room.roomNumber}</h2>
          <p class="text-sm text-gray-500">${room.type}</p>
        </div>
        <span class="badge badge-${room.status}">${room.status}</span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 leading-relaxed">${room.description}</p>

      <!-- Amenities -->
      <div class="flex flex-wrap gap-2">
        ${room.amenities.map(a => `<span class="amenity-tag">✓ ${a}</span>`).join('')}
      </div>

      <!-- Edit Form -->
      <div class="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Edit Room</p>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Rent (KES)</label>
            <input type="number" id="editRent" value="${room.rent}" class="form-input text-sm">
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 mb-1 block">Type</label>
            <select id="editType" class="form-input form-select text-sm">
              <option ${room.type==='Single Room'?'selected':''}>Single Room</option>
              <option ${room.type==='Bedsitter'?'selected':''}>Bedsitter</option>
              <option ${room.type==='1 Bedroom'?'selected':''}>1 Bedroom</option>
              <option ${room.type==='2 Bedroom'?'selected':''}>2 Bedroom</option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <textarea id="editDesc" rows="2" class="form-input text-sm">${room.description}</textarea>
        </div>
        <button onclick="saveEdits('${room.roomNumber}')" class="btn-action btn-primary w-full">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          Save Changes
        </button>
      </div>

      <!-- Status Buttons -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Status</p>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="changeStatus('${room.roomNumber}','vacant')" class="btn-action btn-vacant text-xs py-3">✓ Vacant</button>
          <button onclick="changeStatus('${room.roomNumber}','occupied')" class="btn-action btn-occupied text-xs py-3">✕ Occupied</button>
          <button onclick="changeStatus('${room.roomNumber}','reserved')" class="btn-action btn-reserved text-xs py-3">⏳ Reserved</button>
        </div>
      </div>

      <!-- Close -->
      <button onclick="closeModal()" class="btn-action w-full bg-gray-100 text-gray-600 hover:bg-gray-200 mt-2">Close</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('roomModal').classList.remove('active');
  document.body.style.overflow = '';
}

function saveEdits(roomNumber) {
  const rent = parseInt(document.getElementById('editRent').value) || 0;
  const type = document.getElementById('editType').value;
  const description = document.getElementById('editDesc').value.trim();
  if (rent < 1000) { showToast('⚠️ Rent must be at least KES 1,000'); return; }
  if (!description) { showToast('⚠️ Description cannot be empty'); return; }
  updateRoom(roomNumber, { rent, type, description });
  renderStats();
  renderRooms();
  closeModal();
  showToast('✅ Room ' + roomNumber + ' updated successfully');
}

function changeStatus(roomNumber, status) {
  updateRoom(roomNumber, { status });
  renderStats();
  renderRooms();
  closeModal();
  showToast(`✅ Room ${roomNumber} marked as ${status}`);
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ---- QR CODE ----
function generateQR() {
  const container = document.getElementById('qrCode');
  // Build tenant URL relative to current page
  const base = window.location.href.replace(/\/[^\/]*$/, '/');
  const tenantUrl = base + 'tenant.html';
  new QRCode(container, {
    text: tenantUrl,
    width: 180,
    height: 180,
    colorDark: '#0f766e',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

function downloadQR() {
  const canvas = document.querySelector('#qrCode canvas');
  if (!canvas) { showToast('⚠️ QR code not ready'); return; }
  const link = document.createElement('a');
  link.download = 'greenview-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('📥 QR code downloaded');
}

function copyTenantLink() {
  const base = window.location.href.replace(/\/[^\/]*$/, '/');
  const tenantUrl = base + 'tenant.html';
  navigator.clipboard.writeText(tenantUrl).then(() => {
    showToast('🔗 Link copied to clipboard');
  }).catch(() => {
    showToast('⚠️ Failed to copy link');
  });
}

// ---- Listen for storage changes (cross-tab sync) ----
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    renderStats();
    renderRooms();
  }
});
