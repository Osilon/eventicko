document.addEventListener('DOMContentLoaded', () => {
  const cardsWrapper = document.getElementById('blog-cards-wrapper');

  function generateBlogPostCardHtml(post) {
    const title = post.title || 'Untitled Blog Post';
    const shortContent = post.short_content || 'No brief description available.';
    const imageUrl = post.image_url || 'https://via.placeholder.com/256x256?text=No+Image';
    const author = post.author ? `By ${post.author}` : 'Unknown Author';
    const publishDate = post.publish_date ? new Date(post.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

    return `
      <div class="card-container">
        <div class="image-placeholder">
          <img src="${imageUrl}" alt="${title} Image"/>
        </div>
        <div class="content-area">
          <h3>${title}</h3>
          <p class="author-date">${author}${publishDate ? ` - ${publishDate}` : ''}</p>
          <p class="text-content">
            ${shortContent}
          </p>
        </div>
      </div>
    `;
  }

  async function fetchAndRenderBlogPosts() {
    if (cardsWrapper) {
      cardsWrapper.innerHTML = '<p>Loading blog posts...</p>';
    } else {
      console.error("Error: 'blog-cards-wrapper' element not found in blog.html.");
      return;
    }

    try {
      const response = await fetch('../Scripts/fetch_blogs.php'); // This now fetches ALL content for ALL posts

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("PHP Error:", data.error);
        cardsWrapper.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
        return;
      }

      // *** IMPORTANT CHANGE: Store the entire data array in localStorage ***
      localStorage.setItem('allBlogPosts', JSON.stringify(data));

      cardsWrapper.innerHTML = ''; // Clear loading message

      if (data.length === 0) {
        cardsWrapper.innerHTML = '<p>No blog posts found at the moment.</p>';
        return;
      }

      data.forEach(post => {
        cardsWrapper.innerHTML += generateBlogPostCardHtml(post);
      });

    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      cardsWrapper.innerHTML = '<p>Could not load blog posts. Please ensure XAMPP is running, the database is configured correctly, and `fetch_blogs.php` path is accurate.</p>';
    }
  }

  fetchAndRenderBlogPosts();
});