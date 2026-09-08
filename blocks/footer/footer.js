import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */


export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);


footer.querySelectorAll('a').forEach((link) => {
  const href = link.href.toLowerCase();

  if (
    href.includes('twitter.com') ||
    href.includes('instagram.com') ||
    href.includes('facebook.com') ||
    href.includes('linkedin.com')
  ) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});


  block.append(footer);
}


