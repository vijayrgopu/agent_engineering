/**
 * GCP TechCon 2026 - Main JavaScript
 * Handles real-time search, category filtering, detail modal, and UI state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const categoryButtons = document.querySelectorAll('.filter-btn');
    const talkCards = document.querySelectorAll('.talk-card');
    const noResultsState = document.getElementById('noResultsState');
    const resultsCount = document.getElementById('resultsCount');
    const activeFilterBadge = document.getElementById('activeFilterBadge');
    const speakerCards = document.querySelectorAll('.speaker-card');

    let currentCategory = 'all';
    let currentQuery = '';

    // Initialize Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.trim().toLowerCase();
            toggleClearButton();
            applyFilters();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentQuery = '';
            toggleClearButton();
            applyFilters();
            searchInput.focus();
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.getAttribute('data-category');
            applyFilters();
        });
    });

    function toggleClearButton() {
        if (currentQuery.length > 0) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
    }

    /**
     * Apply active category filter and search query to talk cards and speaker cards
     */
    function applyFilters() {
        let visibleCount = 0;

        talkCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardSearchData = card.getAttribute('data-search').toLowerCase();

            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);
            const matchesQuery = !currentQuery || cardSearchData.includes(currentQuery);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'grid';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Filter Speaker Cards as well
        speakerCards.forEach(card => {
            const speakerData = card.getAttribute('data-speaker-search').toLowerCase();
            const matchesQuery = !currentQuery || speakerData.includes(currentQuery);
            if (matchesQuery) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Update Results Summary Text
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} of ${talkCards.length} technical sessions`;
        }

        // Toggle Active Filter Badge
        if (activeFilterBadge) {
            if (currentCategory !== 'all' || currentQuery !== '') {
                activeFilterBadge.style.display = 'inline-block';
                let filterText = '';
                if (currentCategory === '1') filterText += 'Category 1: AI & ML';
                if (currentCategory === '2') filterText += 'Category 2: Infra & DevOps';
                if (currentQuery) {
                    if (filterText) filterText += ' | ';
                    filterText += `Search: "${currentQuery}"`;
                }
                activeFilterBadge.textContent = filterText;
            } else {
                activeFilterBadge.style.display = 'none';
            }
        }

        // Toggle No Results State
        if (noResultsState) {
            if (visibleCount === 0) {
                noResultsState.style.display = 'block';
            } else {
                noResultsState.style.display = 'none';
            }
        }
    }

    // Global reset function
    window.resetFilters = function() {
        if (searchInput) searchInput.value = '';
        currentQuery = '';
        currentCategory = 'all';
        toggleClearButton();
        
        categoryButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        applyFilters();
    };

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTalkModal();
        }
    });

    // Close modal on backdrop click
    const modalBackdrop = document.getElementById('talkModal');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeTalkModal();
            }
        });
    }
});

/**
 * Open Detailed Talk Modal using Flask REST API
 */
async function openTalkModal(talkId) {
    const modalBackdrop = document.getElementById('talkModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: #4285f4;"></i>
            <p style="margin-top: 1rem; color: #9ca3af;">Loading talk details...</p>
        </div>
    `;
    modalBackdrop.classList.add('active');

    try {
        const response = await fetch(`/api/talks/${talkId}`);
        const data = await response.json();

        if (data.status === 'success') {
            const talk = data.talk;
            
            const categoryTagClass = talk.category_id === 1 ? 'cat-1' : 'cat-2';
            const categoryIcon = talk.category_id === 1 ? 'fa-robot' : 'fa-server';

            let speakersHtml = talk.speakers.map(s => `
                <div class="speaker-chip" style="margin-top: 0.5rem;">
                    <img src="${s.avatar}" alt="${s.first_name} ${s.last_name}" class="speaker-img">
                    <div class="speaker-info">
                        <span class="speaker-name">${s.first_name} ${s.last_name}</span>
                        <span class="speaker-role">${s.role} @ ${s.company}</span>
                    </div>
                    <a href="${s.linkedin}" target="_blank" class="linkedin-link" title="LinkedIn Profile">
                        <i class="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            `).join('');

            modalContent.innerHTML = `
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <span class="cat-pill ${categoryTagClass}">
                        <i class="fa-solid ${categoryIcon}"></i> Category ${talk.category_id}: ${talk.category}
                    </span>
                </div>
                <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">${talk.title}</h2>
                <div style="display: flex; gap: 1.5rem; color: #9ca3af; font-size: 0.9rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem;">
                    <span><i class="fa-regular fa-clock" style="color: #4285f4;"></i> ${talk.time}</span>
                    <span><i class="fa-solid fa-door-open" style="color: #34a853;"></i> ${talk.room}</span>
                </div>
                <h4 style="font-size: 1rem; color: #60a5fa; margin-bottom: 0.5rem;">Session Abstract</h4>
                <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 1.75rem;">${talk.description}</p>
                <h4 style="font-size: 1rem; color: #60a5fa; margin-bottom: 0.75rem;">Featured Speaker(s)</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${speakersHtml}
                </div>
            `;
        }
    } catch (err) {
        modalContent.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 2rem;">
                <p>Failed to load talk details. Please try again.</p>
            </div>
        `;
    }
}

/**
 * Close Detailed Talk Modal
 */
function closeTalkModal() {
    const modalBackdrop = document.getElementById('talkModal');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
    }
}
