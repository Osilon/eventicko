document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('query') || '';
  const searchLocation = urlParams.get('location') || '';
  
  // Populate search inputs with current search terms
  document.getElementById('search-event-input').value = searchQuery;
  document.getElementById('search-location-input').value = searchLocation;
  
  // Perform search
  performSearch(searchQuery, searchLocation);
  
  // Add event listeners for new search
  setupSearchListeners();
});

function setupSearchListeners() {
  const searchButton = document.getElementById('search-button');
  const eventInput = document.getElementById('search-event-input');
  const locationInput = document.getElementById('search-location-input');
  
  // Search button click
  searchButton.addEventListener('click', function() {
    const query = eventInput.value.trim();
    const location = locationInput.value.trim();
    
    if (query || location) {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (location) params.set('location', location);
      
      window.location.href = `./search-results.html?${params.toString()}`;
    }
  });
  
  // Enter key support
  [eventInput, locationInput].forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });
  });
}

async function performSearch(query, location) {
  try {
    updateSearchInfo(query, location, 'loading');
    
    const response = await fetch('../Scripts/search_events.php?' + new URLSearchParams({
      query: query,
      location: location
    }));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const searchResults = await response.json();
    
    if (searchResults.error) {
      displayError(searchResults.error);
      return;
    }
    
    displaySearchResults(searchResults, query, location);
    updateSearchInfo(query, location, searchResults.length);
    
  } catch (error) {
    console.error('Search failed:', error);
    displayError('Failed to perform search. Please try again later.');
  }
}

function updateSearchInfo(query, location, resultsCount) {
  const searchTitle = document.getElementById('search-title');
  const searchInfo = document.getElementById('search-info');
  
  if (resultsCount === 'loading') {
    searchTitle.textContent = 'Searching...';
    searchInfo.innerHTML = '';
    return;
  }
  
  // Build search description
  let searchDescription = 'Search results';
  let searchTerms = [];
  
  if (query) {
    searchTerms.push(`<span class="search-query">"${query}"</span>`);
  }
  
  if (location) {
    searchTerms.push(`in <span class="search-query">${location}</span>`);
  }
  
  if (searchTerms.length > 0) {
    searchDescription += ' for ' + searchTerms.join(' ');
  }
  
  searchTitle.textContent = 'Search Results';
  searchInfo.innerHTML = `
    ${searchDescription}<br>
    <span class="results-count">${resultsCount} event${resultsCount !== 1 ? 's' : ''} found</span>
  `;
  
  // Update page title
  let titleParts = ['Search Results'];
  if (query) titleParts.push(query);
  if (location) titleParts.push(location);
  document.title = titleParts.join(' - ') + ' - Eventicko';
}

function displaySearchResults(events, query, location) {
  const resultsWrapper = document.getElementById('search-results-wrapper');
  
  if (events.length === 0) {
    resultsWrapper.innerHTML = `
      <div class="no-results">
        <h3>No events found</h3>
        <p>We couldn't find any events matching your search criteria.</p>
        <p>Try adjusting your search terms or browse all events.</p>
        <a href="../index.html" class="back-home-btn">← Back to Home</a>
      </div>
    `;
    return;
  }
  
  const eventCards = events.map(event => generateEventCard(event)).join('');
  resultsWrapper.innerHTML = eventCards;
}

function generateEventCard(event) {
  return `
    <div class="container" onclick="window.location.href='./event-detail.html?id=${event.id}'" style="cursor: pointer;">
      <div class="upper-part">
        <img src="${event.imageUrl}" alt="${event.title}" onerror="this.src='../Assets/placeholder-image.jpg'"/>
      </div>
      <div class="lower-part">
        <div class="price">${event.price} Ron</div>
        <div class="buy-now">Open Event →</div>
      </div>
    </div>
  `;
}

function displayError(message) {
  const resultsWrapper = document.getElementById('search-results-wrapper');
  resultsWrapper.innerHTML = `
    <div class="error-message">
      <h3>Search Error</h3>
      <p>${message}</p>
      <a href="../index.html" class="back-home-btn">← Back to Home</a>
    </div>
  `;
}