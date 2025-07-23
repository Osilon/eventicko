document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');
  
  if (!blogId) {
    displayError('Blog ID not provided');
    return;
  }
  
  fetchBlogDetails(blogId);
});

async function fetchBlogDetails(blogId) {
  try {
    const response = await fetch(`../Scripts/fetch_blogs.php?id=${blogId}`);
    const data = await response.json();
    
    if (data.error) {
      displayError(data.error);
      return;
    }
    
    displayBlogDetails(data);
    document.title = `${data.title} - Eventicko`;
    
  } catch (error) {
    console.error('Error fetching blog details:', error);
    displayError('Failed to load blog post. Please try again later.');
  }
}

function displayBlogDetails(blog) {
  const container = document.getElementById('blog-detail-container');
  
  // Format the publish date
  const publishDate = new Date(blog.publish_date);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  container.innerHTML = `
    <div class="blog-content">
      <a href="./blog.html" class="back-button">
        ← Back to all blogs
      </a>
      
      <img src="${blog.image_url}" alt="${blog.title}" class="blog-image" onerror="this.src='../Assets/placeholder-image.jpg'">
      
      <div class="blog-category">BLOG</div>
      
      <h1 class="blog-title">${blog.title}</h1>
      
      <div class="blog-meta">
        <div class="blog-author">
          <span>👤</span>
          <span>By ${blog.author}</span>
        </div>
        <div class="blog-date">📅 ${formattedDate}</div>
      </div>
      
      <div class="blog-text">
        ${formatBlogContent(blog.content)}
      </div>
    </div>
    
    <div class="blog-sidebar">
      <div class="blog-info-card">
        <h3 class="blog-info-title">About this post</h3>
        
        <div class="blog-info-item">
          <span class="blog-info-icon">📝</span>
          <span class="blog-info-label">Author:</span>
          <span class="blog-info-value">${blog.author}</span>
        </div>
        
        <div class="blog-info-item">
          <span class="blog-info-icon">📅</span>
          <span class="blog-info-label">Published:</span>
          <span class="blog-info-value">${formattedDate}</span>
        </div>
        
        <div class="blog-info-item">
          <span class="blog-info-icon">📖</span>
          <span class="blog-info-label">Reading Time:</span>
          <span class="blog-info-value">${calculateReadingTime(blog.content)} min read</span>
        </div>
      </div>
    </div>
  `;
}

function formatBlogContent(content) {
  // Split content into paragraphs and wrap each in <p> tags
  return content
    .split('\n\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
}

function calculateReadingTime(content) {
  // Estimate reading time based on average reading speed of 200 words per minute
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

function displayError(message) {
  const container = document.getElementById('blog-detail-container');
  container.innerHTML = `
    <div class="error-message">
      <h2>Oops! Something went wrong</h2>
      <p>${message}</p>
      <a href="./blog.html" class="back-button">← Back to Blog</a>
    </div>
  `;
}