document.addEventListener('DOMContentLoaded', () => {
  const containWrapper = document.getElementById('container-wrapper');
  const homeCategoryButtons = document.querySelectorAll('.categories .category-button');

  function generateCardHtml(event) {
    return `
      <div class="container">
          <div class="main">
            <img src="${event.imageUrl}" alt="Event Image"/>
          </div>
          <div class="divider-cont"></div>
          <div class="side-panel">
              <i class="fa-heart"><img src="https://cdn-icons-png.flaticon.com/512/151/151910.png" alt="heart-icon" width="30" height="30"></i>
              <i class="fa-bookmark"><img src="https://cdn-icons-png.flaticon.com/512/25/25667.png" alt="bookmark-icon" width="30" height="30"></i>
              <i class="fa-share-alt"><img src="https://cdn-icons-png.flaticon.com/512/1358/1358023.png" alt="share-icon" width="30" height="30"></i>
          </div>
      </div>
    `;
  }

  function populateWrapper(wrapperElement, eventsSubset) {
    if (wrapperElement) {
      wrapperElement.innerHTML = '';
      if (eventsSubset.length === 0) {
          wrapperElement.innerHTML = '<p>No events found in Galați.</p>';
          return;
      }
      eventsSubset.forEach(event => {
        wrapperElement.innerHTML += generateCardHtml(event);
      });
    } else {
      console.error("Error: 'container-wrapper' element not found.");
    }
  }

  async function fetchAndRenderLocalEvents() {
    try {
      const response = await fetch('./Scripts/fetch_events.php');

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allEventsData = await response.json(); // Get all events

      if (allEventsData.error) {
        console.error("PHP Error:", allEventsData.error);
        if (containWrapper) containWrapper.innerHTML = '<p>Error loading events. Please try again later.</p>';
        return;
      }

      const galatiEvents = allEventsData.filter(event => event.location === 'Galati');

      populateWrapper(containWrapper, galatiEvents);

    } catch (error) {
      console.error('Failed to fetch events:', error);
      const errorMessage = '<p>Could not load events. Please ensure XAMPP is running and try refreshing the page.</p>';
      if (containWrapper) containWrapper.innerHTML = errorMessage;
    }
  }

  fetchAndRenderLocalEvents();

  // Event listeners for category buttons (unchanged)
  homeCategoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      window.location.href = `Pages/tickets.html?category=${category}`;
    });
  });
});