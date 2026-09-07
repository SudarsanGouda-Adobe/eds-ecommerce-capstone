export default function decorate(block) {
  const closeBtn = document.createElement('button');

  closeBtn.className = 'home-promo-close';
  closeBtn.setAttribute('aria-label', 'Close banner');
  closeBtn.innerHTML = '&times;';

  block.append(closeBtn);

  closeBtn.addEventListener('click', () => {
    block.style.display = 'none';
  });
}