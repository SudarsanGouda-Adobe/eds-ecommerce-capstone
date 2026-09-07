export default function decorate(block) {
  block.innerHTML = `
    <div class="checkout-form-card">
      <h1>Checkout Information</h1>

      <form
        class="checkout-form"
        aria-label="Checkout Information"
        novalidate
      >
        <div class="form-field">
          <label for="full-name">
            Full Name *
          </label>

          <input
            id="full-name"
            name="fullName"
            type="text"
            aria-describedby="full-name-error"
          >

          <small
            id="full-name-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <div class="form-field">
          <label for="email">
            Email Address *
          </label>

          <input
            id="email"
            name="email"
            type="email"
            aria-describedby="email-error"
          >

          <small
            id="email-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <div class="form-field">
          <label for="phone">
            Phone Number *
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            aria-describedby="phone-error"
          >

          <small
            id="phone-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <div class="form-field">
          <label for="address">
            Street Address *
          </label>

          <input
            id="address"
            name="address"
            type="text"
            aria-describedby="address-error"
          >

          <small
            id="address-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <div class="form-field">
          <label for="city">
            City *
          </label>

          <input
            id="city"
            name="city"
            type="text"
            aria-describedby="city-error"
          >

          <small
            id="city-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <div class="form-field">
          <label for="postal-code">
            Postal Code *
          </label>

          <input
            id="postal-code"
            name="postalCode"
            type="text"
            aria-describedby="postal-error"
          >

          <small
            id="postal-error"
            class="error-message"
            aria-live="polite"
          ></small>
        </div>

        <button
          type="submit"
          class="button-primary"
          aria-label="Continue to review order"
        >
          Continue To Review Order
        </button>
      </form>
    </div>
  `;

  const form = block.querySelector('.checkout-form');

  function showError(input, message) {
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');

    const errorElement = input.parentElement.querySelector(
      '.error-message',
    );

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove('input-error');
    input.setAttribute('aria-invalid', 'false');

    const errorElement = input.parentElement.querySelector(
      '.error-message',
    );

    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const fullName = form.querySelector('[name="fullName"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const address = form.querySelector('[name="address"]');
    const city = form.querySelector('[name="city"]');
    const postalCode = form.querySelector('[name="postalCode"]');

    form.querySelectorAll('input')
      .forEach((input) => clearError(input));

    if (!fullName.value.trim()) {
      showError(fullName, 'Full Name is required');
      isValid = false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.value.trim()) {
      showError(
        email,
        'Email Address is required',
      );
      isValid = false;
    } else if (
      !emailRegex.test(email.value.trim())
    ) {
      showError(
        email,
        'Please enter a valid email address',
      );
      isValid = false;
    }

    const phoneRegex = /^\d{10}$/;

    if (!phone.value.trim()) {
      showError(
        phone,
        'Phone Number is required',
      );
      isValid = false;
    } else if (
      !phoneRegex.test(phone.value.trim())
    ) {
      showError(
        phone,
        'Enter a valid 10 digit phone number',
      );
      isValid = false;
    }

    if (!address.value.trim()) {
      showError(
        address,
        'Street Address is required',
      );
      isValid = false;
    }

    if (!city.value.trim()) {
      showError(
        city,
        'City is required',
      );
      isValid = false;
    }

    if (!postalCode.value.trim()) {
      showError(
        postalCode,
        'Postal Code is required',
      );
      isValid = false;
    }

    if (isValid) {
      window.location.href = '/pages/checkout';
    }
  });
}