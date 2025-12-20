// Traccion Index Page JavaScript
// Loads both Ion Li and Pb-Ac battery data and renders cards
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
        // Load consolidated traccion data
        const response = await fetch('../../data/traccion.json');
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
        'montacargas-electricos': 'Montacargas Eléctricos',
        'montacargas-3-ruedas': 'Montacargas de 3 Ruedas',
        'montacargas-pesados': 'Montacargas de Servicio Pesado',
        'montacargas-pasillo-estrecho': 'Montacargas de Pasillo Estrecho',
        'montacargas-contrapeso': 'Montacargas de Contrapeso',
        'reach-truck': 'Reach Truck',
        'transpaleta': 'Transpaleta Eléctrica',
        'tractor-remolque': 'Tractor de Remolque Eléctrico',
        'apilador': 'Apilador Eléctrico',
        'locomotora-minera': 'Locomotora Minera',
        'maquina-limpieza': 'Máquina de Limpieza de Pisos',
        'equipo-agricola': 'Equipo Agrícola',
        'miniexcavadora': 'Miniexcavadora',
        'agv': 'Vehículo Guiado Automáticamente'
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
        ionLiTitle.textContent = `Modelos para ${appName} - Tracción Ion Li`;
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = `Modelos para ${appName} - Tracción Pb-Ac`;
    }
}

// Reset titles to default
function resetTitles() {
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = 'Soluciones de energía para equipos de manejo de materiales y vehículos industriales';
    }
    
    const ionLiTitle = document.getElementById('ionLiTitle');
    if (ionLiTitle) {
        ionLiTitle.textContent = 'Modelos Destacados - Tracción Ion Li';
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = 'Modelos Destacados - Tracción Pb-Ac';
    }
}

// Render filtered cards based on application
function renderFilteredCards(filterHash) {
    if (!categoryData || !categoryData.types) return;
    
    // Normalize the hash to match application field
    const filterText = normalizeFilterText(filterHash);
    
    // Filter Ion Li products
    if (categoryData.types['ion-li'] && categoryData.types['ion-li'].data) {
        const filteredIonLi = categoryData.types['ion-li'].data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('ionLiCardsContainer', filteredIonLi, 'ion-li');
    }
    
    // Filter Pb-Ac products
    if (categoryData.types['pb-ac'] && categoryData.types['pb-ac'].data) {
        const filteredPbAc = categoryData.types['pb-ac'].data.filter(product => 
            matchesFilter(product.aplicacion, filterText)
        );
        renderCards('pbAcCardsContainer', filteredPbAc, 'pb-ac');
    }
}

// Render all cards without filter
function renderAllCards() {
    if (!categoryData || !categoryData.types) return;
    
    // Show first 3 Ion Li products
    if (categoryData.types['ion-li'] && categoryData.types['ion-li'].data) {
        const featuredIonLi = categoryData.types['ion-li'].data.slice(0, 3);
        renderCards('ionLiCardsContainer', featuredIonLi, 'ion-li');
    }
    
    // Show first 3 Pb-Ac products
    if (categoryData.types['pb-ac'] && categoryData.types['pb-ac'].data) {
        const featuredPbAc = categoryData.types['pb-ac'].data.slice(0, 3);
        renderCards('pbAcCardsContainer', featuredPbAc, 'pb-ac');
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
                    <a href="product.html?category=traccion&type=${type}&modelo=${encodeURIComponent(product.modelo)}" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}
