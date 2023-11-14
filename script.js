const scrapeBtn = document.getElementById('scrape_btn');

const initiateScraping = () => {
  const keyword = document.getElementById('keyword').value;
  const resultsContainer = document.getElementById('results-container');
  scrapeBtn.textContent = 'Working...';

  // Make AJAX call to the backend endpoint
  fetch(`http://localhost:3000/api/scrape?keyword=${keyword}`)
    .then((response) => response.json())
    .then((data) => {
      // Display results on the page
      resultsContainer.innerHTML = '';
      console.log(data);

      data.forEach((product) => {
        if (product.title !== '') {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.title}">
          <div>
            <h3>${product.title}</h3>
            <p>Rating: ${product.rating}</p>
            <p>Reviews: ${product.reviews}</p>
          </div>
        `;
          resultsContainer.appendChild(productElement);
        }
      });

      scrapeBtn.textContent = 'Scrape';
    })
    .catch((error) => console.error('Error:', error));
};

scrapeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  initiateScraping();
});
