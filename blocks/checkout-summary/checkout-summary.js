import { getCart } from '../../scripts/cart.js';
const shippingInfo = {
  name: 'Sudarsan Gouda',
  address: 'Bangalore',
  email: 'demo@example.com',
};
function getTotals(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0,
  );

  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}

export default async function decorate(block) {
  const cart = getCart();

  const {
    subtotal,
    shipping,
    tax,
    total,
  } = getTotals(cart);

  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'checkout-summary';

  wrapper.innerHTML = `
    <div class="checkout-wrapper">

      <div class="checkout-left">

        <section class="shipping-info">
          <h2>Shipping Information</h2>

          <p><strong>Name:</strong> ${shippingInfo.name}</p>
          <p><strong>City:</strong> ${shippingInfo.address}}</p>
          <p><strong>Email:</strong>${shippingInfo.email}</p>
        </section>

        <section class="order-items">
          <h2>Order Items</h2>

          ${
            cart.map((item) => `
              <div class="checkout-item">
                <div class="image-box">
                <img src="${item.image}"/>
                </div>
                <div class="item-details">
                  <h3>${item.title}</h3>

                  <p>
                    Qty: ${item.quantity}
                  </p>

                  <p>
                    $${(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>

              </div>
            `).join('')
          }

        </section>

      </div>

      <aside class="checkout-right">

        <div class="summary-card">

          <h2>Order Summary</h2>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <span>$${shipping.toFixed(2)}</span>
          </div>

          <div class="summary-row">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
          </div>

          <hr>

          <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
            <button class="place-order button-secondary mb-10">
            Back To Cart
          </button>
          <button class="place-order button-primary">
            Place Order
          </button>
           
        

          <div class="next-steps">
            <p>
              Your order will be processed after confirmation.
            </p>

            <p>
              Estimated delivery: 3-5 business days.
            </p>
          </div>

        </div>

      </aside>

    </div>
  `;

  const placeOrderBtn = wrapper.querySelector('.place-order.button-primary');
  const backToCheckCart = wrapper.querySelector('.place-order.button-secondary');

  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('cart');

    alert(
      'Order placed successfully!',
    );

    window.location.href = '/';
  });

  backToCheckCart.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href="/pages/cart"
  })

  block.append(wrapper);
}