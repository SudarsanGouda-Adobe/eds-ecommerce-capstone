export default function decorate(block) {
  const row = block.querySelector(':scope > div');

  const contentCol = row.children[0];
  const formCol = row.children[1];

  const title = contentCol.querySelector('h2')?.outerHTML;
  const description = contentCol.querySelector('p')?.outerHTML;

  const placeholder = formCol.children[0]?.textContent.trim();
  const buttonLabel = formCol.children[1]?.textContent.trim();

  block.innerHTML = `
    <div class="newsletter-content">
      ${title}
      ${description}
    </div>

    <form class="newsletter-form">
      <input
        type="email"
        placeholder="${placeholder}"
        aria-label="${placeholder}"
      />

      <button
        type="submit"
        aria-label="${buttonLabel}"
      >
        →
      </button>
    </form>
  `;
}