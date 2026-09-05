import { addToCart } from "../../scripts/cart.js";
function getBlockConfig(block){
  const row=block.querySelector(':scope > div');
  const jsonUrl = row?.children[0]?.textContent.trim()|| '';
  if(!jsonUrl){
    alert('JSON URL is missing')
  }
  return {jsonUrl}
}

async function getProduct(jsonUrl) { 
  const id = new URLSearchParams(window.location.search)
    .get('id');

  const response = await fetch(jsonUrl);
  const products = await response.json();
console.log(products)
  return products.data.find(
    (item) => String(item.id) === String(id),
  );
}

function createProductDetails(product) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('product-details');

  wrapper.innerHTML = `
    <div class="product-gallery">

      <div class="product-thumbnails">
      <img src="${product.image}">
      <img src="${product.image}">
      <img src="${product.image}">
      <img src="${product.image}">    
      </div>

      <div class="product-main-image">
      <img src="${product.image}">        
      </div>

    </div>

    <div class="product-info">

      <div class="brand">
        ${product.brand}
      </div>

      <h1 class="product-title">
        ${product.title}
      </h1>

      <div class="rating-section" aria-label="${product.rating} out of 5 stars based on ${product.reviews} reviews">
        ⭐ ${product.rating}
        <span>${product.reviews} reviews</span>
      </div>

      <div class="price-section">
        <span class="old-price">$${product.price}</span>
        <span class="sale-price">$${product.salePrice}</span>
      </div>

      <div class="description">
        ${product.description}
      </div>

      <div class="product-option">
        <h4>Colors</h4>

        <div class="color-options">
          <button style="background:${product.color1}" ></button>
          <button style="background:${product.color2}"></button>
          <button style="background:${product.color3}"></button>
          <button style="background:${product.color4}"></button>
        </div>
      </div>

      <div class="stock-info" aria-live="polite">
        ${product.stockMessage}
      </div>

      <div class="purchase-action">

        <div class="qty-selector">
          <button class="minus-btn" aria-label="Decrease quantity">-</button>
          <span class="qty" aria-live="polite">1</span>
          <button class="plus-btn" aria-label="Increase quantity">+</button>
        </div>

        <button class="add-to-cart" aria-label="Add ${product.title} to cart">
          ${product.buttonText}
        </button>

        <button class="wishlist-btn">
          ♡
        </button>

      </div>

      <div class="shipping-info">
        <p><strong>Delivery:</strong> ${product.delivery}</p>
        <p><strong>Returns:</strong> ${product.returnWindow}</p>
      </div>

      <div class="product-accordion">

        <details open>
          <summary aria-label="Product details">Details</summary>
          <p>${product.description}</p>
        </details>

        <details>
          <summary>Shipping & Returns</summary>
          <p>
            Delivery: ${product.delivery}<br>
            Return Window: ${product.returnWindow}
          </p>
        </details>

      </div>

    </div>
  `;

    const qtyElement = wrapper.querySelector('.qty');
    const addQty=wrapper.querySelector('.plus-btn');
    const removeQty = wrapper.querySelector('.minus-btn');
    const addToCartBtn = wrapper.querySelector('.add-to-cart');

    let quantity = 1;
    addQty.addEventListener('click',()=>{
        quantity +=1;
        qtyElement.textContent = quantity;
    });
    removeQty.addEventListener('click',()=>{
       if(quantity >1) {
        quantity -= 1;
        qtyElement.textContent = quantity;
       }
    });
    addToCartBtn.addEventListener('click',()=>{
        // product.quantity=quantity;
        addToCart({
            ...product,
            quantity
        });
    });

  return wrapper;
}
export default async function decorate(block) {
     const {jsonUrl} =getBlockConfig(block)
  block.innerHTML = '';

  const product = await getProduct(jsonUrl);

  if (!product) {
    block.textContent = 'Product not found';
    return;
  }

  document.title=`${product.title} | Store`;
  const metaDescription=document.querySelector('meta[name="description"]');
  if(metaDescription){
    metaDescription.content=product.description
  }

  block.append(
    createProductDetails(product),
  );
}