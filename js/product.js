// Product page JavaScript
// Loads battery data from JSON based on URL parameters

let productData = null;
let categoryData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductFromURL();
});

// Get URL parameters
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'), // traccion, ciclado, estacionaria
        type: params.get('type'), // pb-ac, ion-li
        modelo: params.get('modelo') // battery model name
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
        // Construct JSON file path based on category and type
        let jsonFile = '';
        if (params.category === 'traccion') {
            jsonFile = params.type === 'ion-li' ? 'traccion-ion-li.json' : 'traccion-pb-ac.json';
        } else if (params.category === 'ciclado') {
            jsonFile = 'ciclado-profundo-pb-ac.json';
        } else if (params.category === 'estacionaria') {
            jsonFile = params.type === 'ion-li' ? 'estacionarias-ion-li.json' : 'estacionarias-pb-ac.json';
        }
        
        // Load JSON data
        const response = await fetch(`../data/${jsonFile}`);
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos del producto');
        }
        
        categoryData = await response.json();
        
        // Find the specific product by modelo
        productData = categoryData.data.find(item => item.modelo === params.modelo);
        
        if (!productData) {
            throw new Error('Producto no encontrado');
        }
        
        // Render product details
        renderProductDetails();
        
    } catch (error) {
        console.error('Error loading product:', error);
        showError('No se pudo cargar el producto. Por favor, intente nuevamente.');
    }
}

// Render product details
function renderProductDetails() {
    const container = document.getElementById('productContainer');
    
    // Create breadcrumb
    const breadcrumb = `
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="../index.html">Inicio</a></li>
                <li class="breadcrumb-item"><a href="index.html">Baterías</a></li>
                <li class="breadcrumb-item"><a href="${categoryData.category}/index.html">${getCategoryName(categoryData.category)}</a></li>
                <li class="breadcrumb-item active" aria-current="page">${productData.modelo}</li>
            </ol>
        </nav>
    `;
    
    // Create image gallery
    const images = productData.images || [];
    const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/800x600/333/fff?text=Imagen+No+Disponible';
    
    const imageGallery = `
        <div class="col-md-6 mb-4">
            <div class="product-image-container">
                <img src="${mainImage}" alt="${productData.modelo}" class="img-fluid rounded shadow" id="mainProductImage">
            </div>
            ${images.length > 1 ? `
                <div class="row g-2 mt-3">
                    ${images.map((img, index) => `
                        <div class="col-3">
                            <img src="${img}" alt="${productData.modelo} - ${index + 1}" 
                                class="img-fluid rounded shadow-sm thumbnail-image" 
                                onclick="changeMainImage('${img}')"
                                style="cursor: pointer;">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    // Create product info
    const specifications = productData.specifications || {};
    const caracteristicas = productData.caracteristicas || [];
    
    const productInfo = `
        <div class="col-md-6">
            <h1 class="fw-bold mb-3">${productData.modelo}</h1>
            <p class="text-muted lead mb-4">${productData.aplicacion || 'Aplicación Industrial'}</p>
            
            <!-- Key Features -->
            ${caracteristicas.length > 0 ? `
                <div class="mb-4">
                    <h5 class="fw-bold mb-3">Características Principales</h5>
                    <ul class="list-unstyled">
                        ${caracteristicas.map(feat => `
                            <li class="mb-2">
                                <i class="bi bi-check-circle-fill text-orange me-2"></i>
                                ${feat}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <!-- CTA Buttons -->
            <div class="d-flex gap-3 mb-4">
                <a href="../index.html#contacto" class="btn btn-orange btn-lg">
                    <i class="bi bi-envelope me-2"></i>Solicitar Cotización
                </a>
                ${productData.pdfUrl ? `
                    <a href="${productData.pdfUrl}" target="_blank" class="btn btn-outline-orange btn-lg">
                        <i class="bi bi-file-pdf me-2"></i>Descargar PDF
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Create specifications table
    const specsTable = Object.keys(specifications).length > 0 ? `
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="fw-bold mb-4">Especificaciones Técnicas</h3>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <tbody>
                            ${Object.entries(specifications).map(([key, value]) => `
                                <tr>
                                    <th scope="row" style="width: 40%;">${key}</th>
                                    <td>${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ` : '';
    
    // Assemble the complete HTML
    container.innerHTML = `
        ${breadcrumb}
        <div class="row">
            ${imageGallery}
            ${productInfo}
        </div>
        ${specsTable}
    `;
}

// Change main product image
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'traccion': 'Baterías de Tracción',
        'ciclado': 'Baterías de Ciclado Profundo',
        'estacionaria': 'Baterías Estacionarias'
    };
    return names[category] || 'Baterías';
}

// Show error message
function showError(message) {
    const container = document.getElementById('productContainer');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${message}
        </div>
        <div class="text-center mt-4">
            <a href="index.html" class="btn btn-orange">Volver al Catálogo</a>
        </div>
    `;
}
