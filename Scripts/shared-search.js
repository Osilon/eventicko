function initializeSearch() {
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
      
      const searchPath = getSearchResultsPath();
      window.location.href = `${searchPath}?${params.toString()}`;
    }
  }

  function getSearchResultsPath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/Pages/')) {
      return './search-results.html';
    }
    else {
      return 'Pages/search-results.html';
    }
  }

  searchButton.addEventListener('click', performSearch);

  [eventInput, locationInput].forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  });
}

initializeSearch();