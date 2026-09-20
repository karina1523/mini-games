import './about-page.scss';

export function createAboutPage(): HTMLElement {
  const page = document.createElement('div');
  page.className = 'about-page';

  page.innerHTML = `
    <div class="about-container">
      <h1 class="about-title">О проекте <span>MiniGames</span></h1>
      <p class="about-description">
        <strong>MiniGames</strong> — это учебный и развлекательный веб-проект, созданный на чистом TypeScript и Sass с использованием Vite. 
      </p>

      <div class="about-grid">
        <div class="about-box">
          <h3>🚀 Технологии</h3>
          <ul>
            <li><strong>TypeScript</strong> — строгая типизация и надежность кода</li>
            <li><strong>Sass (SCSS)</strong> — современные стили и токенизация</li>
            <li><strong>Vite</strong> — молниеносная сборка и HMR</li>
            <li><strong>LocalStorage</strong> — сохранение профиля и игрового прогресса</li>
          </ul>
        </div>

        <div class="about-box">
          <h3>🎯 Возможности</h3>
          <ul>
            <li>Личный кабинет пользователя</li>
            <li>Регистрация и безопасное управление аккаунтом</li>
            <li>Возможность полного удаления профиля</li>
            <li>Кастомный SPA-роутинг без перезагрузки страниц</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  return page;
}