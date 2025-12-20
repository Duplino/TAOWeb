// Traccion Index Page JavaScript
// Loads both Ion Li and Pb-Ac battery data and renders cards
// Supports filtering by application via URL hash

let ionLiData = null;
let pbAcData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
    
    // Listen for hash changes for filtering
    window.addEventListener('hashchange', handleHashChange);
});

// Load battery data from JSON files
async function loadBatteryData() {
    try {
        // Load Ion Li data
        const ionLiResponse = await fetch('../../data/traccion-ion-li.json');
        if (ionLiResponse.ok) {
            ionLiData = await ionLiResponse.json();
        }
        
        // Load Pb-Ac data
        const pbAcResponse = await fetch('../../data/traccion-pb-ac.json');
        if (pbAcResponse.ok) {
            pbAcData = await pbAcResponse.json();
        }
        
        // Initial render or filter based on hash
        handleHashChange();
    } catch (error) {
        console.error('Error loading battery data:', error);
    }
}

// Handle URL hash changes for filtering
function handleHashChange() {
    const hash = window.location.hash.substring(1); // Remove the '#'
    
    if (hash) {
        // Filter products by application matching the hash
        renderFilteredCards(hash);
    } else {
        // Show all products
        renderIonLiCards();
        renderPbAcCards();
    }
}

// Render filtered cards based on application
function renderFilteredCards(filterHash) {
    // Normalize the hash to match application field
    const filterText = normalizeFilterText(filterHash);
    
    // Filter Ion Li products
    if (ionLiData && ionLiData.data) {
        const filteredIonLi = ionLiData.data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('ionLiCardsContainer', filteredIonLi, 'ion-li');
    }
    
    // Filter Pb-Ac products
    if (pbAcData && pbAcData.data) {
        const filteredPbAc = pbAcData.data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('pbAcCardsContainer', filteredPbAc, 'pb-ac');
    }
}

// Normalize filter text for matching
function normalizeFilterText(hash) {
    // Convert hash like "montacargas-electricos" to match patterns
    const patterns = {
        'montacargas-electricos': ['montacargas', 'eléctricos'],
        'montacargas-3-ruedas': ['montacargas', '3 ruedas'],
        'montacargas-pesados': ['montacargas', 'pesados'],
        'montacargas-pasillo-estrecho': ['montacargas', 'pasillo estrecho'],
        'montacargas-contrapeso': ['montacargas', 'contrapeso'],
        'reach-truck': ['reach truck'],
        'transpaleta': ['transpaleta'],
        'tractor-remolque': ['tractor', 'remolque'],
        'apilador': ['apilador'],
        'locomotora-minera': ['locomotora'],
        'maquina-limpieza': ['limpieza'],
        'equipo-agricola': ['agrícola'],
        'miniexcavadora': ['excavadora'],
        'agv': ['agv', 'guiado', 'automáticamente', 'robots móviles']
    };
    
    return patterns[hash] || [hash.replace(/-/g, ' ')];
}

// Check if application matches filter
function matchesFilter(aplicacion, filterPatterns) {
    if (!aplicacion) return false;
    
    const lowerAplicacion = aplicacion.toLowerCase();
    return filterPatterns.some(pattern => 
        lowerAplicacion.includes(pattern.toLowerCase())
    );
}

// Render Ion Li product cards
function renderIonLiCards() {
    if (!ionLiData || !ionLiData.data || ionLiData.data.length === 0) {
        return;
    }
    
    // Show only first 3 products as featured
    const featuredProducts = ionLiData.data.slice(0, 3);
    renderCards('ionLiCardsContainer', featuredProducts, 'ion-li');
}

// Render Pb-Ac product cards
function renderPbAcCards() {
    if (!pbAcData || !pbAcData.data || pbAcData.data.length === 0) {
        return;
    }
    
    // Show only first 3 products as featured
    const featuredProducts = pbAcData.data.slice(0, 3);
    renderCards('pbAcCardsContainer', featuredProducts, 'pb-ac');
}

// Render cards to a container
function renderCards(containerId, products, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No se encontraron productos para esta aplicación.</p></div>';
        return;
    }
    
    products.forEach((product) => {
        const card = createProductCard(product, type);
        container.appendChild(card);
    });
}

// Create a product card
function createProductCard(product, type) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    // Get appropriate specs based on battery type
    const specs = type === 'ion-li' ? `
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Voltaje:</span>
            <span class="fw-bold small">${product.voltaje}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Capacidad:</span>
            <span class="fw-bold small">${product.capacidad}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Energía:</span>
            <span class="fw-bold small">${product.energia} kWh</span>
        </div>
    ` : `
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Voltaje:</span>
            <span class="fw-bold small">${product.voltaje}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Capacidad:</span>
            <span class="fw-bold small">${product.capacidad}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Peso:</span>
            <span class="fw-bold small">${product.peso} kg</span>
        </div>
    `;
    
    // Get product image or placeholder
    const productImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://via.placeholder.com/400x300/333/fff?text=' + encodeURIComponent(product.modelo);
    
    // Create card HTML
    col.innerHTML = `
        <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-body p-0">
                <!-- Product Image -->
                <div class="product-card-image" style="background-image: url('${productImage}'); background-size: cover; background-position: center; height: 200px; position: relative;">
                    ${!product.images || product.images.length === 0 ? '<i class="bi bi-battery-charging" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; color: rgba(255,255,255,0.5);"></i>' : ''}
                </div>
                
                <!-- Product Info -->
                <div class="p-4">
                    <h5 class="card-title fw-bold mb-2">${product.modelo}</h5>
                    <p class="text-muted small mb-3">${product.aplicacion || 'Aplicación Industrial'}</p>
                    
                    <!-- Key Specs -->
                    <div class="mb-3">
                        ${specs}
                    </div>
                    
                    <!-- Action Button -->
                    <a href="../product.html?category=traccion&type=${type}&modelo=${encodeURIComponent(product.modelo)}" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}
