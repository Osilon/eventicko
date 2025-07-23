document.addEventListener('DOMContentLoaded', function() {
  fetchBlogs();
});

async function fetchBlogs() {
  try {
    const response = await fetch('../Scripts/fetch_blogs.php');
    const blogs = await response.json();
    
    if (blogs.error) {
      displayError(blogs.error);
      return;
    }
    
    displayBlogs(blogs);
    
  } catch (error) {
    console.error('Error fetching blogs:', error);
    displayError('Failed to load blog posts. Please try again later.');
  }
}

function displayBlogs(blogs) {
  const container = document.getElementById('blog-cards-wrapper');
  
  if (blogs.length === 0) {
    container.innerHTML = '<p>No blog posts available at the moment.</p>';
    return;
  }
  
  const blogCards = blogs.map(blog => {
    // Format the publish date
    const publishDate = new Date(blog.publish_date);
    const formattedDate = publishDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Truncate short_content if it's too long
    const shortContent = blog.short_content.length > 150 
      ? blog.short_content.substring(0, 150) + '...' 
      : blog.short_content;
    
    return `
      <div class="blog-card" onclick="navigateToBlog(${blog.id})" style="cursor: pointer;">
        <div class="blog-image-container">
          <img src="${blog.image_url}" alt="${blog.title}" class="blog-image" onerror="this.src='../Assets/placeholder-image.jpg'">
        </div>
        <div class="blog-content">
          <div class="blog-meta">
            <span class="blog-author">By ${blog.author}</span>
            <span class="blog-date">${formattedDate}</span>
          </div>
          <h3 class="blog-title">${blog.title}</h3>
          <p class="blog-excerpt">${shortContent}</p>
          <div class="blog-read-more">
            Read More →
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = blogCards;
}

function navigateToBlog(blogId) {
  window.location.href = `./blog-detail.html?id=${blogId}`;
}

function displayError(message) {
  const container = document.getElementById('blog-cards-wrapper');
  container.innerHTML = `
    <div class="error-message">
      <h3>Error loading blogs</h3>
      <p>${message}</p>
    </div>
  `;
}