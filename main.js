const API_KEY = import.meta.env.VITE_NPS_API_KEY;
const API_BASE = 'https://developer.nps.gov/api/v1';

let map, markersLayer, allParks = [], filteredParks = [], stateColors = {};

const colorPalette = [
  '#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8',
  '#F7DC6F','#BB8FCE','#85C1E2','#8B739','#52B788',
  '#AE445A','#F39237','#39A9DB','#A8E6CF','#FFD93D'
];

async function init() {
  if (!API_KEY) {
    const loading = document.getElementById('loading');
    loading.textContent = '⚠️ API key not configured. Please add VITE_NPS_API_KEY to your .env file';
    loading.style.color = '#dc3545';
    return;
  }
  
  initMap();
  setupEventListeners();
  await loadParks();
}

function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4);

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { 
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }
  ).addTo(map);

  markersLayer = L.markerClusterGroup({
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  });
  
  map.addLayer(markersLayer);
}

function setupEventListeners() {
  const themeToggle = document.getElementById('themeToggle');
  const countryFilter = document.getElementById('countryFilter');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');

  themeToggle.addEventListener('click', toggleTheme);
  countryFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  refreshBtn.addEventListener('click', async () => {
    searchInput.value = '';
    countryFilter.value = 'all';
    filteredParks = [];
    allParks = [];
    markersLayer.clearLayers();
    document.getElementById('parksList').innerHTML = '';
    document.getElementById('loading').classList.remove('hidden');
    await loadParks();
    map.setView([39.8283, -98.5795], 4);
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('themeToggle');
  
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

async function loadParks() {
  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');
  loading.textContent = 'Loading parks data...';

  try {
    const response = await fetch(
      `${API_BASE}/parks?limit=500&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    allParks = data.data;

    console.log(`✅ Loaded ${allParks.length} parks`);
    
    processParks();
    loading.classList.add('hidden');
    
  } catch (err) {
    console.error('❌ Error loading parks:', err);
    loading.textContent = '⚠️ Error loading parks. Please refresh the page.';
    loading.style.color = '#dc3545';
  }
}

function processParks() {
  const states = new Set();

  allParks.forEach(park => {
    if (park.states) {
      park.states.split(',').forEach(state => states.add(state.trim()));
    }
  });

  const statesArray = Array.from(states).sort();
  statesArray.forEach((state, index) => {
    stateColors[state] = colorPalette[index % colorPalette.length];
  });

  populateStateFilter(statesArray);
  createLegend(statesArray);

  filteredParks = [...allParks];
  updateMap();
  updateParksList();
  updateStats();
}

function populateStateFilter(states) {
  const select = document.getElementById('countryFilter');
  select.innerHTML = '<option value="all">All States</option>';
  
  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    select.appendChild(option);
  });
}

function createLegend(states) {
  const legendContent = document.getElementById('legendContent');
  legendContent.innerHTML = '';

  states.slice(0, 10).forEach(state => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="legend-color" style="background-color: ${stateColors[state]}"></div>
      <span class="legend-label">${state}</span>
    `;
    legendContent.appendChild(item);
  });

  if (states.length > 10) {
    const more = document.createElement('div');
    more.className = 'legend-item';
    more.innerHTML = `<span class="legend-label" style="font-style: italic;">+ ${states.length - 10} more states</span>`;
    legendContent.appendChild(more);
  }
}

function applyFilters() {
  const stateFilter = document.getElementById('countryFilter').value;
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();

  filteredParks = allParks.filter(park => {
    const matchesState = stateFilter === 'all' || 
      (park.states && park.states.includes(stateFilter));
    
    const matchesSearch = !searchQuery || 
      park.fullName.toLowerCase().includes(searchQuery) || 
      (park.description && park.description.toLowerCase().includes(searchQuery));
    
    return matchesState && matchesSearch;
  });

  updateMap();
  updateParksList();
  updateStats();
}

function updateMap() {
  markersLayer.clearLayers();

  filteredParks.forEach(park => {
    if (park.latitude && park.longitude) {
      const lat = parseFloat(park.latitude);
      const lng = parseFloat(park.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const primaryState = park.states ? park.states.split(',')[0].trim() : 'Unknown';
        const color = stateColors[primaryState] || '#999999';

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([lat, lng], { icon });
        
        marker.bindPopup(`
          <div style="min-width: 220px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2c3e50;">${park.fullName}</h3>
            <p style="margin: 4px 0; font-size: 13px;"><strong>State(s):</strong> ${park.states}</p>
            ${park.description ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #555; line-height: 1.4;">${park.description.substring(0, 180)}...</p>` : ''}
            ${park.url ? `<a href="${park.url}" target="_blank" style="display: inline-block; margin-top: 8px; color: #28a745; font-size: 13px; text-decoration: none; font-weight: bold;">Visit Official Site →</a>` : ''}
          </div>
        `);
        
        markersLayer.addLayer(marker);
      }
    }
  });
}

function updateParksList() {
  const parksList = document.getElementById('parksList');
  parksList.innerHTML = '';

  if (filteredParks.length === 0) {
    parksList.innerHTML = '<div class="loading">No parks found matching your criteria.</div>';
    return;
  }

  filteredParks.forEach((park, index) => {
    const card = document.createElement('div');
    card.className = 'park-card';
    card.style.animationDelay = `${index * 0.03}s`;

    const primaryState = park.states ? park.states.split(',')[0].trim() : 'Unknown';
    const color = stateColors[primaryState] || '#999999';

    card.innerHTML = `
      <div class="park-name">${park.fullName}</div>
      <div class="park-info">
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${color}; border: 2px solid white;"></span>
        <span>${park.states || 'Unknown'}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      if (park.latitude && park.longitude) {
        const lat = parseFloat(park.latitude);
        const lng = parseFloat(park.longitude);
        map.setView([lat, lng], 10);

        markersLayer.eachLayer(layer => {
          if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
            layer.openPopup();
          }
        });
      }
    });

    parksList.appendChild(card);
  });
}

function updateStats() {
  document.getElementById('totalParks').textContent = allParks.length;
  document.getElementById('showingParks').textContent = filteredParks.length;
}

init();