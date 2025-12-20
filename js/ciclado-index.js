// Ciclado Index Page JavaScript
let allBatteries = [];

document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
    window.addEventListener('hashchange', handleHashChange);
});

async function loadBatteryData() {
    try {
        const response = await fetch('../../data/ciclado.json');
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
        'solar': 'Sistemas Solares',
        'rv': 'RV y Autocaravanas',
        'nautica': 'Aplicaciones Náuticas',
        'golf': 'Carritos de Golf',
        'telecomunicaciones': 'Telecomunicaciones'
    };
    
    const appName = applicationNames[filterHash] || filterHash.replace(/-/g, ' ');
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = `Modelos destacados para ${appName}`;
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = `Modelos para ${appName} - Ciclado Profundo Pb-Ac`;
    }
}

function resetTitles() {
    const subtitle = document.getElementById('pageSubtitle');
    if (subtitle) {
        subtitle.textContent = 'Baterías de ciclado profundo para aplicaciones recreativas y comerciales';
    }
    
    const pbAcTitle = document.getElementById('pbAcTitle');
    if (pbAcTitle) {
        pbAcTitle.textContent = 'Modelos Destacados - Ciclado Profundo Pb-Ac';
    }
}

function renderFilteredCards(filterHash) {
    if (!allBatteries.length) return;
    const filterText = normalizeFilterText(filterHash);
    const filtered = allBatteries.filter(product => matchesFilter(product.aplicacion, filterText));
    renderCards('pbAcCardsContainer', filtered);
}

function renderAllCards() {
    if (!allBatteries.length) return;
    renderCards('pbAcCardsContainer', allBatteries);
}

function normalizeFilterText(hash) {
    const patterns = {
        'solar': ['solar'],
        'rv': ['rv', 'autocaravana'],
        'nautica': ['náutica', 'embarcación'],
        'golf': ['golf'],
        'telecomunicaciones': ['telecomunicaciones']
    };
    return patterns[hash] || [hash.replace(/-/g, ' ')];
}

function matchesFilter(aplicacion, filterPatterns) {
    if (!aplicacion) return false;
    const lowerAplicacion = aplicacion.toLowerCase();
    return filterPatterns.some(pattern => lowerAplicacion.includes(pattern.toLowerCase()));
}

function renderCards(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No se encontraron productos para esta aplicación.</p></div>';
        return;
    }
    
    if (products.length > 3) {
        renderCarousel(container, products);
    } else {
        products.forEach((product) => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            const card = createProductCard(product);
            col.appendChild(card);
            container.appendChild(col);
        });
    }
}

function renderCarousel(container, products) {
    const carouselId = `owl-carousel-ciclado-${Date.now()}`;
    
    const carousel = document.createElement('div');
    carousel.id = carouselId;
    carousel.className = 'owl-carousel owl-theme battery-carousel';
    
    products.forEach(product => {
        const card = createProductCard(product);
        carousel.appendChild(card);
    });
    
    container.appendChild(carousel);
    
    setTimeout(() => {
        $(`#${carouselId}`).owlCarousel({
            loop: true,
            margin: 20,
            nav: true,
            dots: true,
            navText: [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0';
    card.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300/333/fff?text=No+Image';
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
    subtitle.textContent = product.aplicacion || product.specifications['Aplicación'] || '';
    cardBody.appendChild(subtitle);
    
    const specsList = document.createElement('div');
    specsList.className = 'mb-3';
    
    // Extract values from specifications object
    const voltaje = product.specifications['Voltaje Nominal'] || '';
    const capacidad = product.specifications['Capacidad'] || product.specifications['Capacidad (C5)'] || '';
    const tipo = product.specifications['Tipo'] || '';
    
    const specs = [
        { label: 'Voltaje', value: voltaje },
        { label: 'Capacidad', value: capacidad },
        { label: 'Tipo', value: tipo }
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
    link.href = `product.html?category=ciclado&type=pb-ac&modelo=${encodeURIComponent(product.modelo)}`;
    link.className = 'btn btn-orange w-100';
    link.textContent = 'Ver Detalles';
    cardBody.appendChild(link);
    
    card.appendChild(cardBody);
    
    return card;
}
