// Ciclado Profundo Index Page JavaScript
// Loads Ciclado Profundo Pb-Ac battery data and renders cards
// Supports filtering by application via URL hash

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
        // Load Pb-Ac data
        const pbAcResponse = await fetch('../../data/ciclado-profundo-pb-ac.json');
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
        renderPbAcCards();
    }
}

// Render filtered cards based on application
function renderFilteredCards(filterHash) {
    // Normalize the hash to match application field
    const filterText = normalizeFilterText(filterHash);
    
    // Filter Pb-Ac products
    if (pbAcData && pbAcData.data) {
        const filteredPbAc = pbAcData.data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('pbAcCardsContainer', filteredPbAc);
    }
}

// Normalize filter text for matching
function normalizeFilterText(hash) {
    // Convert hash like "carrito-golf" to match patterns
    const patterns = {
        'carrito-golf': ['golf'],
        'vehiculo-utilitario': ['utilitario', 'rv'],
        'remolcador-equipaje': ['remolcador', 'equipaje'],
        'equipos-aeropuerto': ['aeropuerto'],
        'plataforma-elevacion': ['plataforma']
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

// Render Pb-Ac product cards
function renderPbAcCards() {
    if (!pbAcData || !pbAcData.data || pbAcData.data.length === 0) {
        return;
    }
    
    // Show only first 4 products as featured
    const featuredProducts = pbAcData.data.slice(0, 4);
    renderCards('pbAcCardsContainer', featuredProducts);
}

// Render cards to a container
function renderCards(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No se encontraron productos para esta aplicación.</p></div>';
        return;
    }
    
    products.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create a product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    const specs = `
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Voltaje:</span>
            <span class="fw-bold small">${product.voltaje}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Capacidad:</span>
            <span class="fw-bold small">${product.capacidad}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-muted small">Tipo:</span>
            <span class="fw-bold small">${product.tipo}</span>
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
                    <p class="text-muted small mb-3">${product.aplicacion || 'Aplicación Recreativa/Comercial'}</p>
                    
                    <!-- Key Specs -->
                    <div class="mb-3">
                        ${specs}
                    </div>
                    
                    <!-- Action Button -->
                    <a href="../product.html?category=ciclado&type=pb-ac&modelo=${encodeURIComponent(product.modelo)}" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}
