// Traccion Ion Li Page JavaScript
// Loads battery data and renders Mercado Libre-style cards

let currentData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
});

// Load battery data from JSON
async function loadBatteryData() {
    try {
        const response = await fetch('../data/traccion-ion-li.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        currentData = await response.json();
        renderProductCards();
    } catch (error) {
        console.error('Error loading battery data:', error);
        showNoResults();
    }
}

// Render product cards (Mercado Libre style)
function renderProductCards() {
    if (!currentData || !currentData.data || currentData.data.length === 0) {
        showNoResults();
        return;
    }
    
    const container = document.getElementById('productCardsContainer');
    container.innerHTML = '';
    
    // Show only first 3 products as featured
    const featuredProducts = currentData.data.slice(0, 3);
    
    featuredProducts.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create a Mercado Libre-style product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    // Create card HTML
    col.innerHTML = `
        <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-body p-0">
                <!-- Product Image Placeholder -->
                <div class="product-card-image">
                    <i class="bi bi-battery-charging"></i>
                </div>
                
                <!-- Product Info -->
                <div class="p-4">
                    <h5 class="card-title fw-bold mb-2">${product.modelo}</h5>
                    <p class="text-muted small mb-3">${product.aplicacion || 'Aplicación Industrial'}</p>
                    
                    <!-- Key Specs -->
                    <div class="mb-3">
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
                    </div>
                    
                    <!-- Action Button -->
                    <a href="producto-${product.modelo.toLowerCase()}.html" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Show no results message
function showNoResults() {
    const container = document.getElementById('productCardsContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>No hay productos disponibles en este momento.
                </div>
            </div>
        `;
    }
}
