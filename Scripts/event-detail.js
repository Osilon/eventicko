document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    document.getElementById('event-container').innerHTML = 
      '<div class="error">No event ID specified. <a href="./tickets.html">Return to tickets</a></div>';
    return;
  }
  
  fetchEventDetails(eventId);
});

async function fetchEventDetails(eventId) {
  try {
    const response = await fetch(`../Scripts/fetch_events.php?id=${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const eventData = await response.json();
    
    if (eventData.error) {
      document.getElementById('event-container').innerHTML = 
        `<div class="error">${eventData.error}. <a href="./tickets.html">Return to tickets</a></div>`;
      return;
    }
    
    displayEventDetails(eventData);
    
  } catch (error) {
    console.error('Failed to fetch event details:', error);
    document.getElementById('event-container').innerHTML = 
      '<div class="error">Failed to load event details. <a href="./tickets.html">Return to tickets</a></div>';
  }
}

function displayEventDetails(event) {
  const container = document.getElementById('event-container');
  
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  container.innerHTML = `
    <div class="event-detail-wrapper">
      <div class="event-image-section">
        <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
      </div>
      
      <div class="event-info-section">
        <h1 class="event-title">${event.title}</h1>
        <div class="event-category">${event.category.toUpperCase()}</div>
        
        <div class="event-description">
          <h3>About this event</h3>
          <p>${event.description}</p>
        </div>
        
        <div class="event-details">
          <div class="detail-item">
            <strong>📅 Date & Time:</strong>
            <span>${formattedDate}</span>
          </div>
          
          <div class="detail-item">
            <strong>📍 Location:</strong>
            <span>${event.location}</span>
          </div>
          
          <div class="detail-item">
            <strong>💰 Price:</strong>
            <span class="price">${event.price} Ron</span>
          </div>
          
          <div class="detail-item">
            <strong>🎫 Tickets Available:</strong>
            <span class="${event.stock < 10 ? 'low-stock' : ''}">${event.stock} left</span>
          </div>
        </div>
        
        <div class="ticket-purchase-section">
          <div class="price-display">
            Price: ${event.price} Ron
          </div>
          
          <button class="buy-ticket-btn" onclick="handleBuyTickets()">
            Buy Ticket
          </button>
        </div>
        
        <div class="back-link">
          <a href="./tickets.html">← Back to all events</a>
        </div>
      </div>
    </div>
  `;
}

function handleBuyTickets() {
  alert(`Purchase ticket - Feature coming soon!`);
}