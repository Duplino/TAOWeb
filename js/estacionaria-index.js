// Estacionaria Index Page JavaScript
// Loads both Pb-Ac and Ion Li estacionaria battery data and renders cards
// Supports filtering by application via URL hash

let categoryData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
    
    // Listen for hash changes for filtering
    window.addEventListener('hashchange', handleHashChange);
});

// Load battery data from JSON files
async function loadBatteryData() {
    try {
        // Load consolidated estacionaria data
        const response = await fetch('../../data/estacionaria.json');
        if (response.ok) {
            categoryData = await response.json();
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
        // Update page title
        updateFilteredTitle(hash);
    } else {
        // Show all products
        renderAllCards();
        // Reset titles
        resetTitles();
    }
}

// Update page title when filtering
function updateFilteredTitle(filterHash) {
    const applicationNames = {
        'sistemas-ups': 'Sistemas UPS',
        'telecomunicaciones': 'Telecomunicaciones',
        'energia-solar': 'Sistemas de Energía Solar',
        'centros-datos': 'Centros de Datos'
    };
    
    const appName = applicationNames[filterHash] || filterHash.replace(/-/g, ' ');
    
    // Update subtitle
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = `Modelos destacados para ${appName}`;
    }
    
    // Update section titles
    const ionLiTitle = document.getElementById('ionLiTitle');
    if (ionLiTitle) {
        ionLiTitle.textContent = `Modelos para ${appName} - Estacionarias Pb-Ac`;
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = `Modelos para ${appName} - Estacionarias Ion Li`;
    }
}

// Reset titles to default
function resetTitles() {
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = 'Soluciones de respaldo energético para sistemas críticos';
    }
    
    const ionLiTitle = document.getElementById('ionLiTitle');
    if (ionLiTitle) {
        ionLiTitle.textContent = 'Modelos Destacados - Estacionarias Pb-Ac';
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = 'Modelos Destacados - Estacionarias Ion Li';
    }
}

// Render filtered cards based on application
function renderFilteredCards(filterHash) {
    if (!categoryData || !categoryData.types) return;
    
    // Normalize the hash to match application field
    const filterText = normalizeFilterText(filterHash);
    
    // Filter Pb-Ac products
    if (categoryData.types['pb-ac'] && categoryData.types['pb-ac'].data) {
        const filteredPbAc = categoryData.types['pb-ac'].data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('ionLiCardsContainer', filteredPbAc, 'pb-ac');
    }
    
    // Filter Ion Li products
    if (categoryData.types['ion-li'] && categoryData.types['ion-li'].data) {
        const filteredIonLi = categoryData.types['ion-li'].data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('pbAcCardsContainer', filteredIonLi, 'ion-li');
    }
}

// Render all cards without filter
function renderAllCards() {
    if (!categoryData || !categoryData.types) return;
    
    // Show first 3 Pb-Ac products
    if (categoryData.types['pb-ac'] && categoryData.types['pb-ac'].data) {
        const featured = categoryData.types['pb-ac'].data.slice(0, 3);
        renderCards('ionLiCardsContainer', featured, 'pb-ac');
    }
    
    // Show first 3 Ion Li products
    if (categoryData.types['ion-li'] && categoryData.types['ion-li'].data) {
        const featured = categoryData.types['ion-li'].data.slice(0, 3);
        renderCards('pbAcCardsContainer', featured, 'ion-li');
    }
}

// Normalize filter text for matching
function normalizeFilterText(hash) {
    // Convert hash like "sistemas-ups" to match patterns
    const patterns = {
        'sistemas-ups': ['ups'],
        'telecomunicaciones': ['telecomunicaciones', 'telecom'],
        'energia-solar': ['solar'],
        'centros-datos': ['data center', 'centro']
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
    const specs = type === 'ion-li' && product.energia ? `
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
            <span class="text-muted small">Vida:</span>
            <span class="fw-bold small">${product.vidaFlotante || 'N/A'} años</span>
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
                    <p class="text-muted small mb-3">${product.aplicacion || 'Aplicación Estacionaria'}</p>
                    
                    <!-- Key Specs -->
                    <div class="mb-3">
                        ${specs}
                    </div>
                    
                    <!-- Action Button -->
                    <a href="product.html?category=estacionaria&type=${type}&modelo=${encodeURIComponent(product.modelo)}" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}
