// Traccion Index Page JavaScript
// Loads battery data and renders cards with carousel support
// Supports filtering by application via URL hash

let allBatteries = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
    
    // Listen for hash changes for filtering
    window.addEventListener('hashchange', handleHashChange);
});

// Load battery data from JSON file
async function loadBatteryData() {
    try {
        const response = await fetch('../../data/traccion.json');
        if (response.ok) {
            allBatteries = await response.json();
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
    if (!allBatteries.length) return;
    
    // Normalize the hash to match application field
    const filterText = normalizeFilterText(filterHash);
    
    // Filter Ion Li products
    const filteredIonLi = allBatteries.filter(product => 
        product.type === 'ion-li' && matchesFilter(product.aplicacion, filterText)
    );
    
    // Filter Pb-Ac products
    const filteredPbAc = allBatteries.filter(product => 
        product.type === 'pb-ac' && matchesFilter(product.aplicacion, filterText)
    );
    
    renderCards('ionLiCardsContainer', filteredIonLi, 'ion-li');
    renderCards('pbAcCardsContainer', filteredPbAc, 'pb-ac');
}

// Render all cards without filter
function renderAllCards() {
    if (!allBatteries.length) return;
    
    // Filter Ion Li and Pb-Ac products
    const ionLiProducts = allBatteries.filter(p => p.type === 'ion-li');
    const pbAcProducts = allBatteries.filter(p => p.type === 'pb-ac');
    
    renderCards('ionLiCardsContainer', ionLiProducts, 'ion-li');
    renderCards('pbAcCardsContainer', pbAcProducts, 'pb-ac');
}

// Normalize filter text for matching
function normalizeFilterText(hash) {
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

// Render cards to a container (with carousel if > 3 items)
function renderCards(containerId, products, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No se encontraron productos para esta aplicación.</p></div>';
        return;
    }
    
    // Use carousel if more than 3 products
    if (products.length > 3) {
        renderCarousel(container, products, type);
    } else {
        // Render as grid
        products.forEach((product) => {
            const card = createProductCard(product, type);
            container.appendChild(card);
        });
    }
}

// Create carousel HTML
function renderCarousel(container, products, type) {
    const carouselId = `carousel-${type}-${Date.now()}`;
    
    const carousel = document.createElement('div');
    carousel.id = carouselId;
    carousel.className = 'carousel slide';
    carousel.setAttribute('data-bs-ride', 'carousel');
    
    // Carousel indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    const numSlides = Math.ceil(products.length / 3);
    for (let i = 0; i < numSlides; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-bs-target', `#${carouselId}`);
        button.setAttribute('data-bs-slide-to', i);
        if (i === 0) button.className = 'active';
        indicators.appendChild(button);
    }
    carousel.appendChild(indicators);
    
    // Carousel inner
    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';
    
    // Create slides (3 items per slide on desktop, 1 on mobile)
    for (let i = 0; i < products.length; i += 3) {
        const slide = document.createElement('div');
        slide.className = i === 0 ? 'carousel-item active' : 'carousel-item';
        
        const row = document.createElement('div');
        row.className = 'row g-4';
        
        // Add up to 3 products per slide
        const slideProducts = products.slice(i, i + 3);
        slideProducts.forEach(product => {
            const card = createProductCard(product, type);
            row.appendChild(card);
        });
        
        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }
    carousel.appendChild(carouselInner);
    
    // Carousel controls
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control-prev';
    prevButton.type = 'button';
    prevButton.setAttribute('data-bs-target', `#${carouselId}`);
    prevButton.setAttribute('data-bs-slide', 'prev');
    prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control-next';
    nextButton.type = 'button';
    nextButton.setAttribute('data-bs-target', `#${carouselId}`);
    nextButton.setAttribute('data-bs-slide', 'next');
    nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';
    
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
    
    container.appendChild(carousel);
}

// Create a product card
function createProductCard(product, type) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0';
    card.style.cursor = 'pointer';
    
    // Card Image
    const img = document.createElement('img');
    img.src = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300/333/fff/fff?text=No+Image';
    img.className = 'card-img-top';
    img.alt = product.modelo;
    card.appendChild(img);
    
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const title = document.createElement('h5');
    title.className = 'card-title fw-bold';
    title.textContent = product.modelo;
    cardBody.appendChild(title);
    
    const subtitle = document.createElement('p');
    subtitle.className = 'card-text text-muted mb-3';
    subtitle.textContent = product.aplicacion || '';
    cardBody.appendChild(subtitle);
    
    // Specs list
    const specsList = document.createElement('div');
    specsList.className = 'mb-3';
    
    const specs = [
        { label: 'Voltaje', value: product.voltaje },
        { label: 'Capacidad', value: product.capacidad },
        { label: product.energia ? 'Energía' : 'Peso', value: product.energia ? `${product.energia} kWh` : `${product.peso} kg` }
    ];
    
    specs.forEach(spec => {
        if (spec.value) {
            const specItem = document.createElement('div');
            specItem.className = 'mb-1 small';
            specItem.innerHTML = `<i class="bi bi-check-circle-fill text-orange me-2"></i><strong>${spec.label}:</strong> ${spec.value}`;
            specsList.appendChild(specItem);
        }
    });
    
    cardBody.appendChild(specsList);
    
    // Action Button
    const link = document.createElement('a');
    link.href = `product.html?category=traccion&type=${type}&modelo=${encodeURIComponent(product.modelo)}`;
    link.className = 'btn btn-orange w-100';
    link.textContent = 'Ver Detalles';
    cardBody.appendChild(link);
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}
