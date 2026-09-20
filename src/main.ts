import './styles/main.scss';
import { createHeader } from './components/header/header';
import { createHomePage } from './pages/home/home-page';
import { createGamesPage } from './pages/games/games-page';
import { createAboutPage } from './pages/about/about-page';
import { createProfilePage } from './pages/profile/profile-page';
import { createTicTacToePage } from './pages/tic-tac-toe/tic-tac-toe.ts'; 

// Импортируй твои компоненты/страницы самих игр:
// import { createClickerGame } from './games/clicker/clicker';

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  renderApp();
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';
  const currentPath = window.location.pathname;

  // Хедер
  const header = createHeader(currentPath, navigateTo, renderApp);
  app.appendChild(header);

  const mainContent = document.createElement('main');
  mainContent.className = 'main-container';

  // Маршрутизация
  // Маршрутизация
  if (currentPath === '/') {
    mainContent.appendChild(createHomePage(navigateTo, renderApp));
  } else if (currentPath === '/games') {
    mainContent.appendChild(createGamesPage(navigateTo, renderApp));
  } else if (currentPath === '/about') {
    mainContent.appendChild(createAboutPage());
  } else if (currentPath === '/profile') {
    mainContent.appendChild(createProfilePage(navigateTo, renderApp));
  } else if (currentPath === '/games/tic-tac-toe') {
    // 2. Вот сюда подставится твоя игра при клике на кнопку «Играть»
    mainContent.appendChild(createTicTacToePage(navigateTo, renderApp));
  } else {
    mainContent.appendChild(createHomePage(navigateTo, renderApp));
  }



  app.appendChild(mainContent);
}

window.addEventListener('popstate', renderApp);
document.addEventListener('DOMContentLoaded', renderApp);