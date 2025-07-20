document.addEventListener('DOMContentLoaded', function() {
  const containerWrapper1 = document.getElementById('container-wrapper');
  const containerWrapper2 = document.getElementById('container-wrapper2');
  const categoryButtons = document.querySelectorAll('.category-button');

  const popularEvents = [
    { imageUrl: "https://placehold.co/236x177/ff5733/ffffff?text=Concert+Night", description: "An electrifying night of live music." },
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Tech+Summit", description: "Innovate and connect at the annual Tech Summit." },
    { imageUrl: "https://placehold.co/236x177/3357ff/ffffff?text=Art+Exhibition", description: "Discover captivating works from emerging artists." },
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Food+Festival", description: "A culinary journey with flavors from around the world." },
    { imageUrl: "https://placehold.co/236x177/a133ff/ffffff?text=Sports+Match", description: "Feel the excitement of a live sports showdown." },
    { imageUrl: "https://placehold.co/236x177/ffb833/ffffff?text=Comedy+Show", description: "Laugh until your sides hurt with top comedians." }
  ];

  const categoryEvents = [
    { imageUrl: "https://placehold.co/236x177/80ff80/ffffff?text=Workshop", category: "workshop", description: "Hands-on learning session." },
    { imageUrl: "https://placehold.co/236x177/ff8080/ffffff?text=Theater", category: "performing", description: "Dramatic performances and captivating storytelling." },
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Outdoor", category: "sports", description: "Adventure in the great outdoors." },
    { imageUrl: "https://placehold.co/236x177/a133ff/ffffff?text=Nightclub", category: "nightlife", description: "Dance the night away with amazing DJs." },
    { imageUrl: "https://placehold.co/236x177/ff5733/ffffff?text=Jazz+Night", category: "music", description: "Smooth jazz melodies for a relaxed evening." },
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Startup+Pitch", category: "business", description: "Witness the next big ideas from innovative startups." },
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Sculpture+Show", category: "visuals", description: "An exhibition of intricate sculptures." },
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Concert", category: "music", description: "Rock out to your favorite band." },
    { imageUrl: "https://placehold.co/236x177/ffb833/ffffff?text=Basketball+Game", category: "sports", description: "Catch an exciting basketball match." }
  ];

  function generateCardHtml(event) {
    const eventDescription = event.description || '';
    const dataCategoryAttribute = event.category ? `data-category="${event.category}"` : '';
    return `
      <div class="container" ${dataCategoryAttribute}>
        <div class="main">
          <img src="${event.imageUrl}" alt="Event Image"/>
          <div class="card-description">${eventDescription}</div>
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
    });
  });

  filterCards('all');
});