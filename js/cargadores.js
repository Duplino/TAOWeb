// Cargadores Page JavaScript

// Sample charger data
const cargadoresData = [
    {
        modelo: 'CARG-12V-10A-AUTO',
        tipo: 'Automático',
        voltaje: '12V',
        corriente: '10A',
        aplicacion: 'Automotor, Náutica',
        caracteristicas: [
            'Carga automática inteligente',
            'Protección contra sobrecarga',
            'Indicador LED de estado',
            'Compacto y portátil'
        ]
    },
    {
        modelo: 'CARG-24V-20A-IND',
        tipo: 'Industrial',
        voltaje: '24V',
        corriente: '20A',
        aplicacion: 'Industrial, Montacargas',
        caracteristicas: [
            'Construcción robusta',
            'Alta eficiencia',
            'Sistema de refrigeración',
            'Protecciones múltiples'
        ]
    },
    {
        modelo: 'CARG-12V-30A-INTEL',
        tipo: 'Inteligente',
        voltaje: '12V',
        corriente: '30A',
        aplicacion: 'AGM, Gel, Litio',
        caracteristicas: [
            'Reconocimiento automático',
            'Múltiples modos de carga',
            'Display LCD',
            'Función de mantenimiento'
        ]
    },
    {
        modelo: 'CARG-48V-15A-IND',
        tipo: 'Industrial',
        voltaje: '48V',
        corriente: '15A',
        aplicacion: 'Vehículos eléctricos',
        caracteristicas: [
            'Alta potencia',
            'Ventilación forzada',
            'Protección térmica',
            'Conexión rápida'
        ]
    },
    {
        modelo: 'CARG-12V-5A-RAPID',
        tipo: 'Rápido',
        voltaje: '12V',
        corriente: '5A',
        aplicacion: 'Emergencias, Portátil',
        caracteristicas: [
            'Carga rápida',
            'Ultracompacto',
            'Cable de 2 metros',
            'Fácil transporte'
        ]
    },
    {
        modelo: 'CARG-UNI-6-12-24V-8A',
        tipo: 'Automático',
        voltaje: 'Universal',
        corriente: '8A',
        aplicacion: 'Múltiple',
        caracteristicas: [
            'Voltaje seleccionable',
            'Ideal para taller',
            'Pinzas reforzadas',
            'Protección inversa'
        ]
    },
    {
        modelo: 'CARG-12V-50A-IND',
        tipo: 'Industrial',
        voltaje: '12V',
        corriente: '50A',
        aplicacion: 'Bancos de baterías',
        caracteristicas: [
            'Alta capacidad',
            'Carga ecualizada',
            'Panel de control digital',
            'Certificado industrial'
        ]
    },
    {
        modelo: 'CARG-24V-10A-INTEL',
        tipo: 'Inteligente',
        voltaje: '24V',
        corriente: '10A',
        aplicacion: 'Solar, UPS',
        caracteristicas: [
            'Algoritmo optimizado',
            'Eficiencia >90%',
            'Bajo consumo standby',
            'Conexión remota opcional'
        ]
    }
];

let filteredData = [...cargadoresData];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const tipoFilter = document.getElementById('tipoFilter');
const voltajeFilter = document.getElementById('voltajeFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const tableBody = document.getElementById('cargadoresTableBody');
const noResults = document.getElementById('noResults');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    
    // Event Listeners
    searchInput.addEventListener('input', filterCargadores);
    tipoFilter.addEventListener('change', filterCargadores);
    voltajeFilter.addEventListener('change', filterCargadores);
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
    
    filteredData.forEach((cargador, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${cargador.modelo}</td>
            <td><span class="badge badge-orange">${cargador.tipo}</span></td>
            <td>${cargador.voltaje}</td>
            <td>${cargador.corriente}</td>
            <td>${cargador.aplicacion}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-orange" onclick="showDetails(${index})">
                    <i class="bi bi-eye me-1"></i>Ver Detalles
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter chargers
function filterCargadores() {
    const searchTerm = searchInput.value.toLowerCase();
    const tipoValue = tipoFilter.value;
    const voltajeValue = voltajeFilter.value;
    
    filteredData = cargadoresData.filter(cargador => {
        const matchesSearch = cargador.modelo.toLowerCase().includes(searchTerm) ||
                            cargador.aplicacion.toLowerCase().includes(searchTerm);
        const matchesTipo = !tipoValue || cargador.tipo === tipoValue;
        const matchesVoltaje = !voltajeValue || cargador.voltaje === voltajeValue;
        
        return matchesSearch && matchesTipo && matchesVoltaje;
    });
    
    renderTable();
}

// Clear filters
function clearFilters() {
    searchInput.value = '';
    tipoFilter.value = '';
    voltajeFilter.value = '';
    filteredData = [...cargadoresData];
    renderTable();
}

// Show product details in modal
function showDetails(index) {
    const cargador = filteredData[index];
    
    document.getElementById('modalModelo').textContent = cargador.modelo;
    document.getElementById('modalTipo').textContent = cargador.tipo;
    document.getElementById('modalVoltaje').textContent = cargador.voltaje;
    document.getElementById('modalCorriente').textContent = cargador.corriente;
    document.getElementById('modalAplicacion').textContent = cargador.aplicacion;
    
    const caracteristicasList = document.getElementById('modalCaracteristicas');
    caracteristicasList.innerHTML = '';
    cargador.caracteristicas.forEach(caract => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="bi bi-check-circle-fill text-orange me-2"></i>${caract}`;
        li.className = 'mb-2';
        caracteristicasList.appendChild(li);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}
