export class Router {
  private routes: Record<string, () => HTMLElement> = {};

  public addRoute(path: string, renderPage: () => HTMLElement): void {
    this.routes[path] = renderPage;
  }

  public init(): void {
    window.addEventListener('popstate', () => this.render());

    // Перехватываем клики по ссылкам <a> для SPA-навигации
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const path = link.getAttribute('href') || '/';
        this.navigate(path);
      }
    });

    this.render();
  }

  public navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.render();
  }

  private render(): void {
    const container = document.getElementById('page-content') || document.getElementById('app');
    if (!container) return;

    const path = window.location.pathname;
    const renderPage = this.routes[path] || this.routes['/'];

    container.innerHTML = '';
    if (renderPage) {
      container.appendChild(renderPage());
    }
  }
}