document.addEventListener('DOMContentLoaded', function() {
  const containerWrapper1 = document.getElementById('container-wrapper');
  const containerWrapper2 = document.getElementById('container-wrapper2');
  const categoryButtons = document.querySelectorAll('.category-button');

  let allEvents = [];

  function generateCardHtml(event) {
    const dataCategoryAttribute = event.category ? `data-category="${event.category}"` : '';
    return `
      <div class="container" ${dataCategoryAttribute} onclick="window.location.href='event-detail.html?id=${event.id}'" style="cursor: pointer;">
        <div class="upper-part">
          <img src="${event.imageUrl}" alt="Event Image"/>
        </div>
        <div class="lower-part">
          <div class="price">${event.price} Ron</div>
          <div class="buy-now">Open Event →</div>
        </div>
      </div>
    `;
  }

  function populateWrapper(wrapperElement, eventsSubset) {
    if (wrapperElement) {
      wrapperElement.innerHTML = '';
      if (eventsSubset.length === 0) {
        wrapperElement.innerHTML = '<p>No events found in this section.</p>';
        return;
      }
      eventsSubset.forEach(event => {
        wrapperElement.innerHTML += generateCardHtml(event);
      });
    } else {
      console.error('Wrapper element not found. Check your HTML IDs.');
    }
  }

  function filterCards(selectedCategory) {
    if (!containerWrapper2) {
      console.error('containerWrapper2 not found for filtering.');
      return;
    }
    const cardsToFilter = containerWrapper2.querySelectorAll('.container');

    cardsToFilter.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  async function fetchAndRenderEvents() {
    try {
      const response = await fetch('../Scripts/fetch_events.php');

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("PHP Error:", data.error);
        if (containerWrapper1) containerWrapper1.innerHTML = '<p>Error loading events. Please try again later.</p>';
        if (containerWrapper2) containerWrapper2.innerHTML = '<p>Error loading events. Please try again later.</p>';
        return;
      }

      allEvents = data;

      const popularEvents = allEvents.filter(event => event.is_popular == 1);

      const categoryEvents = allEvents;

      populateWrapper(containerWrapper1, popularEvents);
      populateWrapper(containerWrapper2, categoryEvents);

      const urlParams = new URLSearchParams(window.location.search);
      const categoryFromUrl = urlParams.get('category');

      if (categoryFromUrl) {
        const targetButton = document.querySelector(`.category-button[data-category="${categoryFromUrl}"]`);
        if (targetButton) {
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          targetButton.classList.add('active');
          filterCards(categoryFromUrl);
          if (containerWrapper2) {
            containerWrapper2.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          filterCards('all');
          const allButton = document.querySelector('.category-button[data-category="all"]');
          if(allButton) allButton.classList.add('active');
        }
      } else {
        filterCards('all');
        const allButton = document.querySelector('.category-button[data-category="all"]');
        if(allButton) allButton.classList.add('active');
      }

    } catch (error) {
      console.error('Failed to fetch events:', error);
      const errorMessage = '<p>Could not load events. Please ensure XAMPP is running and try refreshing the page.</p>';
      if (containerWrapper1) containerWrapper1.innerHTML = errorMessage;
      if (containerWrapper2) containerWrapper2.innerHTML = errorMessage;
    }
  }

  fetchAndRenderEvents();

  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category');
      filterCards(category);
      if (containerWrapper2) {
        containerWrapper2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});