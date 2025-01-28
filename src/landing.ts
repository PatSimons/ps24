import './global';
window.Webflow ||= [];
window.Webflow.push(() => {
  function formatText(text: string): string {
    // Add null/undefined check
    if (!text) {
      // console.warn('No text provided to formatText function');
      return '';
    }

    return text
      .replace(/\[(.*?)\]/g, '<span class="underline">$1</span>')
      .replace(/\{(.*?)\}/g, '<span class="strikedout">$1</span>');
  }

  const allTexts = document.querySelectorAll('[cs-el="landingh1"]');

  allTexts.forEach((text) => {
    text.innerHTML = formatText(text.innerHTML);
  });
}); // End: Webflow Push
