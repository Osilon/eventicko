document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketCode = urlParams.get('ticket');
  
  if (!ticketCode) {
    document.getElementById('confirmation-container').innerHTML = 
      '<div class="error">No ticket found. <a href="./tickets.html">Browse events</a></div>';
    return;
  }
  
  fetchTicketDetails(ticketCode);
});

async function fetchTicketDetails(ticketCode) {
  try {
    const response = await fetch(`../Scripts/fetch_ticket.php?code=${ticketCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const ticketData = await response.json();
    
    if (ticketData.error) {
      document.getElementById('confirmation-container').innerHTML = 
        `<div class="error">${ticketData.error}. <a href="./tickets.html">Browse events</a></div>`;
      return;
    }
    
    displayConfirmation(ticketData);
    
  } catch (error) {
    console.error('Failed to fetch ticket details:', error);
    document.getElementById('confirmation-container').innerHTML = 
      '<div class="error">Failed to load ticket. <a href="./tickets.html">Browse events</a></div>';
  }
}

function displayConfirmation(ticket) {
  const container = document.getElementById('confirmation-container');
  
  container.innerHTML = `
    <div class="confirmation-wrapper">
      <div class="success-icon">✅</div>
      <h1>Purchase Successful!</h1>
      <p class="success-message">Your ticket has been confirmed. Check your email for details.</p>
      
      <div class="ticket-display">
        <h2>Your Ticket</h2>
        <div class="ticket-code-box">
          <div class="code-label">Ticket Code</div>
          <div class="code-value">${ticket.ticket_code}</div>
        </div>
        
        <div class="ticket-details">
          <div class="detail-row">
            <strong>Event:</strong>
            <span>${ticket.event_title}</span>
          </div>
          <div class="detail-row">
            <strong>Date & Time:</strong>
            <span>${new Date(ticket.event_date).toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <strong>Location:</strong>
            <span>${ticket.event_location}</span>
          </div>
          <div class="detail-row">
            <strong>Ticket Holder:</strong>
            <span>${ticket.customer_name}</span>
          </div>
          <div class="detail-row">
            <strong>Email:</strong>
            <span>${ticket.customer_email}</span>
          </div>
        </div>
        
        <div class="qr-placeholder">
          <p>QR Code</p>
          <div class="qr-box">[QR Code]</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button onclick="window.print()" class="print-btn">Print Ticket</button>
        <a href="./tickets.html" class="browse-btn">Browse More Events</a>
      </div>
    </div>
  `;
}