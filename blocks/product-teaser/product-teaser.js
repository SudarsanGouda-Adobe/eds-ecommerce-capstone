
import { createOptimizedPicture } from '../../scripts/aem.js';
import { addToCart } from '../../scripts/cart.js';
export function createProductTeaser(product) {
  const teaser = document.createElement('div');
  teaser.classList.add('product-teaser');

  /* Image Section */

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('product-teaser-image');

  const wishlist = document.createElement('button');
  wishlist.classList.add('product-teaser-wishlist');
  wishlist.type = 'button';
  wishlist.setAttribute('aria-label', 'Add to wishlist');
  wishlist.innerHTML = '♡';

  const imageLink = document.createElement('a');
  imageLink.href = `/pages/products/details?id=${product.id || ''}`;
  imageLink.title = product.title;

  const picture = createOptimizedPicture(
    product.image,
    product.title,
    false,
    [{ width: '750' }],
  );

  imageLink.append(picture);

  imageWrapper.append(
    wishlist,
    imageLink,
  );

  /* Content Section */

  const content = document.createElement('div');
  content.classList.add('product-teaser-content');

  const title = document.createElement('h3');
  title.classList.add('product-teaser-title');

  const titleLink = document.createElement('a');
  titleLink.href = `/pages/products/details?id=${product.id || ''}`;
  titleLink.title = product.title;
  titleLink.textContent = product.title;

  title.append(titleLink);

  const category = document.createElement('p');
  category.classList.add('product-teaser-category');
  category.textContent = product.category || '';

  const price = document.createElement('p');
  price.classList.add('product-teaser-price');
  price.textContent = `$${product.price}`;

  const rating = document.createElement('div');
  rating.classList.add('product-teaser-rating');

  rating.setAttribute(
    'aria-label',
    `Rated ${product.rating} out of 5 stars with ${product.reviews} reviews`,
  );

  rating.innerHTML = `
    <span class="stars">★★★★★</span>
    <span class="rating-value">${product.rating}</span>
    <span class="rating-count">${product.reviews} <span class='divider'>|</span> Reviews</span>
  `;

  const colors = document.createElement('div');
  colors.classList.add('product-teaser-colors');

  [
    product.color1,
    product.color2,
    product.color3,
    product.color4,
  ].forEach((color) => {
    if (!color) return;

    const swatch = document.createElement('span');
    swatch.classList.add('product-teaser-color');
    swatch.style.backgroundColor = color;

    colors.append(swatch);
  });

  const stock = document.createElement('p');
  stock.classList.add('product-teaser-stock');
  stock.textContent =
    product.stockMessage || '';

  const cartButton = document.createElement('button');
  cartButton.classList.add('product-teaser-cart');
  cartButton.type = 'button';
  cartButton.textContent =
    product.buttonText || 'Add to Cart';

  cartButton.setAttribute(
    'aria-label',
    `Add ${product.title} to cart`,
  );
  cartButton.dataset.productid = product.id;

  cartButton.addEventListener('click', (e) => { debugger;
    e.preventDefault();
    addToCart(product)
    console.log('Add To Cart:', product);
  });

  content.append(
    title,
    category,
    price,
    rating,
    colors,
    stock,
    cartButton,
  );

  teaser.append(
    imageWrapper,
    content,
  );

  return teaser;
}