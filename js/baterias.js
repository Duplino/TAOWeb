// Baterias Page JavaScript

// Sample battery data
const bateriasData = [
    {
        modelo: 'BAT-12V-100AH-AGM',
        tipo: 'AGM',
        voltaje: '12V',
        capacidad: '100Ah',
        aplicacion: 'UPS, Solar',
        caracteristicas: [
            'Libre de mantenimiento',
            'Ciclo de vida: 5-8 años',
            'Resistente a vibraciones',
            'Sellada y recargable'
        ]
    },
    {
        modelo: 'BAT-12V-200AH-GEL',
        tipo: 'Gel',
        voltaje: '12V',
        capacidad: '200Ah',
        aplicacion: 'Solar, Náutica',
        caracteristicas: [
            'Electrolito en gel',
            'Mayor duración',
            'Ideal para descargas profundas',
            'Resistente a temperaturas extremas'
        ]
    },
    {
        modelo: 'BAT-12V-75AH-PA',
        tipo: 'Plomo-Ácido',
        voltaje: '12V',
        capacidad: '75Ah',
        aplicacion: 'Automotor',
        caracteristicas: [
            'Alta corriente de arranque',
            'Económica',
            'Mantenimiento simple',
            'Gran disponibilidad'
        ]
    },
    {
        modelo: 'BAT-24V-100AH-LITIO',
        tipo: 'Litio',
        voltaje: '24V',
        capacidad: '100Ah',
        aplicacion: 'Industrial, Solar',
        caracteristicas: [
            'Peso ligero',
            'Carga rápida',
            'Mayor densidad energética',
            'Larga vida útil (10+ años)'
        ]
    },
    {
        modelo: 'BAT-48V-200AH-TRACCION',
        tipo: 'Tracción',
        voltaje: '48V',
        capacidad: '200Ah',
        aplicacion: 'Montacargas, Vehículos eléctricos',
        caracteristicas: [
            'Diseño para uso intensivo',
            'Resistente a ciclos profundos',
            'Mantenimiento programado',
            'Alta confiabilidad'
        ]
    },
    {
        modelo: 'BAT-6V-225AH-PA',
        tipo: 'Plomo-Ácido',
        voltaje: '6V',
        capacidad: '225Ah',
        aplicacion: 'Golf Carts, Carritos',
        caracteristicas: [
            'Construcción robusta',
            'Ciclo profundo',
            'Económica',
            'Fácil conexión en serie'
        ]
    },
    {
        modelo: 'BAT-12V-150AH-AGM',
        tipo: 'AGM',
        voltaje: '12V',
        capacidad: '150Ah',
        aplicacion: 'Telecomunicaciones, UPS',
        caracteristicas: [
            'Sin emisión de gases',
            'Instalación flexible',
            'Baja autodescarga',
            'Alta fiabilidad'
        ]
    },
    {
        modelo: 'BAT-12V-50AH-LITIO',
        tipo: 'Litio',
        voltaje: '12V',
        capacidad: '50Ah',
        aplicacion: 'Solar, Portátil',
        caracteristicas: [
            'Compacta y ligera',
            'BMS integrado',
            'Carga rápida',
            'Más de 3000 ciclos'
        ]
    }
];

let filteredData = [...bateriasData];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const tipoFilter = document.getElementById('tipoFilter');
const voltajeFilter = document.getElementById('voltajeFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const tableBody = document.getElementById('bateriasTableBody');
const noResults = document.getElementById('noResults');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    
    // Event Listeners
    searchInput.addEventListener('input', filterBaterias);
    tipoFilter.addEventListener('change', filterBaterias);
    voltajeFilter.addEventListener('change', filterBaterias);
    clearFiltersBtn.addEventListener('click', clearFilters);
});

// Render table
function renderTable() {
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    
    filteredData.forEach((bateria, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${bateria.modelo}</td>
            <td><span class="badge badge-orange">${bateria.tipo}</span></td>
            <td>${bateria.voltaje}</td>
            <td>${bateria.capacidad}</td>
            <td>${bateria.aplicacion}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-orange" data-index="${index}">
                    <i class="bi bi-eye me-1"></i>Ver Detalles
                </button>
            </td>
        `;
        tableBody.appendChild(row);
        
        // Add event listener to the button
        const button = row.querySelector('button');
        button.addEventListener('click', () => showDetails(index));
    });
}

// Filter batteries
function filterBaterias() {
    const searchTerm = searchInput.value.toLowerCase();
    const tipoValue = tipoFilter.value;
    const voltajeValue = voltajeFilter.value;
    
    filteredData = bateriasData.filter(bateria => {
        const matchesSearch = bateria.modelo.toLowerCase().includes(searchTerm) ||
                            bateria.aplicacion.toLowerCase().includes(searchTerm);
        const matchesTipo = !tipoValue || bateria.tipo === tipoValue;
        const matchesVoltaje = !voltajeValue || bateria.voltaje === voltajeValue;
        
        return matchesSearch && matchesTipo && matchesVoltaje;
    });
    
    renderTable();
}

// Clear filters
function clearFilters() {
    searchInput.value = '';
    tipoFilter.value = '';
    voltajeFilter.value = '';
    filteredData = [...bateriasData];
    renderTable();
}

// Show product details in modal
function showDetails(index) {
    const bateria = filteredData[index];
    
    document.getElementById('modalModelo').textContent = bateria.modelo;
    document.getElementById('modalTipo').textContent = bateria.tipo;
    document.getElementById('modalVoltaje').textContent = bateria.voltaje;
    document.getElementById('modalCapacidad').textContent = bateria.capacidad;
    document.getElementById('modalAplicacion').textContent = bateria.aplicacion;
    
    const caracteristicasList = document.getElementById('modalCaracteristicas');
    caracteristicasList.innerHTML = '';
    bateria.caracteristicas.forEach(caract => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="bi bi-check-circle-fill text-orange me-2"></i>${caract}`;
        li.className = 'mb-2';
        caracteristicasList.appendChild(li);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}
