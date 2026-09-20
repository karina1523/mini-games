import './profile-page.scss';
import { authService } from '../../services/auth-service';

export function createProfilePage(onNavigate: (path: string) => void, onStateChange: () => void): HTMLElement {
  const page = document.createElement('div');
  page.className = 'profile-page';

  const user = authService.getCurrentUser();

  if (!user) {
    page.innerHTML = `
      <div class="profile-card">
        <h2>Доступ ограничен</h2>
        <p>Пожалуйста, войдите в аккаунт, чтобы просмотреть профиль.</p>
        <button id="btn-to-home" class="btn btn--primary">На главную</button>
      </div>
    `;
    page.querySelector('#btn-to-home')?.addEventListener('click', () => onNavigate('/'));
    return page;
  }

  // Берём рекорд из highScore или score, а если их нет — ставим 0
 const userScore = user.highScore ?? 0;
 
  page.innerHTML = `
    <div class="profile-card">
      <button class="profile-card__close" id="btn-close-profile" aria-label="Закрыть">✕</button>
      
      <div class="profile-avatar">👤</div>
      <h2 class="profile-title">Личный кабинет</h2>
      
      <div class="profile-info">
        <p><strong>Логин:</strong> ${user.username}</p>
        <div class="profile-score">
          <span>Ваш рекорд:</span>
          <strong>${userScore} очков</strong>
        </div>
      </div>

      <div class="profile-actions">
        <button id="btn-logout" class="btn btn--secondary">Выйти из аккаунта</button>
        <button id="btn-delete" class="btn btn--danger">Удалить аккаунт</button>
      </div>
    </div>
  `;

  page.querySelector('#btn-close-profile')?.addEventListener('click', () => {
    onNavigate('/');
  });

  page.querySelector('#btn-logout')?.addEventListener('click', () => {
    authService.logout();
    onStateChange();
    onNavigate('/');
  });

  page.querySelector('#btn-delete')?.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      authService.deleteAccount();
      onStateChange();
      onNavigate('/');
    }
  });

  return page;
}