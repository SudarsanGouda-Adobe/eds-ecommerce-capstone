import { createOptimizedPicture } from '../../scripts/aem.js';
import {getCart,increaseQuantity,decreaseQuantity,getCartSubtotal,removeFromCart} from '../../scripts/cart.js';
function createCartItems(block) {
  const cart = getCart();

  const product = document.createElement('div');
  product.classList.add('cart-product');

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-items');
    cartItem.dataset.productid = item.id;
    cartItem.dataset.index = index;

    // Image
    const imageBox = document.createElement('div');
    imageBox.classList.add('image-box');

    imageBox.append(
      createOptimizedPicture(
        item.image,
        item.title,
        false,
        [{ width: '750' }],
      ),
    );

    // Content
    const cartContent = document.createElement('div');
    cartContent.classList.add('cart-content');

    cartContent.innerHTML = `
      <div class="cart-top">

        <div class="cart-details">
          <div class="title">${item.title || 'Product Title'}</div>
          <div class="variant">${item.variant || 'Variant Name'}</div>
        </div>

        <div class="cart-action">
          <div class="price">$${item.price || 233}</div>

          <div class="qty-group">
            <button class="plus-btn" aria-label="Increase quantity">+</button>
            <span class="qty">${item.quantity || 1}</span>
            <button class="minus-btn" aria-label="Decrease quantity">-</button>
            <button class="remove-btn" aria-label="Remove ${product.title} from cart">🗑</button>
          </div>
        </div>

      </div>
    `;

    // bind button  action area
    const plusBtn=cartContent.querySelector('.plus-btn');
    const minusBtn=cartContent.querySelector('.minus-btn');
    const removeItem = cartContent.querySelector('.remove-btn');
    plusBtn.addEventListener('click',()=>{
        increaseQuantity(Number(item.id));
        block.innerHTML = '';
        renderCart(block);
    });
    minusBtn.addEventListener('click',()=>{
        decreaseQuantity(Number(item.id));
        block.innerHTML = '';
        renderCart(block);
    });
   removeItem.addEventListener('click',()=>{
    console.log('REMOVE CLICKED');

    try {
        console.log(removeFromCart);
        removeFromCart(item.id);
    } catch(e) {
        console.error(e);
    }

    block.innerHTML = '';
    renderCart(block);
  });
    cartItem.append(
      imageBox,
      cartContent,
    );

    product.append(cartItem);
  });

  return product;
}

function createOrderSummary(block){
    const subtotal=getCartSubtotal();
    const shipping = 9;
    const discount = 10;
    const giftCertificate = 10;
    const total = subtotal + shipping - discount - giftCertificate;
    let orderSummary=document.createElement('div');
    orderSummary.classList.add('order-summary');
    orderSummary.textContent="orderSummary";

    const orderSummaryDetails=document.createElement('div');    
    orderSummaryDetails.classList.add('summary-details');
    
    orderSummaryDetails.innerHTML=`
    <ul class='summery-item'>
        <li>Subtotal</li>
        <li class="right">$${subtotal.toFixed(2)}</li>
        <li>Discount</li>
        <li class="right">-$${discount.toFixed(2)}</li>
        <li>Gift certificate</li>
        <li class="right">-$${giftCertificate.toFixed(2)}</li>
        <li>Tax</li>
        <li>Calculated at checkout</li>
        <li>Shipping</li>
        <li class="right">$${shipping.toFixed(2)}</li>
        <li class='full'>Standard to <span>3333</span>change</li>
        <li class='full border'>Promo code</li>
        <li class='full border'>Gift card</li>
        <li><strong>Total</strong></li>
        <li class="right"><strong>$${total.toFixed(2)}</strong></li>
        <li class='full'>
        <button>Continue shopping</button>
        <button>Proess to checkout</button>
        </li>
    </ul>
`;
orderSummary.append(orderSummaryDetails);
return orderSummary
}

async function renderCart(block){
  block.innerHTML='';
    const product=createCartItems(block);
    const orderSummary=createOrderSummary(block);
     block.append(product,orderSummary);

}
export default async function decorate(block) {
    block.innerHTML='';
   await renderCart(block);
}