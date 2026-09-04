import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { updateCartCount } from '../../scripts/cart.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);


// Nav tools: Search, User, Cart
const navTools = nav.children[2];

if (navTools) {
  const tools = navTools.querySelector('.default-content-wrapper');
  const paragraphs = tools?.querySelectorAll(':scope > p');

  // Search
 // Search
const searchIcon = paragraphs?.[0]?.querySelector('.icon-search');

if (searchIcon) {
  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'nav-search';
  searchButton.setAttribute('aria-label', 'Open search');
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.setAttribute('aria-controls', 'header-search');

  searchIcon.setAttribute('aria-hidden', 'true');

  searchButton.append(searchIcon);
  paragraphs[0].replaceChildren(searchButton);

  const searchContainer = document.createElement('div');
  searchContainer.className = 'header-search';
  searchContainer.id = 'header-search';
  searchContainer.hidden = true;

  searchContainer.innerHTML = `
    <form class="search-form" role="search">
      <input
        id="header-search-input"
        class="search-input"
        type="search"
        name="search"
        placeholder="Search products"
        aria-label="Search products"
        autocomplete="off"
      >

      <button
        type="submit"
        class="search-submit"
        aria-label="Submit search">
        Search
      </button>
    </form>
  `;

  navTools.append(searchContainer);

  const searchInput = searchContainer.querySelector('.search-input');
  const searchForm = searchContainer.querySelector('.search-form');

  searchButton.addEventListener('click', () => {
    const isOpen = !searchContainer.hidden;

    searchContainer.hidden = isOpen;

    searchButton.setAttribute(
      'aria-expanded',
      String(!isOpen),
    );

    searchButton.setAttribute(
      'aria-label',
      isOpen ? 'Open search' : 'Close search',
    );

    if (!isOpen) {
      searchInput.focus();
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return;

    // Product search logic
    console.log('Search:', searchTerm);
  });
}


  // User
  const userIcon = paragraphs?.[1]?.querySelector('.icon-user');

  if (userIcon) {
    const userButton = document.createElement('button');
    userButton.type = 'button';
    userButton.className = 'nav-user';
    userButton.setAttribute('aria-label', 'Account');

    userIcon.setAttribute('aria-hidden', 'true');

    userButton.append(userIcon);
    paragraphs[1].replaceChildren(userButton);

    userButton.addEventListener('click', () => {
      // Add your account functionality here
    });
  }

  // Cart
  const cartIcon = paragraphs?.[2]?.querySelector('.icon-cart');
  const cartLink = cartIcon?.closest('a');

  if (cartLink) {
    cartLink.classList.add('nav-cart');
    cartLink.setAttribute('aria-label', 'Shopping cart, 0 items');

    cartIcon.setAttribute('aria-hidden', 'true');

    const cartCount = document.createElement('span');
    cartCount.className = 'cart-count';
    cartCount.textContent = '0';
    cartCount.setAttribute('aria-hidden', 'true');

    cartLink.append(cartCount);
  }
}
//search user cart end



  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  updateCartCount();
}
