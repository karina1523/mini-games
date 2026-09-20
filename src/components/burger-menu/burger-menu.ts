import './burger-menu.scss';

export function createBurgerMenu(onNavigate: (path: string) => void): { element: HTMLElement; toggle: () => void } {
  const menu = document.createElement('div');
  menu.className = 'burger-menu';

  menu.innerHTML = `
    <button class="burger-menu__close-btn" id="burger-close">✕</button>
    <nav class="burger-menu__nav">
      <a href="/" class="burger-menu__link" data-path="/">Home</a>
      <a href="/games" class="burger-menu__link" data-path="/games">Games</a>
      <a href="/about" class="burger-menu__link" data-path="/about">About</a>
    </nav>
  `;

  const toggle = () => {
    menu.classList.toggle('burger-menu--open');
  };

  const closeBtn = menu.querySelector('#burger-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggle);
  }

  // Обработка кликов по ссылкам внутри бургера для SPA
  menu.querySelectorAll('.burger-menu__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-path');
      if (path) {
        onNavigate(path);
        toggle(); // Закрываем меню при переходе
      }
    });
  });

  return { element: menu, toggle };
}