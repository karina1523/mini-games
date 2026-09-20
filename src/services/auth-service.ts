export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  highScore: number;
}

const USERS_KEY = 'mini_games_users';
const CURRENT_USER_KEY = 'mini_games_current_user';

export const authService = {
  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    const user: User = JSON.parse(data);
    
    // Защита от undefined
    return {
      ...user,
      highScore: user.highScore ?? 0,
    };
  },

  register(username: string, email: string, password: string): { success: boolean; message?: string } {
    const users = this.getUsers();

    if (username.length < 3) return { success: false, message: 'Имя пользователя должно быть от 3 символов' };
    if (password.length < 6) return { success: false, message: 'Пароль должен быть от 6 символов' };

    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Имя пользователя уже занято' };
    }

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email уже зарегистрирован' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      highScore: 0,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));

    return { success: true };
  },

  login(loginValue: string, password: string): { success: boolean; message?: string } {
    const users = this.getUsers();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === loginValue.toLowerCase() || u.email.toLowerCase() === loginValue.toLowerCase()) &&
        u.password === password
    );

    if (!user) return { success: false, message: 'Неверный логин/email или пароль' };

    const { password: _, ...userWithoutPass } = user;
    userWithoutPass.highScore = userWithoutPass.highScore ?? 0;
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
    return { success: true };
  },

  updateScore(newScore: number): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    if (newScore > currentUser.highScore) {
      currentUser.highScore = newScore;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      const users = this.getUsers();
      const index = users.findIndex((u) => u.id === currentUser.id);
      if (index !== -1) {
        users[index].highScore = newScore;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  deleteAccount(): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    let users = this.getUsers();
    users = users.filter((u) => u.id !== currentUser.id);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.logout();
  },
};