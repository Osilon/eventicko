// shared-search.js - Include this file in all pages that need search functionality

function initializeSearch() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSearch);
  } else {
    setupSearch();
  }
}

function setupSearch() {
  const searchButton = document.querySelector('.search-bar button');
  const eventInput = document.querySelector('.search-bar .event');
  const locationInput = document.querySelector('.search-bar .location');

  // Check if search elements exist on this page
  if (!searchButton || !eventInput || !locationInput) {
    console.log('Search elements not found on this page');
    return;
  }

  function performSearch() {
    const query = eventInput.value.trim();
    const location = locationInput.value.trim();
    
    if (query || location) {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (location) params.set('location', location);
      
      // Determine the correct path based on current page location
      const searchPath = getSearchResultsPath();
      window.location.href = `${searchPath}?${params.toString()}`;
    }
  }

  function getSearchResultsPath() {
    const currentPath = window.location.pathname;
    
    // If we're already in the Pages directory
    if (currentPath.includes('/Pages/')) {
      return './search-results.html';
    }
    // If we're in the root directory (index.html)
    else {
      return 'Pages/search-results.html';
    }
  }

  // Search button click
  searchButton.addEventListener('click', performSearch);

  // Enter key support
  [eventInput, locationInput].forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  });
}

// Auto-initialize when script loads
initializeSearch();