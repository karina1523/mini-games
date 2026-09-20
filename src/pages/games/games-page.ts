import './games-page.scss';
import { authService } from '../../services/auth-service';
import { openAuthModal } from '../../components/auth-dialog/auth-dialog';

export function createGamesPage(onNavigate: (path: string) => void, onStateChange: () => void): HTMLElement {
  const page = document.createElement('div');
  page.className = 'games-page';

  page.innerHTML = `
    <h1 class="games-title">Каталог игр</h1>
    <div class="games-grid">
      
      <!-- Крестики-нолики (Активная игра) -->
      <div class="game-card">
        <div class="game-card__icon">❌⭕</div>
        <h3>Крестики-Нолики</h3>
        <p>Классическая игра на логику и внимание. Сыграй против друга или бота!</p>
        <button class="btn btn--primary" id="play-tic-tac-toe">Играть</button>
      </div>

      <!-- Змейка (В разработке) -->
      <div class="game-card game-card--disabled">
        <div class="game-card__icon">🐍</div>
        <h3>Змейка</h3>
        <p>Собирай еду, вырастай и не врезайся в стены.</p>
        <button class="btn btn--disabled" disabled>В разработке</button>
      </div>

      <!-- Memory Match (В разработке) -->
      <div class="game-card game-card--disabled">
        <div class="game-card__icon">🧠</div>
        <h3>Memory Match</h3>
        <p>Тренируй память: найди все пары карточек.</p>
        <button class="btn btn--disabled" disabled>В разработке</button>
      </div>

      <!-- Clicker Hero (В разработке) -->
      <div class="game-card game-card--disabled">
        <div class="game-card__icon">⚡</div>
        <h3>Clicker Hero</h3>
        <p>Быстро кликай по мишеням и зарабатывай очки.</p>
        <button class="btn btn--disabled" disabled>В разработке</button>
      </div>

    </div>
  `;

  // Обработка клика по кнопке «Играть» для крестиков-ноликов
  const playBtn = page.querySelector('#play-tic-tac-toe');
  playBtn?.addEventListener('click', () => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      openAuthModal(onStateChange, 'Зарегистрируйтесь или войдите, чтобы играть!');
      return;
    }

    // Переходим на страницу/роут крестиков-ноликов
    onNavigate('/games/tic-tac-toe');
  });

  return page;
}