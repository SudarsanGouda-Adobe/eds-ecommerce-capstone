import { createProductTeaser } from '../product-teaser/product-teaser.js';

async function fetchProducts(jsonUrl) {
  const response = await fetch(jsonUrl);

  if (!response.ok) {
    throw new Error('Unable to fetch products');
  }

  const data = await response.json();

  return data.data || data;
}

export default async function decorate(block) {
  const row = block.querySelector(':scope > div');

  const contentColumn = row.children[0];
  const configColumn = row.children[1];

  const title =
    contentColumn.querySelector('h2')?.textContent;

  const description =
    contentColumn.querySelector('p')?.textContent;

  const cta =
    contentColumn.querySelector('a');

  const jsonUrl =
    configColumn.children[0]?.textContent.trim();

  const count =
    parseInt(
      configColumn.children[1]?.textContent.trim(),
      10,
    ) || 6;

  const products = await fetchProducts(jsonUrl);

  const bestSellers = products.filter((product) =>
        String(product.bestSeller)
          .trim()
          .toUpperCase() === 'TRUE',
    )
    .slice(0, count);

  block.innerHTML = '';

  const content = document.createElement('div');
  content.classList.add('best-seller-content');

  content.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  if (cta) {
    content.append(cta);
  }

  const grid = document.createElement('div');
  grid.classList.add('best-seller-products');

  bestSellers.forEach((product) => {
    grid.append(createProductTeaser(product),);
  });

  block.append(
    content,
    grid,
  );
}