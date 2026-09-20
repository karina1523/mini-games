import './tic-tac-toe.scss';
import { authService } from '../../services/auth-service';

export function createTicTacToePage(onNavigate: (path: string) => void, onStateChange: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'tictactoe-page';

  let board = Array(9).fill(null);
  let isXTurn = true; // true — Крестики (X), false — Нолики (O)
  let gameActive = false;
  let gameMode: 'bot' | 'friend' | null = null; // Выбранный режим

  container.innerHTML = `
    <div class="game-header">
      <button class="btn btn--secondary" id="back-to-games">← Назад к играм</button>
      <h1>Крестики-Нолики</h1>
      <div class="game-score-info">Рекорд: <span id="user-score">0</span> очков</div>
    </div>

    <!-- Меню выбора режима -->
    <div class="mode-selector" id="mode-selector">
      <h2>Выбери режим игры</h2>
      <div class="mode-buttons">
        <button class="btn btn--primary" id="mode-bot">🤖 Против бота</button>
        <button class="btn btn--secondary" id="mode-friend">👥 С другом (на одном экране)</button>
      </div>
    </div>

    <!-- Игровое поле (скрыто до выбора режима) -->
    <div class="game-container" id="game-container" style="display: none;">
      <div class="game-status" id="game-status">Ходят Крестики (X)</div>
      
      <div class="tictactoe-board" id="board">
        ${board.map((_, index) => `<div class="cell" data-index="${index}"></div>`).join('')}
      </div>

      <div class="game-actions">
        <button class="btn btn--secondary" id="change-mode-btn">Сменить режим</button>
        <button class="btn btn--primary" id="restart-btn" style="display: none;">Сыграть еще раз</button>
      </div>
    </div>
  `;

  // Обновляем отображение текущих очков в шапке
  const currentUser = authService.getCurrentUser();
  const scoreSpan = container.querySelector('#user-score');
  if (currentUser && scoreSpan) {
    scoreSpan.textContent = String(currentUser.highScore || 0);
  }

  // Кнопка возврата в каталог
  container.querySelector('#back-to-games')?.addEventListener('click', () => {
    onNavigate('/games');
  });

  const modeSelector = container.querySelector('#mode-selector') as HTMLElement;
  const gameContainer = container.querySelector('#game-container') as HTMLElement;
  const statusDisplay = container.querySelector('#game-status') as HTMLElement;
  const restartBtn = container.querySelector('#restart-btn') as HTMLButtonElement;
  const changeModeBtn = container.querySelector('#change-mode-btn') as HTMLButtonElement;
  const cells = container.querySelectorAll('.cell');

  // Выбор режима: против бота
  container.querySelector('#mode-bot')?.addEventListener('click', () => {
    gameMode = 'bot';
    startNewGame();
  });

  // Выбор режима: с другом
  container.querySelector('#mode-friend')?.addEventListener('click', () => {
    gameMode = 'friend';
    startNewGame();
  });

  // Смена режима
  changeModeBtn?.addEventListener('click', () => {
    gameContainer.style.display = 'none';
    modeSelector.style.display = 'flex';
  });

  function startNewGame() {
    board = Array(9).fill(null);
    gameActive = true;
    isXTurn = true;
    statusDisplay.textContent = gameMode === 'bot' ? 'Твой ход (X)! Бот играет за O.' : 'Ход игрока: Крестики (X)';
    statusDisplay.classList.remove('win');
    restartBtn.style.display = 'none';

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.classList.remove('x', 'o');
    });

    modeSelector.style.display = 'none';
    gameContainer.style.display = 'flex';
  }

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function checkWin(): string | null {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'draw';
  }

  function handleCellClick(e: Event) {
    if (!gameActive) return;
    const target = e.target as HTMLElement;
    const index = Number(target.getAttribute('data-index'));

    if (board[index] !== null) return;

    // Ход текущего игрока
    const currentPlayer = isXTurn ? 'X' : 'O';
    board[index] = currentPlayer;
    target.textContent = currentPlayer;
    target.classList.add(currentPlayer.toLowerCase());

    const result = checkWin();
    if (result) {
      endGame(result);
      return;
    }

    // Смена хода
    isXTurn = !isXTurn;

    if (gameMode === 'friend') {
      statusDisplay.textContent = `Ход игрока: ${isXTurn ? 'Крестики (X)' : 'Нолики (O'}`;
    }

    // Если режим бота и сейчас ходит бот (O)
    if (gameMode === 'bot' && !isXTurn && gameActive) {
      statusDisplay.textContent = 'Компьютер думает...';
      
      setTimeout(() => {
        if (!gameActive) return;

        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null) as number[];

        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          board[randomIndex] = 'O';
          
          const botCell = cells[randomIndex];
          botCell.textContent = 'O';
          botCell.classList.add('o');

          const botResult = checkWin();
          if (botResult) {
            endGame(botResult);
            return;
          }
        }

        isXTurn = true;
        statusDisplay.textContent = 'Твой ход (X)!';
      }, 400);
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });

  function endGame(result: string) {
    gameActive = false;
    restartBtn.style.display = 'block';

    if (result === 'X') {
      statusDisplay.textContent = '🎉 Победили Крестики (X)! +10 очков';
      statusDisplay.classList.add('win');

      // Получаем текущего пользователя и считаем новый результат
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const newScore = (currentUser.highScore || 0) + 10;
        
        // Вызываем правильный метод из твоего authService!
        authService.updateScore(newScore);

        // Обновляем цифру на экране игры
        const freshUser = authService.getCurrentUser();
        if (scoreSpan && freshUser) {
          scoreSpan.textContent = String(freshUser.highScore);
        }
        
        onStateChange(); // Обновляем шапку / общий стейт приложения
      }
    } else if (result === 'O') {
      statusDisplay.textContent = gameMode === 'bot' ? '🤖 Бот победил! Попробуй еще раз.' : '🎉 Победили Нолики (O)!';
      statusDisplay.classList.add('win');
    } else {
      statusDisplay.textContent = '🤝 Ничья!';
    }
  }

  restartBtn.addEventListener('click', startNewGame);

  return container;
}