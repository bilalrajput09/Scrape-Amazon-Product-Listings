const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/scrape', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const amazonURL = `https://www.amazon.com/s?k=${keyword}`;

    // Fetch the Amazon search results page
    const { data } = await axios.get(amazonURL);

    // Use cheerio to parse HTML content
    const $ = cheerio.load(data);

    // Extract details for each product listing on the first page
    const products = [];

    $('.s-result-item').each((index, element) => {
      const title = $(element).find('h2 span').text();
      const rating = $(element).find('.a-icon-star-small .a-icon-alt').text();
      // Fetching reviews using a more specific selector
      const reviewsElement = $(element).find(
        'span.a-size-base.s-underline-text',
      );
      const reviews = reviewsElement.text();
      const imageUrl = $(element).find('.s-image').attr('src');

      products.push({ title, rating, reviews, imageUrl });
    });

    res.json(products);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
