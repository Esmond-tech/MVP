// =============================================
// SHARED ROOM DATA — rooms.js
// Used by both landlord dashboard & tenant page
// =============================================

const STORAGE_KEY = 'greenview_rooms';
const LANDLORD_PHONE = '254712345678'; // Kenyan phone number

const defaultRooms = [
  {
    roomNumber: "A1",
    type: "Bedsitter",
    rent: 8500,
    status: "vacant",
    description: "Modern bedsitter with tiled floor, spacious balcony, and plenty of natural lighting throughout the day.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    amenities: ["WiFi", "Water Included", "Parking", "Security"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "A2",
    type: "Bedsitter",
    rent: 8500,
    status: "occupied",
    description: "Spacious bedsitter with ceramic tiles, fitted kitchen shelf, and cross-ventilation windows.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    amenities: ["Water Included", "Security"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "A3",
    type: "Single Room",
    rent: 5500,
    status: "vacant",
    description: "Cozy single room ideal for students or young professionals. Clean finishes and good ventilation.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    amenities: ["Water Included", "Security", "CCTV"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "B1",
    type: "1 Bedroom",
    rent: 15000,
    status: "occupied",
    description: "Elegant one-bedroom apartment with separate kitchen, living area, and a private balcony with views.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    amenities: ["WiFi", "Water Included", "Parking", "Security", "Balcony"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "B2",
    type: "1 Bedroom",
    rent: 15000,
    status: "reserved",
    description: "Bright one-bedroom with modern finishes, fitted wardrobes, and an open-plan kitchen area.",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80",
    amenities: ["WiFi", "Water Included", "Parking", "CCTV"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "B3",
    type: "Bedsitter",
    rent: 9000,
    status: "vacant",
    description: "Premium bedsitter on the top floor with panoramic views, new paint, and modern bathroom fittings.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    amenities: ["WiFi", "Water Included", "Parking", "Security", "Rooftop Access"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "C1",
    type: "2 Bedroom",
    rent: 22000,
    status: "occupied",
    description: "Spacious two-bedroom apartment perfect for families. Master en-suite, large living room, and fitted kitchen.",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
    amenities: ["WiFi", "Water Included", "Parking", "Security", "CCTV", "Balcony", "Generator Backup"],
    updatedAt: new Date().toISOString()
  },
  {
    roomNumber: "C2",
    type: "Single Room",
    rent: 6000,
    status: "vacant",
    description: "Freshly renovated single room with new tiles, painted walls, and shared clean washrooms.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ez637a26a?w=600&q=80",
    amenities: ["Water Included", "Security"],
    updatedAt: new Date().toISOString()
  }
];

// Load rooms from localStorage, or use defaults
function loadRooms() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Corrupted localStorage data. Resetting to defaults.');
    }
  }
  // Save defaults and return
  saveRooms(defaultRooms);
  return defaultRooms;
}

// Save rooms to localStorage
function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

// Update a single room by roomNumber
function updateRoom(roomNumber, updates) {
  const rooms = loadRooms();
  const index = rooms.findIndex(r => r.roomNumber === roomNumber);
  if (index === -1) return null;
  rooms[index] = { ...rooms[index], ...updates, updatedAt: new Date().toISOString() };
  saveRooms(rooms);
  return rooms[index];
}

// Find a room by number (case insensitive)
function findRoom(roomNumber) {
  const rooms = loadRooms();
  return rooms.find(r => r.roomNumber.toLowerCase() === roomNumber.trim().toLowerCase()) || null;
}

// Get statistics
function getRoomStats() {
  const rooms = loadRooms();
  return {
    total: rooms.length,
    vacant: rooms.filter(r => r.status === 'vacant').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    reserved: rooms.filter(r => r.status === 'reserved').length
  };
}

// Format rent in KES
function formatRent(amount) {
  return 'KES ' + Number(amount).toLocaleString('en-KE');
}

// Time ago helper
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}
