// Product page JavaScript - traccion
// Loads battery data from JSON based on URL parameters

let productData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductFromURL();
});

// Get URL parameters
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        type: params.get('type'),
        modelo: params.get('modelo')
    };
}

// Load product data from URL parameters
async function loadProductFromURL() {
    const params = getURLParams();
    
    if (!params.category || !params.type || !params.modelo) {
        showError('Parámetros inválidos. Por favor, seleccione un producto desde el catálogo.');
        return;
    }
    
    try {
        // Load JSON data (new simplified structure - just an array)
        const response = await fetch(`../../data/${params.category}.json`);
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos del producto');
        }
        
        const allProducts = await response.json();
        
        // Find the specific product by modelo and type
        productData = allProducts.find(p => p.modelo === params.modelo && p.type === params.type);
        
        if (!productData) {
            throw new Error('Producto no encontrado');
        }
        
        // Render product details
        renderProduct(productData, params);
    } catch (error) {
        console.error('Error loading product:', error);
        showError('No se pudo cargar la información del producto.');
    }
}

// Render product details on the page
function renderProduct(product, params) {
    const container = document.getElementById('productContainer');
    if (!container) return;
    
    // Create breadcrumb HTML
    const categoryNames = {
        'traccion': 'Baterías de Tracción',
        'ciclado': 'Baterías de Ciclado Profundo',
        'estacionaria': 'Baterías Estacionarias'
    };
    
    // Check if product has multiple images
    const hasMultipleImages = product.images && product.images.length > 1;
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x450/333/fff?text=No+Image';
    
    // Create product HTML
    container.innerHTML = `
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb bg-transparent">
                <li class="breadcrumb-item"><a href="../../index.html">Inicio</a></li>
                <li class="breadcrumb-item"><a href="../index.html">Baterías</a></li>
                <li class="breadcrumb-item"><a href="index.html">${categoryNames[params.category] || params.category}</a></li>
                <li class="breadcrumb-item active" aria-current="page">${product.modelo}</li>
            </ol>
        </nav>
        
        <div class="row g-5">
            <div class="col-lg-5">
                ${hasMultipleImages ? `
                <div class="product-gallery">
                    <div class="product-gallery-main">
                        <img src="${mainImage}" alt="${product.modelo}" id="mainProductImage">
                    </div>
                    <div class="product-gallery-thumbnails">
                        ${product.images.map((img, index) => `
                            <div class="product-gallery-thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                                <img src="${img}" alt="${product.modelo} - Imagen ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : `
                <img src="${mainImage}" 
                     alt="${product.modelo}" 
                     class="img-fluid rounded shadow-sm">
                `}
            </div>
            <div class="col-lg-7">
                <h1 class="display-5 fw-bold mb-3">${product.modelo}</h1>
                <p class="lead text-muted mb-4">${product.aplicacion || ''}</p>
                
                <div class="mb-4">
                    <h5 class="fw-bold mb-3">Características Principales</h5>
                    <ul class="list-unstyled">
                        ${product.caracteristicas ? product.caracteristicas.map(f => `
                            <li class="mb-2"><i class="bi bi-check-circle-fill text-orange me-2"></i>${f}</li>
                        `).join('') : ''}
                    </ul>
                </div>
                
                <div class="d-flex gap-3">
                    <a href="../../index.html#contacto" class="btn btn-orange btn-lg">
                        <i class="bi bi-envelope me-2"></i>Solicitar Cotización
                    </a>
                    ${product.pdfUrl ? `
                        <a href="${product.pdfUrl}" class="btn btn-outline-orange btn-lg" target="_blank">
                            <i class="bi bi-file-pdf me-2"></i>Descargar PDF
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
        
        ${product.specifications ? `
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="fw-bold mb-4">Especificaciones Técnicas</h3>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <tbody>
                            ${Object.entries(product.specifications).map(([key, value]) => `
                                <tr>
                                    <th scope="row" class="w-50">${key}</th>
                                    <td>${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        ` : ''}
    `;
    
    // Update page title
    document.title = `${product.modelo} - TAO Power`;
    
    // Initialize gallery if multiple images
    if (hasMultipleImages) {
        initializeGallery();
    }
}

// Initialize product image gallery (MercadoLibre style)
function initializeGallery() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.product-gallery-thumbnail');
    
    if (!mainImage || !thumbnails.length) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = this.getAttribute('data-image');
            mainImage.src = newImageSrc;
        });
    });
}

// Show error message
function showError(message) {
    const container = document.getElementById('productContainer');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger mt-5" role="alert">
                <h4 class="alert-heading">Error</h4>
                <p>${message}</p>
                <hr>
                <p class="mb-0"><a href="index.html" class="alert-link">Volver al catálogo</a></p>
            </div>
        `;
    }
}
