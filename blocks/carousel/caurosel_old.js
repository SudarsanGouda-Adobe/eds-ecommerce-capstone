import { createOptimizedPicture } from '../../scripts/aem.js';

const placeholders = {
  carousel: 'Carousel',
  carouselSlideControls: 'Carousel Slide Controls',
  previousSlide: 'Previous Slide',
  nextSlide: 'Next Slide',
  showSlide: 'Show Slide',
  of: 'of',
};

async function fetchProducts() { debugger;
  const response = await fetch('/data/products.json');

  if (!response.ok) {
    throw new Error('Unable to fetch products');
  }

  const productData = await response.json();

  return productData.data || productData;
}

async function renderCategories(block) {
  const products = await fetchProducts();

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  block.innerHTML = '';

  categories.forEach((category) => {
    const categoryProduct = products.find(
      (product) => product.category === category,
    );

    const row = document.createElement('div');

    const imageColumn = document.createElement('div');

    const categoryLink = document.createElement('a');
    categoryLink.href = `/pages/productlist?category=${encodeURIComponent(category)}`;
    categoryLink.title = category;

    const picture = createOptimizedPicture(
      categoryProduct.image,
      category,
      false,
      [{ width: '750' }],
    );

    categoryLink.append(picture);
    imageColumn.append(categoryLink);

    const contentColumn = document.createElement('div');

    const categoryName = document.createElement('p');
    categoryName.textContent = category;

    contentColumn.append(categoryName);

    row.append(imageColumn);
    row.append(contentColumn);

    block.append(row);
  });
}

async function renderProducts(block) {
  const products = await fetchProducts();

  block.innerHTML = '';

  products.forEach((product) => {
    const row = document.createElement('div');

    const imageColumn = document.createElement('div');

    const productLink = document.createElement('a');
    productLink.href = `/pages/products/details?id=${product.id || ''}`;
    productLink.title = product.title;

    const picture = createOptimizedPicture(
      product.image,
      product.title,
      false,
      [{ width: '750' }],
    );

    productLink.append(picture);
    imageColumn.append(productLink);

    const contentColumn = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = product.title;

    const description = document.createElement('p');
    description.textContent = product.description || '';

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    contentColumn.append(
      title,
      description,
      price,
    );

    row.append(
      imageColumn,
      contentColumn,
    );

    block.append(row);
  });
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');

  const slideIndex = parseInt(
    slide.dataset.slideIndex,
    10,
  );

  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute(
      'aria-hidden',
      idx !== slideIndex,
    );

    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll(
    '.carousel-slide-indicator',
  );

  indicators.forEach((indicator, idx) => {
    const button = indicator.querySelector('button');

    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');

  let realSlideIndex = slideIndex;

  if (slideIndex < 0) {
    realSlideIndex = slides.length - 1;
  }

  if (slideIndex >= slides.length) {
    realSlideIndex = 0;
  }

  const activeSlide = slides[realSlideIndex];

  if (!activeSlide) {
    return;
  }

  activeSlide.querySelectorAll('a').forEach((link) => {
    link.removeAttribute('tabindex');
  });

  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function showPreviousSlide(block) {
  const currentSlide = parseInt(
    block.dataset.activeSlide || 0,
    10,
  );

  showSlide(block, currentSlide - 1);
}

function showNextSlide(block) {
  const currentSlide = parseInt(
    block.dataset.activeSlide || 0,
    10,
  );

  showSlide(block, currentSlide + 1);
}

function bindEvents(block) {
  const slideIndicators = block.querySelector(
    '.carousel-slide-indicators',
  );

  if (!slideIndicators) {
    return;
  }

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const slideIndicator = event.currentTarget.parentElement;

      showSlide(
        block,
        parseInt(slideIndicator.dataset.targetSlide, 10),
      );
    });
  });

  block.querySelector('.slide-prev')
    .addEventListener('click', () => {
      showPreviousSlide(block);
    });

  block.querySelector('.slide-next')
  .addEventListener('click', () => {
    showNextSlide(block);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');

  slide.dataset.slideIndex = slideIndex;

  slide.setAttribute(
    'id',
    `carousel-${carouselId}-slide-${slideIndex}`,
  );

  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(
      `carousel-slide-${colIdx === 0 ? 'image' : 'content'}`,
    );

    slide.append(column);
  });

  const labeledBy = slide.querySelector(
    'h1, h2, h3, h4, h5, h6',
  );

  if (labeledBy) {
    slide.setAttribute(
      'aria-labelledby',
      labeledBy.id,
    );
  }

  return slide;
}

let carouselId = 0;

export default async function decorate(block) { debugger;
  if (block.classList.contains('category-carousel')) {
    await renderCategories(block);
  }

  if (block.classList.contains('product-carousel')) {
    await renderProducts(block);
  }

  carouselId += 1;

  block.id = `carousel-${carouselId}`;

  const rows = block.querySelectorAll(':scope > div');

  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute(
    'aria-roledescription',
    placeholders.carousel,
  );

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');

  let slideIndicators;

  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');

    slideIndicatorsNav.setAttribute(
      'aria-label',
      placeholders.carouselSlideControls,
    );

    slideIndicators = document.createElement('ol');

    slideIndicators.classList.add(
      'carousel-slide-indicators',
    );

    slideIndicatorsNav.append(slideIndicators);

    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');

    slideNavButtons.classList.add(
      'carousel-navigation-buttons',
    );

    slideNavButtons.innerHTML = `
      <button
        type="button"
        class="slide-prev"
        aria-label="${placeholders.previousSlide}">
      </button>

      <button
        type="button"
        class="slide-next"
        aria-label="${placeholders.nextSlide}">
      </button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(
      row,
      idx,
      carouselId,
    );

    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');

      indicator.classList.add(
        'carousel-slide-indicator',
      );

      indicator.dataset.targetSlide = idx;

      indicator.innerHTML = `
        <button
          type="button"
          aria-label="${placeholders.showSlide} ${idx + 1} ${placeholders.of} ${rows.length}">
        </button>
      `;

      slideIndicators.append(indicator);
    }

    row.remove();
  });

  container.prepend(slidesWrapper);

  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}