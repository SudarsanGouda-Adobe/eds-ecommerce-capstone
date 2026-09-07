import { createProductTeaser } from "../product-teaser/product-teaser.js";

function getBlockConfig(block) {
  const row = block.querySelector(':scope > div');
  const jsonUrl = row?.children[0]?.textContent.trim() || '';
  if (!jsonUrl) {
    alert('JSON URL is missing')
  }
  return { jsonUrl }
}
async function getProducts(jsonUrl) {
  const response = await fetch(jsonUrl);
  if (!response.ok) {
    throw new Error('Unable to fetch products');
  }
  const data = await response.json();

  return data.data || data;
}

function renderProducts(grid, products) {
  grid.innerHTML = '';

  if (!products || products.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('no-products-message');

    emptyState.innerHTML = `
      <h2>No Products Found</h2>
      <p>Try adjusting your filters.</p>
    `;

    grid.append(emptyState);
    return;
  }

  products.forEach((product) => {
    const productCard = createProductTeaser(product);
    grid.append(productCard);
  });
}

function handleFeatureFilter(
  sidebar,
  featureBtn,
  currentProducts,
  grid,
  heading,
  selectedCategory
) {
  sidebar.querySelectorAll('.feature-btn')
    .forEach((btn) => {
      btn.classList.remove('active');
    });

  featureBtn.classList.add('active');

  const selectedFeature =
    featureBtn.dataset.feature;

  const filteredProducts = currentProducts.filter(
    (item) => item[selectedFeature] === 'TRUE'
  );

  if (heading) {
    heading.innerHTML = `
      ${selectedCategory || 'All Products'}
      <span>(${filteredProducts.length})</span>
    `;
  }

  renderProducts(grid, filteredProducts);
}

function handlePriceFilter(
  minPrice,
  maxPrice,
  currentProducts,
  grid,
  heading,
  selectedCategory,
) {
  const filteredProducts = currentProducts.filter((item) => {
    const price = Number(item.price);

    if (minPrice && price < Number(minPrice)) {
      return false;
    }

    if (maxPrice && price > Number(maxPrice)) {
      return false;
    }

    return true;
  });

  if (heading) {
    heading.innerHTML = `
      ${selectedCategory || 'All Products'}
      <span>(${filteredProducts.length})</span>
    `;
  }

  renderProducts(grid, filteredProducts);
}

function handleRatingFilter(ratingInput,sidebar,currentProducts,grid,heading,selectedCategory) {
  sidebar.querySelectorAll('.rating-list input')
    .forEach((input) => {
      if (input !== ratingInput) {
        input.checked = false;
      }
    });

  const selectedRating = Number(ratingInput.value);

  const filteredProducts = currentProducts.filter((item) =>
      Math.floor(Number(item.rating)) === selectedRating
  );

  if (heading) {
    heading.innerHTML = `
      ${selectedCategory || 'All Products'}
      <span>(${filteredProducts.length})</span>
    `;
  }

  renderProducts(grid, filteredProducts);
}


function createFilterSidebar(products, selectedCategory, grid, heading,currentProducts) {
  const sidebar = document.createElement('aside');

  sidebar.classList.add('filter-sidebar');
  sidebar.setAttribute('aria-label', 'Product Filters');

  const categories = [
    ...new Set(products.map((item) => item.category)),
  ];

  const categoryHtml = categories
    .map((category) => `
      <button
        class="category-link ${selectedCategory === category ? 'active' : ''
      }"
        data-category="${category}">
        ${category}
      </button>
    `)
    .join('');

  sidebar.innerHTML = `
    <details open class="filter-group">
      <summary>Category</summary>

      <div class="category-list">
        <button
          class="category-link ${!selectedCategory ? 'active' : ''
    }"
          data-category="">
          All Products
        </button>

        ${categoryHtml}
      </div>
    </details>

    <details class="filter-group">
      <summary>Features</summary>

      <div class="feature-buttons">
        <button
          class="feature-btn"
          data-feature="featured">
          Featured
        </button>

        <button
          class="feature-btn"
          data-feature="bestSeller">
          Best Seller
        </button>

        <button
          class="feature-btn"
          data-feature="newArrival">
          New Arrival
        </button>

        <button
          class="feature-btn"
          data-feature="freeShipping">
          Free Shipping
        </button>
      </div>
    </details>

    <details class="filter-group">
      <summary>Price</summary>

      <div class="price-range">
        <input
          type="number"
          placeholder="Min Price"
          aria-label="Minimum Price">

        <input
          type="number"
          placeholder="Max Price"
          aria-label="Maximum Price">

        <button class="apply-price button-default">
          Apply
        </button>
      </div>
    </details>

    <details class="filter-group">
      <summary>Rating</summary>

     <div class="rating-list">

    <label>
      <input type="radio" value="5">
      ★★★★★
    </label>

    <label>
      <input type="radio" value="4">
      ★★★★☆
    </label>

    <label>
      <input type="radio" value="3">
      ★★★☆☆
    </label>

    <label>
      <input type="radio" value="2">
      ★★☆☆☆
    </label>

  </div>
    </details>

    <button class="reset-filter-btn button-default">
      Reset Filters
    </button>
  `;

  // category search event
  sidebar.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-link');
    if (!btn) return;


    sidebar.querySelectorAll('.category-link')
      .forEach((link) => {
        link.classList.remove('active');
      });
    btn.classList.add('active');

     selectedCategory = btn.dataset.category;
     currentProducts = !selectedCategory
      ? products
      : products.filter(
        (item) => item.category === selectedCategory
      );
      const filteredProducts = currentProducts;

    if (heading) {
      heading.innerHTML = `
      ${selectedCategory || 'All Products'}
      <span>(${filteredProducts.length})</span>
    `;
    }

    renderProducts(grid, filteredProducts);
  });


  // for feature
  sidebar.addEventListener('click', (e) => {
  const featureBtn = e.target.closest('.feature-btn');
  if (!featureBtn) return;
  handleFeatureFilter(sidebar,featureBtn,currentProducts,grid,heading,selectedCategory); });

  // for price
  sidebar.addEventListener('click', (e) => {
  const applyBtn = e.target.closest('.apply-price');
  if (!applyBtn) return;

  const minPrice = sidebar.querySelector('input[placeholder="Min Price"]').value;
  const maxPrice = sidebar.querySelector('input[placeholder="Max Price"]').value;
  handlePriceFilter(minPrice,maxPrice,currentProducts,grid,heading,selectedCategory);
  });

  // rating event
  sidebar.addEventListener('change', (e) => {
  const ratingInput =e.target.closest('.rating-list input');

  if (!ratingInput) return;
  handleRatingFilter(ratingInput,sidebar,currentProducts,grid,heading,selectedCategory);
});


  return sidebar;
}




export default async function decorate(block) {
  const { jsonUrl } = getBlockConfig(block);
  const products = await getProducts(jsonUrl);
  const category = new URLSearchParams(window.location.search).get('category');
  const feature = new URLSearchParams(window.location.search).get('feature');
  const searchTerm = new URLSearchParams(window.location.search,).get('search');

  block.innerHTML = '';
  const heading = document.querySelector('h1');


  const layout = document.createElement('div');
  layout.classList.add('category-layout');

  const productContent = document.createElement('div');
  productContent.classList.add('products-content');

  const grid = document.createElement('div');
  grid.classList.add('category-products');

  productContent.append(grid);

  let categoryData = category ? products.filter((item) => item.category === category) : products;
  if(feature && products.length){
    categoryData = categoryData.filter((item)=> item[feature] === 'TRUE');
  }
  let currentProducts =[...categoryData];
   if (searchTerm?.trim()) {
  const query = searchTerm.trim().toLowerCase();

  categoryData = categoryData.filter((item) =>
    item.title?.toLowerCase().includes(query)
    || item.category?.toLowerCase().includes(query)
    || item.description?.toLowerCase().includes(query)
    || item.brand?.toLowerCase().includes(query)
    || item.sku?.toLowerCase().includes(query)
  );
}

 
  if (searchTerm?.trim() && heading) {
  heading.classList.add('search-results-heading');
  heading.innerHTML = `
    Results for "${searchTerm}"
    <span>(${categoryData.length})</span>
  `;
}
  const sidebar = createFilterSidebar(products, category, grid, heading,currentProducts)

  layout.append(sidebar, productContent);

  renderProducts(grid, categoryData,)

  block.append(layout)

}