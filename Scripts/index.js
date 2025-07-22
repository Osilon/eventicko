document.addEventListener('DOMContentLoaded', () => {
  const containWrapper = document.getElementById('container-wrapper');
  const homeCategoryButtons = document.querySelectorAll('.categories .category-button');

  function generateCardHtml(event) {
    return `
      <div class="container" onclick="window.location.href='Pages/event-detail.html?id=${event.id}'" style="cursor: pointer;">
        <div class="upper-part">
          <img src="${event.imageUrl}" alt="Event Image"/>
        </div>
        <div class="lower-part">
          <div class="price">${event.price} Ron</div>
          <div class="buy-now">Open Event</div>
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