document.addEventListener('DOMContentLoaded', function() {
  const containerWrapper1 = document.getElementById('container-wrapper');
  const containerWrapper2 = document.getElementById('container-wrapper2');
  const categoryButtons = document.querySelectorAll('.category-button');

  const popularEvents = [
    { imageUrl: "https://placehold.co/236x177/ff5733/ffffff?text=Concert+Night"},
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Tech+Summit"},
    { imageUrl: "https://placehold.co/236x177/3357ff/ffffff?text=Art+Exhibition"},
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Food+Festival"},
    { imageUrl: "https://placehold.co/236x177/a133ff/ffffff?text=Sports+Match"},
    { imageUrl: "https://placehold.co/236x177/ffb833/ffffff?text=Comedy+Show"}
  ];

  const categoryEvents = [
    { imageUrl: "https://placehold.co/236x177/80ff80/ffffff?text=Workshop", category: "workshop"},
    { imageUrl: "https://placehold.co/236x177/ff8080/ffffff?text=Theater", category: "performing"},
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Outdoor", category: "sports"},
    { imageUrl: "https://placehold.co/236x177/a133ff/ffffff?text=Nightclub", category: "nightlife"},
    { imageUrl: "https://placehold.co/236x177/ff5733/ffffff?text=Jazz+Night", category: "music"},
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Startup+Pitch", category: "business"},
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Sculpture+Show", category: "visuals"},
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Concert", category: "music"},
    { imageUrl: "https://placehold.co/236x177/ffb833/ffffff?text=Basketball+Game", category: "sports"}
  ];

  function generateCardHtml(event) {
    const dataCategoryAttribute = event.category ? `data-category="${event.category}"` : '';
    return `
      <div class="container" ${dataCategoryAttribute}>
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
      eventsSubset.forEach(event => {
        wrapperElement.innerHTML += generateCardHtml(event);
      });
    } else {
      console.error('Wrapper element not found. Check your HTML IDs.');
    }
  }

  populateWrapper(containerWrapper1, popularEvents);
  populateWrapper(containerWrapper2, categoryEvents);

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
      document.querySelector('.category-button[data-category="all"]').classList.add('active');
    }
  } else {
    filterCards('all');
    document.querySelector('.category-button[data-category="all"]').classList.add('active');
  }
});