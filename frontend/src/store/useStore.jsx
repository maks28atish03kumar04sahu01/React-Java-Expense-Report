import { create } from 'zustand';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const useStore = create((set) => ({
  // User state
  user: cookies.get('user') || null,
  token: cookies.get('token') || null,
  isAuthenticated: !!cookies.get('token'),

  // Expenses state
  expenses: [],
  loading: false,
  error: null,

  // User actions
  setUser: (userData) => {
    cookies.set('user', userData, { path: '/' });
    set({ user: userData, isAuthenticated: true });
  },

  setToken: (token) => {
    cookies.set('token', token, { path: '/' });
    set({ token, isAuthenticated: true });
  },

  login: (userData, token) => {
    cookies.set('user', userData, { path: '/' });
    cookies.set('token', token, { path: '/' });
    set({ user: userData, token, isAuthenticated: true });
  },

  logout: () => {
    try {
      // Remove cookies with all possible options to ensure they're deleted
      cookies.remove('token', { path: '/' });
      cookies.remove('user', { path: '/' });
      // Also try without path in case cookies were set differently
      cookies.remove('token');
      cookies.remove('user');
    } catch (error) {
      console.error('Error removing cookies:', error);
    }
    // Always update state regardless of cookie removal success
    set({ user: null, token: null, isAuthenticated: false, expenses: [] });
  },

  // Expense actions
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
  updateExpense: (expenseId, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((exp) => (exp.id === expenseId ? updatedExpense : exp)),
    })),
  removeExpense: (expenseId) =>
    set((state) => ({
      expenses: state.expenses.filter((exp) => exp.id !== expenseId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useStore;
