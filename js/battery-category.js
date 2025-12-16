// Battery Category Page JavaScript
// Dynamically loads battery data from JSON files based on the current page

let currentData = null;
let currentProduct = null;

// Determine which JSON file to load based on the current page
function getDataFileName() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    const fileMap = {
        'traccion-pb-ac.html': 'traccion-pb-ac.json',
        'traccion-ion-li.html': 'traccion-ion-li.json',
        'ciclado-profundo-pb-ac.html': 'ciclado-profundo-pb-ac.json',
        'estacionarias-pb-ac.html': 'estacionarias-pb-ac.json',
        'estacionarias-ion-li.html': 'estacionarias-ion-li.json'
    };
    
    return fileMap[filename] || null;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBatteryData();
});

// Load battery data from JSON
async function loadBatteryData() {
    const dataFile = getDataFileName();
    
    if (!dataFile) {
        console.error('No data file found for this page');
        showNoResults();
        return;
    }
    
    try {
        const response = await fetch(`../data/${dataFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        currentData = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error loading battery data:', error);
        showNoResults();
    }
}

// Render the table with dynamic columns
function renderTable() {
    if (!currentData || !currentData.data || currentData.data.length === 0) {
        showNoResults();
        return;
    }
    
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('modelosTableBody');
    const noResults = document.getElementById('noResults');
    
    // Hide no results message
    noResults.classList.add('d-none');
    
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header columns
    currentData.columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label;
        tableHeader.appendChild(th);
    });
    
    // Add actions column
    const actionsHeader = document.createElement('th');
    actionsHeader.className = 'text-center';
    actionsHeader.textContent = 'Acciones';
    tableHeader.appendChild(actionsHeader);
    
    // Create data rows
    currentData.data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Add data cells based on columns
        currentData.columns.forEach(column => {
            const td = document.createElement('td');
            const value = item[column.key];
            
            // Format first column (modelo) as bold
            if (column.key === 'modelo') {
                td.className = 'fw-bold';
                td.textContent = value;
            } else if (column.key === 'tipo') {
                // Format tipo column with badge
                const badge = document.createElement('span');
                badge.className = 'badge badge-orange';
                badge.textContent = value;
                td.appendChild(badge);
            } else {
                td.textContent = value || '-';
            }
            
            row.appendChild(td);
        });
        
        // Add action button
        const actionTd = document.createElement('td');
        actionTd.className = 'text-center';
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-orange';
        button.innerHTML = '<i class="bi bi-eye me-1"></i>Ver Detalles';
        button.addEventListener('click', () => showDetails(index));
        actionTd.appendChild(button);
        row.appendChild(actionTd);
        
        tableBody.appendChild(row);
    });
}

// Show no results message
function showNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.remove('d-none');
    }
}

// Show product details in modal
function showDetails(index) {
    if (!currentData || !currentData.data[index]) {
        return;
    }
    
    const product = currentData.data[index];
    currentProduct = product;
    
    const modalBody = document.getElementById('modalBodyContent');
    
    // Build modal content dynamically
    let modalHtml = '<div class="row">';
    
    // Left column - Product details
    modalHtml += '<div class="col-md-6">';
    modalHtml += `<h4 class="fw-bold text-orange mb-3">${product.modelo || 'Modelo'}</h4>`;
    modalHtml += '<table class="table table-borderless">';
    
    // Display all column data
    currentData.columns.forEach(column => {
        if (column.key !== 'modelo' && product[column.key]) {
            modalHtml += `
                <tr>
                    <th>${column.label}:</th>
                    <td>${product[column.key]}</td>
                </tr>
            `;
        }
    });
    
    modalHtml += '</table>';
    modalHtml += '</div>';
    
    // Right column - Características
    modalHtml += '<div class="col-md-6">';
    if (product.caracteristicas && product.caracteristicas.length > 0) {
        modalHtml += '<h5 class="fw-bold mb-3">Características</h5>';
        modalHtml += '<ul class="list-unstyled">';
        product.caracteristicas.forEach(caracteristica => {
            modalHtml += `<li class="mb-2"><i class="bi bi-check-circle-fill text-orange me-2"></i>${caracteristica}</li>`;
        });
        modalHtml += '</ul>';
    }
    modalHtml += '</div>';
    
    modalHtml += '</div>';
    
    modalBody.innerHTML = modalHtml;
    
    // Setup PDF download button
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        // Remove old event listeners by cloning
        const newBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
        
        newBtn.addEventListener('click', () => downloadPDF(product));
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Download PDF function
function downloadPDF(product) {
    if (product.pdfUrl) {
        // In a real scenario, this would trigger an actual download
        // For now, we'll show an alert since PDFs don't exist yet
        alert(`Descargando ficha técnica de ${product.modelo}...\n\nRuta: ${product.pdfUrl}\n\nNota: En producción, esto descargará el PDF real.`);
        
        // Uncomment this for actual PDF download when files are available
        // window.open(product.pdfUrl, '_blank');
        
        // Or use this for forced download:
        // const link = document.createElement('a');
        // link.href = product.pdfUrl;
        // link.download = `${product.modelo}-ficha-tecnica.pdf`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    } else {
        alert('Ficha técnica no disponible para este modelo.');
    }
}
