// Ciclado Profundo Index Page JavaScript
// Loads Ciclado Profundo Pb-Ac battery data and renders cards

let pbAcData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
});

// Load battery data from JSON files
async function loadBatteryData() {
    try {
        // Load Pb-Ac data
        const pbAcResponse = await fetch('../../data/ciclado-profundo-pb-ac.json');
        if (pbAcResponse.ok) {
            pbAcData = await pbAcResponse.json();
            renderPbAcCards();
        }
    } catch (error) {
        console.error('Error loading battery data:', error);
    }
}

// Render Pb-Ac product cards
function renderPbAcCards() {
    if (!pbAcData || !pbAcData.data || pbAcData.data.length === 0) {
        return;
    }
    
    const container = document.getElementById('pbAcCardsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show only first 3 products as featured
    const featuredProducts = pbAcData.data.slice(0, 3);
    
    featuredProducts.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create a product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    // Create URL-safe slug from model name
    const urlSlug = product.modelo.toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    
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
            <span class="text-muted small">Peso:</span>
            <span class="fw-bold small">${product.peso} kg</span>
        </div>
    `;
    
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
                    <p class="text-muted small mb-3">${product.aplicacion || 'Aplicación Recreativa/Comercial'}</p>
                    
                    <!-- Key Specs -->
                    <div class="mb-3">
                        ${specs}
                    </div>
                    
                    <!-- Action Button -->
                    <a href="${urlSlug}.html" class="btn btn-orange w-100">
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}
