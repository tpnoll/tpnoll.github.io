// State management
let allExperiences = [];
let filteredExperiences = [];
let activeClassFilters = new Set();
let activeTypeFilters = new Set();
let allExpanded = true;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadCSV();
    initializeFilters();
    renderExperiences();

    const toggleExpandAllButton = document.getElementById('toggleExpandAll');
    if (toggleExpandAllButton) {
        toggleExpandAllButton.addEventListener('click', () => {
            allExpanded = !allExpanded;
            toggleExpandAllButton.textContent = allExpanded ? 'Collapse All' : 'Expand All';
            renderExperiences();
        });
    }
});

// Load and parse CSV
async function loadCSV() {
    try {
        const response = await fetch('Vitae.csv');
        const csvText = await response.text();
        allExperiences = parseCSV(csvText);
        // Sort by start date, newest first
        allExperiences.sort((a, b) => new Date(b.start) - new Date(a.start));
        filteredExperiences = [...allExperiences];
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('experiences').innerHTML = '<div class="empty-state"><h2>Error loading experiences</h2></div>';
    }
}

// Parse CSV with proper handling of quoted fields
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = parseCSVLine(lines[0]);
    const experiences = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const experience = {};

        headers.forEach((header, index) => {
            experience[header.toLowerCase().replace(/-/g, '')] = values[index] || '';
        });

        if (experience.code) {
            experiences.push(experience);
        }
    }

    return experiences;
}

// Parse individual CSV line handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Initialize filter buttons
function initializeFilters() {
    const classes = new Set();
    const types = new Set();

    allExperiences.forEach(exp => {
        // Handle multiple classes separated by commas
        exp.class.split(',').forEach(c => {
            if (c.trim()) classes.add(c.trim());
        });
        if (exp.type) types.add(exp.type);
    });

    // Sort and create filter buttons
    const classContainer = document.getElementById('classFilters');
    const typeContainer = document.getElementById('typeFilters');

    Array.from(classes)
        .sort()
        .forEach(cls => {
            const btn = createFilterButton(cls, 'class');
            classContainer.appendChild(btn);
        });

    Array.from(types)
        .sort()
        .forEach(type => {
            const btn = createFilterButton(type, 'type');
            typeContainer.appendChild(btn);
        });
}

// Create filter button
function createFilterButton(label, filterType) {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = label;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        
        if (filterType === 'class') {
            if (btn.classList.contains('active')) {
                activeClassFilters.add(label);
            } else {
                activeClassFilters.delete(label);
            }
        } else {
            if (btn.classList.contains('active')) {
                activeTypeFilters.add(label);
            } else {
                activeTypeFilters.delete(label);
            }
        }

        applyFilters();
        renderExperiences();
    });

    return btn;
}

// Apply filters
function applyFilters() {
    filteredExperiences = allExperiences.filter(exp => {
        const expClasses = exp.class.split(',').map(c => c.trim());
        
        const classMatch = activeClassFilters.size === 0 || 
            expClasses.some(c => activeClassFilters.has(c));
        
        const typeMatch = activeTypeFilters.size === 0 || 
            activeTypeFilters.has(exp.type);

        return classMatch && typeMatch;
    });
}

// Clear filters
document.getElementById('clearFilters').addEventListener('click', () => {
    activeClassFilters.clear();
    activeTypeFilters.clear();
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    applyFilters();
    renderExperiences();
});

// Render experiences
function renderExperiences() {
    const container = document.getElementById('experiences');

    if (filteredExperiences.length === 0) {
        container.innerHTML = '<div class="empty-state"><h2>No experiences found</h2><p>Try adjusting your filters</p></div>';
        return;
    }

    container.innerHTML = filteredExperiences.map(exp => createExperienceHTML(exp)).join('');

    // Add event listeners to expand buttons
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('active');
            this.textContent = content.classList.contains('active') ? 'Collapse' : 'Expand';
            updateGlobalExpandButton();
        });
    });

    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(carousel => {
        initializeCarousel(carousel);
    });

    updateGlobalExpandButton();
}

// Create HTML for experience
function createExperienceHTML(exp) {
    const title = exp.title || exp.organization;
    const subtitle = exp.title ? exp.organization : '';
    const formattedDates = formatDates(exp.start, exp.end);
    const hasExpandable = exp.subdescription || hasPhotos(exp.code);

    let html = `
        <div class="experience-entry">
            <div class="experience-header">
                <div class="experience-title-section">
                    <div>
                        <div class="experience-title">${escapeHtml(title)}</div>
                        ${subtitle ? `<div class="experience-organization subtitle-org">${escapeHtml(subtitle)}</div>` : ''}
                    </div>
                    ${exp.links ? createLinkTokens(exp.links) : ''}
                </div>
            </div>
            <div class="experience-meta">
                <span class="experience-role">${escapeHtml(exp.role)}</span>
                <span class="experience-dates">${formattedDates}</span>
            </div>
            <div class="experience-description">${escapeHtml(exp.description)}</div>
    `;

    if (hasExpandable) {
        const expandedClass = allExpanded ? ' active' : '';
        const buttonLabel = allExpanded ? 'Collapse' : 'Expand';
        html += `
            <button class="expand-btn">${buttonLabel}</button>
            <div class="expand-content${expandedClass}">
        `;

        if (hasPhotos(exp.code)) {
            html += createCarouselHTML(exp.code);
        }

        if (exp.subdescription) {
            html += `<div class="sub-description">${escapeHtml(exp.subdescription)}</div>`;
        }

        html += `</div>`;
    }

    html += `
            <div class="tags">
                ${exp.class.split(',').map(c => `<span class="tag">${escapeHtml(c.trim())}</span>`).join('')}
                ${exp.type ? `<span class="tag">${escapeHtml(exp.type)}</span>` : ''}
            </div>
        </div>
    `;

    return html;
}

// Create link tokens
function createLinkTokens(linksString) {
    const links = linksString.split(',').map(l => l.trim()).filter(l => l);
    if (links.length === 0) return '';

    return links.map((link, index) => {
        const href = link.startsWith('http') ? link : `https://${link}`;
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="link-token" title="${escapeHtml(link)}">🔗</a>`;
    }).join('');
}

// Check if photos exist
function hasPhotos(code) {
    // We'll check dynamically by trying to load photos
    return true; // Optimistic - we'll handle missing photos in carousel
}

// Create carousel HTML
function createCarouselHTML(code) {
    return `
        <div class="carousel-container">
            <div class="carousel" data-code="${escapeHtml(code)}">
                <div class="carousel-image-label" id="label-${escapeHtml(code)}"></div>
                <div class="carousel-images" id="images-${escapeHtml(code)}"></div>
                <div class="carousel-controls">
                    <button class="carousel-btn" data-prev="${escapeHtml(code)}">←</button>
                    <span class="carousel-indicator" id="indicator-${escapeHtml(code)}"></span>
                    <button class="carousel-btn" data-next="${escapeHtml(code)}">→</button>
                </div>
            </div>
        </div>
    `;
}

// Initialize carousel
async function initializeCarousel(carousel) {
    const code = carousel.dataset.code;
    const imagesContainer = carousel.querySelector(`#images-${code}`);
    const labelContainer = carousel.querySelector(`#label-${code}`);
    const indicator = carousel.querySelector(`#indicator-${code}`);
    const prevBtn = carousel.querySelector(`[data-prev="${code}"]`);
    const nextBtn = carousel.querySelector(`[data-next="${code}"]`);

    try {
        // Load image list from resources directory
        const photos = await getPhotosForCode(code);
        
        if (photos.length === 0) {
            carousel.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        // Populate carousel images
        photos.forEach((photo, index) => {
            const div = document.createElement('div');
            div.className = 'carousel-image' + (index === 0 ? ' active' : '');
            div.innerHTML = `<img src="resources/${code}/${escapeHtml(photo.filename)}" alt="${escapeHtml(photo.label)}" loading="lazy">`;
            imagesContainer.appendChild(div);
        });

        const updateCarousel = () => {
            // Update images
            imagesContainer.querySelectorAll('.carousel-image').forEach((img, index) => {
                img.classList.toggle('active', index === currentIndex);
            });

            // Update label
            const currentPhoto = photos[currentIndex];
            labelContainer.textContent = currentPhoto.label || '';

            // Update indicator
            indicator.textContent = `${currentIndex + 1} / ${photos.length}`;

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === photos.length - 1;
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < photos.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        updateCarousel();
    } catch (error) {
        console.error(`Error loading carousel for ${code}:`, error);
        carousel.style.display = 'none';
    }
}

// Get photos for a code from manifest
async function getPhotosForCode(code) {
    try {
        const response = await fetch('photos-manifest.json');
        const photosMap = await response.json();
        return photosMap[code] || [];
    } catch (error) {
        console.error(`Error loading photos manifest:`, error);
        return [];
    }
}

// Update top button text after individual toggles
function updateGlobalExpandButton() {
    const toggleExpandAllButton = document.getElementById('toggleExpandAll');
    if (!toggleExpandAllButton) return;

    const allContents = Array.from(document.querySelectorAll('.expand-content'));
    if (allContents.length === 0) return;

    const anyHidden = allContents.some(content => !content.classList.contains('active'));
    allExpanded = !anyHidden;
    toggleExpandAllButton.textContent = allExpanded ? 'Collapse All' : 'Expand All';
}

// Format dates
function formatDates(startStr, endStr) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const start = formatDate(startStr);
    if (!endStr) {
        return `${start} - Present`;
    }
    const end = formatDate(endStr);
    return `${start} - ${end}`;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
