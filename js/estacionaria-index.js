// Estacionaria Index Page JavaScript
let allBatteries = [];

document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
    window.addEventListener('hashchange', handleHashChange);
});

async function loadBatteryData() {
    try {
        const response = await fetch('../../data/estacionaria.json');
        if (response.ok) {
            allBatteries = await response.json();
        }
        handleHashChange();
    } catch (error) {
        console.error('Error loading battery data:', error);
    }
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        renderFilteredCards(hash);
        updateFilteredTitle(hash);
    } else {
        renderAllCards();
        resetTitles();
    }
}

function updateFilteredTitle(filterHash) {
    const applicationNames = {
        'sistemas-ups': 'Sistemas UPS',
        'telecomunicaciones': 'Telecomunicaciones',
        'energia-solar': 'Sistemas de Energía Solar',
        'centros-datos': 'Centros de Datos'
    };
    
    const appName = applicationNames[filterHash] || filterHash.replace(/-/g, ' ');
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = `Modelos destacados para ${appName}`;
    }
    
    const ionLiTitle = document.getElementById('ionLiTitle');
    if (ionLiTitle) {
        ionLiTitle.textContent = `Modelos para ${appName} - Estacionaria Ion Li`;
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = `Modelos para ${appName} - Estacionaria Pb-Ac`;
    }
}

function resetTitles() {
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = 'Baterías estacionarias para respaldo de energía y sistemas críticos';
    }
    
    const ionLiTitle = document.getElementById('ionLiTitle');
    if (ionLiTitle) {
        ionLiTitle.textContent = 'Modelos Destacados - Estacionaria Ion Li';
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = 'Modelos Destacados - Estacionaria Pb-Ac';
    }
}

function renderFilteredCards(filterHash) {
    if (!allBatteries.length) return;
    const filterText = normalizeFilterText(filterHash);
    const filteredIonLi = allBatteries.filter(p => p.type === 'ion-li' && matchesFilter(p.aplicacion, filterText));
    const filteredPbAc = allBatteries.filter(p => p.type === 'pb-ac' && matchesFilter(p.aplicacion, filterText));
    renderCards('ionLiCardsContainer', filteredIonLi, 'ion-li');
    renderCards('pbAcCardsContainer', filteredPbAc, 'pb-ac');
}

function renderAllCards() {
    if (!allBatteries.length) return;
    const ionLi = allBatteries.filter(p => p.type === 'ion-li');
    const pbAc = allBatteries.filter(p => p.type === 'pb-ac');
    renderCards('ionLiCardsContainer', ionLi, 'ion-li');
    renderCards('pbAcCardsContainer', pbAc, 'pb-ac');
}

function normalizeFilterText(hash) {
    const patterns = {
        'sistemas-ups': ['ups'],
        'telecomunicaciones': ['telecomunicaciones'],
        'energia-solar': ['solar'],
        'centros-datos': ['datos']
    };
    return patterns[hash] || [hash.replace(/-/g, ' ')];
}

function matchesFilter(aplicacion, filterPatterns) {
    if (!aplicacion) return false;
    const lowerAplicacion = aplicacion.toLowerCase();
    return filterPatterns.some(pattern => lowerAplicacion.includes(pattern.toLowerCase()));
}

function renderCards(containerId, products, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No se encontraron productos.</p></div>';
        return;
    }
    
    if (products.length > 3) {
        renderCarousel(container, products, type);
    } else {
        products.forEach(product => {
            const card = createProductCard(product, type);
            container.appendChild(card);
        });
    }
}

function renderCarousel(container, products, type) {
    const carouselId = `carousel-${type}-${Date.now()}`;
    const carousel = document.createElement('div');
    carousel.id = carouselId;
    carousel.className = 'carousel slide';
    carousel.setAttribute('data-bs-ride', 'carousel');
    
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
    
    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';
    
    for (let i = 0; i < products.length; i += 3) {
        const slide = document.createElement('div');
        slide.className = i === 0 ? 'carousel-item active' : 'carousel-item';
        const row = document.createElement('div');
        row.className = 'row g-4';
        const slideProducts = products.slice(i, i + 3);
        slideProducts.forEach(product => {
            const card = createProductCard(product, type);
            row.appendChild(card);
        });
        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }
    carousel.appendChild(carouselInner);
    
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

function createProductCard(product, type) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0';
    card.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300/333/fff/fff?text=No+Image';
    img.className = 'card-img-top';
    img.alt = product.modelo;
    card.appendChild(img);
    
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
    
    const specsList = document.createElement('div');
    specsList.className = 'mb-3';
    
    const specs = [
        { label: 'Voltaje', value: product.voltaje },
        { label: 'Capacidad', value: product.capacidad },
        { label: product.energia ? 'Energía' : 'Tipo', value: product.energia ? `${product.energia} kWh` : product.tipo }
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
    
    const link = document.createElement('a');
    link.href = `product.html?category=estacionaria&type=${type}&modelo=${encodeURIComponent(product.modelo)}`;
    link.className = 'btn btn-orange w-100';
    link.textContent = 'Ver Detalles';
    cardBody.appendChild(link);
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}
