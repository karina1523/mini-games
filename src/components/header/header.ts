import './header.scss';
import { authService } from '../../services/auth-service';
import { openAuthModal } from '../auth-dialog/auth-dialog';
import { createBurgerMenu } from '../burger-menu/burger-menu'; // Импортируем из правильной папки

export function createHeader(currentPath: string, onNavigate: (path: string) => void, onStateChange: () => void): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';

  const currentUser = authService.getCurrentUser();

  // Создаем бургер-меню и передаем ему роутинг для переключения страниц
  const burgerMenu = createBurgerMenu(onNavigate);

  header.innerHTML = `
    <div class="header__container">
      <a href="/" id="nav-logo" class="header__logo">🎮 MiniGames</a>
      
      <nav class="header__nav">
        <a href="/" class="header__link ${currentPath === '/' ? 'header__link--active' : ''}" id="nav-home">Home</a>
        <a href="/games" class="header__link ${currentPath === '/games' ? 'header__link--active' : ''}" id="nav-games">Games</a>
        <a href="/about" class="header__link ${currentPath === '/about' ? 'header__link--active' : ''}" id="nav-about">About</a>
      </nav>

      <div class="header__auth">
        ${
          currentUser
            ? `<button id="btn-profile" class="btn btn--secondary ${currentPath === '/profile' ? 'btn--active' : ''}">👤 ${currentUser.username}</button>`
            : `<button id="btn-login" class="btn btn--primary">Регистрация / Вход</button>`
        }
      </div>

      <!-- Кнопка вызова бургер-меню для мобильных устройств -->
      <button class="header__burger-btn" id="burger-toggle" aria-label="Открыть меню">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Добавляем DOM-элемент твоего бургер-меню внутрь хэдера
  header.appendChild(burgerMenu.element);

  // Вешаем переключение видимости по клику на кнопку
  header.querySelector('#burger-toggle')?.addEventListener('click', () => {
    burgerMenu.toggle();
  });

  const bindNav = (id: string, path: string) => {
    header.querySelector(id)?.addEventListener('click', (e) => {
      e.preventDefault();
      onNavigate(path);
    });
  };

  bindNav('#nav-logo', '/');
  bindNav('#nav-home', '/');
  bindNav('#nav-games', '/games');
  bindNav('#nav-about', '/about');

  header.querySelector('#btn-profile')?.addEventListener('click', () => onNavigate('/profile'));
  header.querySelector('#btn-login')?.addEventListener('click', () => openAuthModal(onStateChange));

  return header;
}