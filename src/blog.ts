import './global';
window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Add current class to nav link
  const navLink = document.getElementById('nav_blog');
  navLink?.classList.add('is-active');
});
