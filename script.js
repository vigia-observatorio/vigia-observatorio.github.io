// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip empty anchors
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Active Navigation Highlighting
// ===========================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===========================
// Expand/Collapse Findings
// ===========================
function toggleFinding(button) {
    const card = button.closest('.finding-card');
    const details = card.querySelector('.finding-details');
    const isExpanded = button.classList.contains('expanded');

    if (isExpanded) {
        button.classList.remove('expanded');
        details.classList.remove('expanded');
        button.querySelector('span').textContent = 'Ver más detalles';
    } else {
        button.classList.add('expanded');
        details.classList.add('expanded');
        button.querySelector('span').textContent = 'Ver menos detalles';
    }
}

// ===========================
// Date Navigation
// ===========================
async function loadAnalysis(dateString, event) {
    // Remove active class from all date options
    document.querySelectorAll('.date-option').forEach(option => {
        option.classList.remove('active');
    });

    // Add active class to selected option if event is provided
    if (event && event.currentTarget) {
        const selectedOption = event.currentTarget;
        selectedOption.classList.add('active');
    }

    // Load data from JSON
    const lang = document.documentElement.lang || 'es';
    // Use absolute path from root for GitHub Pages compatibility
    const baseUrl = window.location.pathname.includes('vigia-webpage')
        ? '/vigia-webpage/'
        : '/';
    const dataUrl = `${baseUrl}data/${dateString}-${lang}.json`;

    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error('Data not found');

        const data = await response.json();

        // Render the data with original JSON structure based on language
        if (lang === 'en') {
            renderDashboardEN(data.general_analysis);
            renderSynthesisEN(data.executive_summary, data.document_metadata);
            renderContextoMexicanoEN(data.mexican_context);
            renderFindingsEN(data.ai_findings);
        } else {
            renderDashboard(data.analisis_general);
            renderSynthesis(data.sintesis_ejecutiva, data.metadata_documento);
            renderContextoMexicano(data.contexto_mexicano);
            renderFindings(data.hallazgos_ai);
        }

        console.log(`✓ Loaded analysis for ${dateString}`);

        // Scroll to timeline
        const timeline = document.getElementById('timeline');
        if (timeline) {
            const headerOffset = 100;
            const elementPosition = timeline.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    } catch (error) {
        console.error('Error loading analysis:', error);
        const errorMsg = lang === 'en' ? 'Error loading analysis. Please try again.' : 'Error al cargar el análisis. Por favor intente nuevamente.';
        alert(errorMsg);
    }
}

// ===========================
// Render Dashboard
// ===========================
function renderDashboard(analisisGeneral) {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    // Calculate total if not present
    const totalHallazgos = analisisGeneral.total_hallazgos ||
                          (analisisGeneral.numero_menciones_implicitas + analisisGeneral.numero_menciones_explicitas);

    // Get or calculate categories count
    const numCategorias = analisisGeneral.numero_categorias_riesgo ||
                         (analisisGeneral.categorias_riesgo_presentes ? analisisGeneral.categorias_riesgo_presentes.length : 0);

    dashboard.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${totalHallazgos}</div>
            <div class="stat-label">Hallazgos Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${analisisGeneral.numero_menciones_implicitas || 0}</div>
            <div class="stat-label">Menciones Implícitas</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${analisisGeneral.numero_menciones_explicitas || 0}</div>
            <div class="stat-label">Menciones Explícitas</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${numCategorias}</div>
            <div class="stat-label">Categorías de Riesgo</div>
        </div>
    `;

    // Re-observe stat cards for animation
    dashboard.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ===========================
// Render Synthesis
// ===========================
function renderSynthesis(sintesisEjecutiva, metadataDocumento) {
    const synthesisSection = document.getElementById('synthesis');
    if (!synthesisSection) return;

    // Parse date without timezone conversion issues
    const [year, month, day] = metadataDocumento.fecha_publicacion.split('-');
    const fecha = new Date(year, month - 1, day);
    const fechaFormateada = fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    synthesisSection.innerHTML = `
        <div class="synthesis-content">
            <h3>Síntesis de Hallazgos - ${fechaFormateada}</h3>
            <p class="synthesis-summary">${sintesisEjecutiva}</p>
        </div>
    `;
}

// ===========================
// Render Contexto Mexicano
// ===========================
function renderContextoMexicano(contextoMexicano) {
    const contextoSection = document.getElementById('contexto-mexicano');
    if (!contextoSection) return;

    // Render consideraciones_especiales
    const consideracionesHTML = contextoMexicano.consideraciones_especiales
        ? contextoMexicano.consideraciones_especiales.map(item => `<li>${item}</li>`).join('')
        : '<li>No hay consideraciones especiales disponibles</li>';

    // Render precedentes_relevantes
    const precedentesHTML = contextoMexicano.precedentes_relevantes
        ? contextoMexicano.precedentes_relevantes.map(item => `<li>${item}</li>`).join('')
        : '<li>No hay precedentes relevantes disponibles</li>';

    contextoSection.innerHTML = `
        <div class="contexto-content">
            <div class="contexto-section">
                <h4>Consideraciones Especiales</h4>
                <ul class="contexto-list">
                    ${consideracionesHTML}
                </ul>
            </div>

            <div class="contexto-section">
                <h4>Capacidad de Enforcement</h4>
                <p class="contexto-text">${contextoMexicano.capacidad_enforcement || 'No disponible'}</p>
            </div>

            <div class="contexto-section">
                <h4>Precedentes Relevantes</h4>
                <ul class="contexto-list">
                    ${precedentesHTML}
                </ul>
            </div>
        </div>
    `;
}

// ===========================
// Render Dashboard EN
// ===========================
function renderDashboardEN(generalAnalysis) {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    // Calculate total if not present
    const totalFindings = generalAnalysis.number_of_explicit_mentions + generalAnalysis.number_of_implicit_mentions;

    // Get or calculate categories count
    const numCategories = generalAnalysis.present_risk_categories ? generalAnalysis.present_risk_categories.length : 0;

    dashboard.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${totalFindings}</div>
            <div class="stat-label">Total Findings</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${generalAnalysis.number_of_implicit_mentions || 0}</div>
            <div class="stat-label">Implicit Mentions</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${generalAnalysis.number_of_explicit_mentions || 0}</div>
            <div class="stat-label">Explicit Mentions</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${numCategories}</div>
            <div class="stat-label">Risk Categories</div>
        </div>
    `;

    // Re-observe stat cards for animation
    dashboard.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ===========================
// Render Synthesis EN
// ===========================
function renderSynthesisEN(executiveSummary, documentMetadata) {
    const synthesisSection = document.getElementById('synthesis');
    if (!synthesisSection) return;

    // Parse date without timezone conversion issues
    const [year, month, day] = documentMetadata.publication_date.split('-');
    const fecha = new Date(year, month - 1, day);
    const fechaFormateada = fecha.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    synthesisSection.innerHTML = `
        <div class="synthesis-content">
            <h3>Findings Synthesis - ${fechaFormateada}</h3>
            <p class="synthesis-summary">${executiveSummary}</p>
        </div>
    `;
}

// ===========================
// Render Contexto Mexicano EN
// ===========================
function renderContextoMexicanoEN(mexicanContext) {
    const contextoSection = document.getElementById('contexto-mexicano');
    if (!contextoSection) return;

    // Render special_considerations
    const consideracionesHTML = mexicanContext.special_considerations
        ? mexicanContext.special_considerations.map(item => `<li>${item}</li>`).join('')
        : '<li>No special considerations available</li>';

    // Render relevant_precedents
    const precedentesHTML = mexicanContext.relevant_precedents
        ? mexicanContext.relevant_precedents.map(item => `<li>${item}</li>`).join('')
        : '<li>No relevant precedents available</li>';

    contextoSection.innerHTML = `
        <div class="contexto-content">
            <div class="contexto-section">
                <h4>Special Considerations</h4>
                <ul class="contexto-list">
                    ${consideracionesHTML}
                </ul>
            </div>

            <div class="contexto-section">
                <h4>Enforcement Capacity</h4>
                <p class="contexto-text">${mexicanContext.enforcement_capacity || 'Not available'}</p>
            </div>

            <div class="contexto-section">
                <h4>Relevant Precedents</h4>
                <ul class="contexto-list">
                    ${precedentesHTML}
                </ul>
            </div>
        </div>
    `;
}

// ===========================
// Render Findings EN
// ===========================
function renderFindingsEN(findings) {
    const findingsContainer = document.getElementById('findings');
    if (!findingsContainer) return;

    const findingsHTML = findings.map(finding => {
        const risksHTML = finding.risk_categories.map(risk => `
            <div class="risk-item">
                <span class="risk-label">${risk.risk_id} - ${risk.risk_name}</span>
                <p>Severity: ${risk.severity_level}</p>
            </div>
        `).join('');

        const recsHTML = finding.recommendations.map(rec =>
            `<li>${rec}</li>`
        ).join('');

        // Map severity to CSS class
        const severityMap = {
            'Extreme': 'extreme',
            'Very High': 'very-high',
            'High': 'high',
            'Medium': 'medium',
            'Low': 'low'
        };

        // Find highest severity from risk_categories
        const maxSeverity = finding.risk_categories.reduce((max, risk) => {
            const severities = ['Low', 'Medium', 'High', 'Very High', 'Extreme'];
            const current = severities.indexOf(risk.severity_level);
            const maxIndex = severities.indexOf(max);
            return current > maxIndex ? risk.severity_level : max;
        }, 'Low');

        const severityClass = severityMap[maxSeverity] || 'medium';

        return `
            <div class="finding-card severity-${severityClass}">
                <div class="finding-header">
                    <div class="finding-title">
                        <span class="finding-id">${finding.finding_id}</span>
                        <h3>${finding.regulatory_domain}</h3>
                    </div>
                    <div class="finding-meta">
                        <span class="severity-badge ${severityClass}">${maxSeverity}</span>
                        <span class="domain-badge">${finding.finding_type}</span>
                    </div>
                </div>

                <div class="finding-body">
                    <div class="finding-section">
                        <h4>Finding Type</h4>
                        <p>${finding.finding_type}</p>
                    </div>

                    <div class="finding-section">
                        <h4>Original Fragment</h4>
                        <p class="source-quote">${finding.original_fragment}</p>
                        <p class="source-pages">${finding.document_location}</p>
                    </div>

                    <div class="finding-details">
                        <div class="finding-section">
                            <h4>Identified Risks</h4>
                            <div class="risk-list">
                                ${risksHTML}
                            </div>
                        </div>

                        <div class="finding-section">
                            <h4>Analysis</h4>
                            <p>${finding.relevance_analysis}</p>
                        </div>

                        <div class="finding-section recommendations">
                            <h4>Recommendations</h4>
                            <ul>
                                ${recsHTML}
                            </ul>
                        </div>
                    </div>
                </div>

                <button class="expand-btn" onclick="toggleFinding(this)">
                    <span>View more details</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');

    findingsContainer.innerHTML = findingsHTML;

    // Re-observe finding cards for animation
    findingsContainer.querySelectorAll('.finding-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ===========================
// Render Findings
// ===========================
function renderFindings(hallazgos) {
    const findingsContainer = document.getElementById('findings');
    if (!findingsContainer) return;

    const findingsHTML = hallazgos.map(hallazgo => {
        const risksHTML = hallazgo.categorias_riesgo.map(riesgo => `
            <div class="risk-item">
                <span class="risk-label">${riesgo.id_riesgo} - ${riesgo.nombre_riesgo}</span>
                <p>Severidad: ${riesgo.nivel_severidad}</p>
            </div>
        `).join('');

        const recsHTML = hallazgo.recomendaciones.map(rec =>
            `<li>${rec}</li>`
        ).join('');

        // Map severidad to CSS class
        const severityMap = {
            'Extrema': 'extreme',
            'Muy Alta': 'very-high',
            'Alta': 'high',
            'Media': 'medium',
            'Baja': 'low'
        };

        // Find highest severity from categorias_riesgo
        const maxSeverity = hallazgo.categorias_riesgo.reduce((max, riesgo) => {
            const severities = ['Baja', 'Media', 'Alta', 'Muy Alta', 'Extrema'];
            const current = severities.indexOf(riesgo.nivel_severidad);
            const maxIndex = severities.indexOf(max);
            return current > maxIndex ? riesgo.nivel_severidad : max;
        }, 'Baja');

        const severityClass = severityMap[maxSeverity] || 'medium';

        return `
            <div class="finding-card severity-${severityClass}">
                <div class="finding-header">
                    <div class="finding-title">
                        <span class="finding-id">${hallazgo.id_hallazgo}</span>
                        <h3>${hallazgo.dominio_regulatorio}</h3>
                    </div>
                    <div class="finding-meta">
                        <span class="severity-badge ${severityClass}">${maxSeverity}</span>
                        <span class="domain-badge">${hallazgo.tipo_hallazgo}</span>
                    </div>
                </div>

                <div class="finding-body">
                    <div class="finding-section">
                        <h4>Tipo de Hallazgo</h4>
                        <p>${hallazgo.tipo_hallazgo}</p>
                    </div>

                    <div class="finding-section">
                        <h4>Fragmento Original</h4>
                        <p class="source-quote">${hallazgo.fragmento_original}</p>
                        <p class="source-pages">${hallazgo.ubicacion_documento}</p>
                    </div>

                    <div class="finding-details">
                        <div class="finding-section">
                            <h4>Riesgos Identificados</h4>
                            <div class="risk-list">
                                ${risksHTML}
                            </div>
                        </div>

                        <div class="finding-section">
                            <h4>Análisis</h4>
                            <p>${hallazgo.analisis_relevancia}</p>
                        </div>

                        <div class="finding-section recommendations">
                            <h4>Recomendaciones</h4>
                            <ul>
                                ${recsHTML}
                            </ul>
                        </div>
                    </div>
                </div>

                <button class="expand-btn" onclick="toggleFinding(this)">
                    <span>Ver más detalles</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');

    findingsContainer.innerHTML = findingsHTML;

    // Re-observe finding cards for animation
    findingsContainer.querySelectorAll('.finding-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .finding-card, .risk-category-card, .methodology-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// ===========================
// Active Navigation Link
// ===========================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ===========================
// Stats Counter Animation
// ===========================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.textContent);
            
            // Only animate if it's a number
            if (!isNaN(target) && target < 1000) {
                number.textContent = '0';
                animateCounter(number, target);
                entry.target.dataset.animated = 'true';
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===========================
// Keyboard Accessibility
// ===========================
document.addEventListener('keydown', (e) => {
    // Close expanded findings with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.finding-card.expanded').forEach(card => {
            card.classList.remove('expanded');
            const button = card.querySelector('.expand-btn span');
            if (button) {
                button.textContent = 'Ver más detalles';
            }
        });
    }
});

// ===========================
// Copy Link Functionality
// ===========================
function copyLink(findingId) {
    const url = `${window.location.origin}${window.location.pathname}#finding-${findingId}`;
    
    navigator.clipboard.writeText(url).then(() => {
        // Show temporary notification
        const notification = document.createElement('div');
        notification.textContent = '✓ Enlace copiado';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Error copying link:', err);
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Search Functionality (Future Enhancement)
// ===========================
function initializeSearch() {
    // Placeholder for future search functionality
    // This would allow users to search through findings
    console.log('Search functionality ready for implementation');
}

// ===========================
// Export/Print Functionality
// ===========================
function printReport() {
    // Expand all findings before printing
    document.querySelectorAll('.finding-card').forEach(card => {
        card.classList.add('expanded');
    });
    
    window.print();
}

// Add keyboard shortcut for printing (Ctrl+P)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printReport();
    }
});

// ===========================
// Responsive Menu Toggle (for mobile)
// ===========================
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('show');
}

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('mainNav');
            if (nav.classList.contains('show')) {
                nav.classList.remove('show');
            }
        });
    });
});

// ===========================
// Initialize Everything
// ===========================
// Log initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('🔍 VIGÍA - Sistema Inicializado');

    // Add any initialization code here
    initializeSearch();

    // Load default analysis (Nov 3, 2025) if on analysis page
    const findingsContainer = document.getElementById('findings');
    if (findingsContainer) {
        // Trigger load of default date
        loadAnalysisOnInit('2025-11-03');
    }
}

// Load analysis without event (for initialization)
async function loadAnalysisOnInit(dateString) {
    const lang = document.documentElement.lang || 'es';
    // Use absolute path from root for GitHub Pages compatibility
    const baseUrl = window.location.pathname.includes('vigia-webpage')
        ? '/vigia-webpage/'
        : '/';
    const dataUrl = `${baseUrl}data/${dateString}-${lang}.json`;

    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error('Data not found');

        const data = await response.json();

        // Render the data with original JSON structure based on language
        if (lang === 'en') {
            renderDashboardEN(data.general_analysis);
            renderSynthesisEN(data.executive_summary, data.document_metadata);
            renderContextoMexicanoEN(data.mexican_context);
            renderFindingsEN(data.ai_findings);
            console.log(`✓ Loaded analysis for ${dateString}`);
            console.log(`📋 ${data.ai_findings.length} findings loaded`);
        } else {
            renderDashboard(data.analisis_general);
            renderSynthesis(data.sintesis_ejecutiva, data.metadata_documento);
            renderContextoMexicano(data.contexto_mexicano);
            renderFindings(data.hallazgos_ai);
            console.log(`✓ Loaded analysis for ${dateString}`);
            console.log(`📋 ${data.hallazgos_ai.length} hallazgos cargados`);
        }
    } catch (error) {
        console.error('Error loading analysis:', error);
    }
}

// ===========================
// Performance Monitoring
// ===========================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// ===========================
// Error Handling
// ===========================
window.addEventListener('error', (e) => {
    console.error('Error en la página:', e.error);
});

// ===========================
// Service Worker Registration (Future Enhancement)
// ===========================
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is implemented
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registrado'))
    //     .catch(err => console.error('Error registrando Service Worker:', err));
}
