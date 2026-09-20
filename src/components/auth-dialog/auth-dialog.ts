import './auth-dialog.scss';
import { authService } from '../../services/auth-service';

export function openAuthModal(onStateChange: () => void, customNotice?: string): void {
  const existingModal = document.querySelector('.auth-modal-overlay');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'auth-modal-overlay';

  const currentUser = authService.getCurrentUser();

  // 1. Окно Профиля (если уже авторизован)
  if (currentUser) {
    overlay.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal__close" id="close-modal">&times;</button>
        <h2 class="auth-modal__title">Личный Кабинет</h2>
        
        <div class="profile-info">
          <div class="profile-avatar">👤</div>
          <p class="profile-username"><strong>Имя:</strong> ${currentUser.username}</p>
          <p class="profile-email"><strong>Email:</strong> ${currentUser.email}</p>
          <div class="profile-score">
            <span>🏆 Ваш лучший рекорд:</span>
            <strong>${currentUser.highScore} очков</strong>
          </div>
        </div>

        <div class="profile-actions">
          <button id="btn-logout" class="btn btn--secondary">Выйти из аккаунта</button>
          <button id="btn-delete" class="btn btn--danger">Удалить аккаунт</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.remove());

    overlay.querySelector('#btn-logout')?.addEventListener('click', () => {
      authService.logout();
      overlay.remove();
      onStateChange();
    });

    overlay.querySelector('#btn-delete')?.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите удалить аккаунт? Все набранные очки будут безвозвратно удалены.')) {
        authService.deleteAccount();
        overlay.remove();
        onStateChange();
      }
    });

    return;
  }

  // 2. Окно Входа / Регистрации (для гостя)
  let isRegisterMode = true;

  const renderForm = () => {
    overlay.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal__close" id="close-modal">&times;</button>
        <h2 class="auth-modal__title">${isRegisterMode ? 'Создать аккаунт' : 'Вход'}</h2>
        
        ${customNotice ? `<p class="auth-modal__notice">🔒 ${customNotice}</p>` : ''}

        <form id="auth-form" class="auth-form">
          <div class="auth-form__field">
            <label for="username">${isRegisterMode ? 'Имя пользователя' : 'Логин или Email'}</label>
            <input type="text" id="username" required placeholder="${isRegisterMode ? 'Придумайте имя...' : 'Введите логин'}" />
          </div>

          ${
            isRegisterMode
              ? `
            <div class="auth-form__field">
              <label for="email">Email</label>
              <input type="email" id="email" required placeholder="name@example.com" />
            </div>
          `
              : ''
          }

          <div class="auth-form__field">
            <label for="password">Пароль</label>
            <input type="password" id="password" required minlength="6" placeholder="••••••••" />
          </div>

          <div id="auth-error" class="auth-form__error"></div>

          <button type="submit" class="btn btn--primary auth-form__submit">
            ${isRegisterMode ? 'Зарегистрироваться и играть' : 'Войти'}
          </button>
        </form>

        <p class="auth-modal__switch">
          ${isRegisterMode ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}
          <button type="button" id="switch-mode">
            ${isRegisterMode ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>
      </div>
    `;

    overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.remove());

    overlay.querySelector('#switch-mode')?.addEventListener('click', () => {
      isRegisterMode = !isRegisterMode;
      renderForm();
    });

    const form = overlay.querySelector('#auth-form') as HTMLFormElement;
    const errorEl = overlay.querySelector('#auth-error') as HTMLElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      errorEl.textContent = '';

      const usernameInput = overlay.querySelector('#username') as HTMLInputElement;
      const passwordInput = overlay.querySelector('#password') as HTMLInputElement;

      if (isRegisterMode) {
        const emailInput = overlay.querySelector('#email') as HTMLInputElement;
        const res = authService.register(
          usernameInput.value.trim(),
          emailInput.value.trim(),
          passwordInput.value
        );

        if (!res.success) {
          errorEl.textContent = res.message || 'Ошибка регистрации';
          return;
        }
      } else {
        const res = authService.login(usernameInput.value.trim(), passwordInput.value);

        if (!res.success) {
          errorEl.textContent = res.message || 'Ошибка входа';
          return;
        }
      }

      overlay.remove();
      onStateChange();
    });
  };

  renderForm();
  document.body.appendChild(overlay);
}