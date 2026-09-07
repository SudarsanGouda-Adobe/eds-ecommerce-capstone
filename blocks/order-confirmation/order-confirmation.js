export default async function decorate(block) {
  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('order-confirmation');

  const orderId =
    `ORD-${Math.floor(Math.random() * 100000)}`;

  wrapper.innerHTML = `
    <div class="confirmation-card">

      <div class="success-icon">✓</div>

      <h1>Thank You!</h1>

      <p>
        Your order has been placed successfully.
      </p>

      <p>
        <strong>Order ID:</strong> ${orderId}
      </p>

      <p>
        Estimated delivery:
        3-5 business days
      </p>

      <a class="continue-shopping button-primary" href="/pages/category">Continue Shopping</a>      

    </div>
  `;

  block.append(wrapper);
}