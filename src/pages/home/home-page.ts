import './home-page.scss';
import { authService } from '../../services/auth-service';
import { openAuthModal } from '../../components/auth-dialog/auth-dialog';

export function createHomePage(onNavigate: (path: string) => void, onStateChange: () => void): HTMLElement {
  const page = document.createElement('div');
  page.className = 'home-page';

  page.innerHTML = `
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Добро пожаловать в <span>MiniGames</span></h1>
        <p class="hero__subtitle">Играй в любимые мини-игры, зарабатывай баллы и сохраняй свои рекорды в личном профиле!</p>
        <div class="hero__actions">
          <button id="btn-play" class="btn btn--primary btn--large">🎮 Играть сейчас</button>
          <button id="btn-about" class="btn btn--secondary btn--large">ℹ️ О проекте</button>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card" id="card-start">
        <div class="feature-card__icon">⚡</div>
        <h3>Быстрый старт</h3>
        <p>Игры открыты для всех. Просматривай каталог и правила в любое время.</p>
      </div>
      
      <div class="feature-card" id="card-scores">
        <div class="feature-card__icon">🏆</div>
        <h3>Сохранение очков</h3>
        <p>Пройди быструю регистрацию, чтобы твои рекорды сохранялись в аккаунте.</p>
      </div>

      <div class="feature-card feature-card--clickable" id="card-profile">
        <div class="feature-card__icon">👤</div>
        <h3>Личный кабинет</h3>
        <p>Управляй своим профилем или удаляй аккаунт в один клик.</p>
      </div>
    </section>
  `;

  // Кнопка "Играть сейчас"
  page.querySelector('#btn-play')?.addEventListener('click', () => {
    if (authService.getCurrentUser()) {
      onNavigate('/games');
    } else {
      openAuthModal(onStateChange, 'Зарегистрируйтесь или войдите, чтобы начать игру!');
    }
  });

  // Кнопка "О проекте"
  page.querySelector('#btn-about')?.addEventListener('click', () => onNavigate('/about'));

  // Клик по карточке "Быстрый старт" везет в каталог игр
  page.querySelector('#card-start')?.addEventListener('click', () => onNavigate('/games'));

  // Клик по карточке "Личный кабинет"
  page.querySelector('#card-profile')?.addEventListener('click', () => {
    if (authService.getCurrentUser()) {
      onNavigate('/profile');
    } else {
      openAuthModal(onStateChange, 'Войдите или зарегистрируйтесь, чтобы открыть Личный кабинет!');
    }
  });

  return page;
}