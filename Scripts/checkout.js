document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    document.getElementById('checkout-container').innerHTML = 
      '<div class="error">No event selected. <a href="./tickets.html">Return to tickets</a></div>';
    return;
  }
  
  fetchEventForCheckout(eventId);
});

async function fetchEventForCheckout(eventId) {
  try {
    const response = await fetch(`../Scripts/fetch_events.php?id=${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const eventData = await response.json();
    
    if (eventData.error) {
      document.getElementById('checkout-container').innerHTML = 
        `<div class="error">${eventData.error}. <a href="./tickets.html">Return to tickets</a></div>`;
      return;
    }
    
    displayCheckoutForm(eventData);
    
    await autoFillUserInfo();
    
  } catch (error) {
    console.error('Failed to fetch event details:', error);
    document.getElementById('checkout-container').innerHTML = 
      '<div class="error">Failed to load checkout. <a href="./tickets.html">Return to tickets</a></div>';
  }
}

async function autoFillUserInfo() {
  try {
    const response = await fetch('../Scripts/get_user_info.php');
    const data = await response.json();
    
    if (data.logged_in) {
      const nameField = document.getElementById('customer-name');
      const emailField = document.getElementById('customer-email');
      const phoneField = document.getElementById('customer-phone');
      
      if (nameField) nameField.value = data.user.full_name || '';
      if (emailField) emailField.value = data.user.email || '';
      if (phoneField) phoneField.value = data.user.phone_number || '';
      
      const form = document.getElementById('checkout-form');
      if (form) {
        const message = document.createElement('div');
        message.style.background = '#d4edda';
        message.style.color = '#155724';
        message.style.padding = '10px';
        message.style.borderRadius = '5px';
        message.style.marginBottom = '20px';
        message.style.border = '1px solid #c3e6cb';
        message.innerHTML = '✅ Your information has been auto-filled from your account';
        
        const infoHeading = form.querySelector('h2');
        if (infoHeading) {
          infoHeading.insertAdjacentElement('afterend', message);
        }
      }
    }
  } catch (error) {
    console.log('User not logged in or error checking login status');
  }
}

function displayCheckoutForm(event) {
  const container = document.getElementById('checkout-container');
  
  container.innerHTML = `
    <div class="checkout-wrapper">
      <h1>Complete Your Purchase</h1>
      
      <div class="event-summary">
        <h2>Event Details</h2>
        <div class="summary-item">
          <strong>Event:</strong> ${event.title}
        </div>
        <div class="summary-item">
          <strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}
        </div>
        <div class="summary-item">
          <strong>Location:</strong> ${event.location}
        </div>
        <div class="summary-item">
          <strong>Price:</strong> ${event.price} Ron
        </div>
      </div>
      
      <form id="checkout-form">
        <h2>Your Information</h2>
        
        <div class="form-group">
          <label for="customer-name">Full Name *</label>
          <input type="text" id="customer-name" name="customer_name" required>
        </div>
        
        <div class="form-group">
          <label for="customer-email">Email Address *</label>
          <input type="email" id="customer-email" name="customer_email" required>
        </div>
        
        <div class="form-group">
          <label for="customer-phone">Phone Number</label>
          <input type="tel" id="customer-phone" name="customer_phone">
        </div>
        
        <div class="payment-section">
          <h2>Payment Information</h2>
          <div class="demo-notice">
            <p>Debit/Credit Card</p>
            <p>Click "Complete Purchase" to buy a ticket.</p>
          </div>
        </div>
        
        <input type="hidden" name="event_id" value="${event.id}">
        
        <button type="submit" class="purchase-btn">Complete Purchase - ${event.price} Ron</button>
      </form>
      
      <div class="back-link">
        <a href="./event-detail.html?id=${event.id}">← Back to event</a>
      </div>
    </div>
  `;
  
  document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('.purchase-btn');
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('../Scripts/process_purchase.php', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      window.location.href = `confirmation.html?ticket=${result.ticket_code}`;
    } else {
      alert('Error: ' + result.error);
      submitButton.disabled = false;
      submitButton.textContent = 'Complete Purchase - ' + formData.get('event_price') + ' Ron';
    }
    
  } catch (error) {
    console.error('Purchase failed:', error);
    alert('Failed to process purchase. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Complete Purchase';
  }
}