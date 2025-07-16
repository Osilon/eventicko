const containWrapper = document.getElementById('container-wrapper');
for (let i = 0; i < 9; i++){
  containWrapper.innerHTML += `
    <div class="container">
    <div class="main"></div>
    <div class="divider-cont"></div>
    <div class="side-panel">
      <i class="fa-heart"><img src="https://cdn-icons-png.flaticon.com/512/151/151910.png" alt="heart-icon" width="30" height="30"></i>
      <i class="fa-bookmark"><img src="https://cdn-icons-png.flaticon.com/512/25/25667.png" alt="bookmark-icon" width="30" height="30"></i>
      <i class="fa-share-alt"><img src="https://cdn-icons-png.flaticon.com/512/1358/1358023.png" alt="share-icon" width="30" height="30"></i>
    </div>
  </div>
  `;
}