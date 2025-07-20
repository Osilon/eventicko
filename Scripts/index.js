document.addEventListener('DOMContentLoaded', () => {
  const containWrapper = document.getElementById('container-wrapper');

  const events = [
    { imageUrl: "https://placehold.co/236x177/ff5733/ffffff?text=Concert"},
    { imageUrl: "https://placehold.co/236x177/33ff57/ffffff?text=Tech+Summit"},
    { imageUrl: "https://placehold.co/236x177/3357ff/ffffff?text=Football+Match"},
    { imageUrl: "https://placehold.co/236x177/ff33a1/ffffff?text=Food+Festival"},
    { imageUrl: "https://placehold.co/236x177/a133ff/ffffff?text=Sports+Match"},
    { imageUrl: "https://placehold.co/236x177/ffb833/ffffff?text=Comedy+Show"}
  ];

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
    if (wrapperElement) { // Check if the element was found
      wrapperElement.innerHTML = '';
      eventsSubset.forEach(event => {
        wrapperElement.innerHTML += generateCardHtml(event);
      });
    } else {
      console.error("Error: 'container-wrapper' element not found.");
    }
  }

  populateWrapper(containWrapper, events);
});