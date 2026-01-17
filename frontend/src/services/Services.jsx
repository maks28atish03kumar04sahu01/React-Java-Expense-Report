import api from '../utils/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { API_BASE_PATH } from '../utils/env';

// API base path from environment variable
const BASE_URL = API_BASE_PATH;

// User Services
export const userService = {
  // Signup
  signup: async (userData) => {
    try {
      const response = await api.post(`${BASE_URL}/signup`, userData);
      if (response.status === 201) {
        const { token, id, username, useremail, userprofileImage } = response.data;
        useStore.getState().login(
          { id, username, useremail, userprofileImage },
          token
        );
        toast.success('Account created successfully!');
        return response.data;
      }
    } catch (error) {
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 409) {
          // Conflict - email already exists
          errorMessage = 'Email is already registered! Please use a different email address.';
        } else if (status === 400) {
          // Bad Request - validation errors
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data && data.message) {
            errorMessage = data.message;
          } else if (Array.isArray(data)) {
            // Handle validation error array
            errorMessage = data.join(', ');
          } else {
            errorMessage = 'Please check your input fields and try again.';
          }
        } else if (status === 500) {
          // Server error
          errorMessage = data || 'Server error. Please try again later.';
        } else {
          errorMessage = data || `Error: ${status}. Please try again.`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  // Signin
  signin: async (credentials) => {
    try {
      const response = await api.post(`${BASE_URL}/signin`, credentials);
      if (response.status === 200) {
        const { token, id, username, useremail, userprofileImage } = response.data;
        useStore.getState().login(
          { id, username, useremail, userprofileImage },
          token
        );
        toast.success('Welcome back!');
        return response.data;
      }
    } catch (error) {
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          // Unauthorized - wrong credentials
          errorMessage = data || 'Invalid email or password. Please check your credentials and try again.';
        } else if (status === 400) {
          // Bad Request - validation errors
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data && data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = 'Please check your email and password format.';
          }
        } else if (status === 500) {
          // Server error
          errorMessage = data || 'Server error. Please try again later.';
        } else {
          errorMessage = data || `Error: ${status}. Please try again.`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  },

  // Get Profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`${BASE_URL}/${userId}/getprofile`);
      return response.data;
    } catch (error) {
      const message = error.response?.data || 'Failed to fetch profile.';
      toast.error(message);
      throw error;
    }
  },

  // Update Profile
  updateProfile: async (userId, updateData) => {
    try {
      const response = await api.patch(`${BASE_URL}/${userId}/updateprofile`, updateData);
      if (response.status === 200) {
        const updatedUser = response.data;
        useStore.getState().setUser({
          id: updatedUser.userid,
          username: updatedUser.username,
          useremail: updatedUser.useremail,
          userprofileImage: updatedUser.userprofileImage,
        });
        toast.success('Profile updated successfully!');
        return updatedUser;
      }
    } catch (error) {
      const message = error.response?.data || 'Failed to update profile.';
      toast.error(message);
      throw error;
    }
  },

  // Signout
  signout: async (userId) => {
    try {
      // Try to call the signout API to blacklist the token
      if (userId) {
        await api.post(`${BASE_URL}/${userId}/signout`);
      }
      // Always logout locally, even if API call fails
      useStore.getState().logout();
      toast.success('Signed out successfully!');
    } catch (error) {
      // Even if API call fails, logout locally
      useStore.getState().logout();
      // Only show error if it's not a network/auth error
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        const message = error.response?.data || 'Signout failed.';
        toast.error(message);
      } else {
        toast.success('Signed out successfully!');
      }
      // Don't throw error - we want to logout locally anyway
    }
  },
};

// Expense Services
export const expenseService = {
  // Create Expense
  createExpense: async (userId, expenseData) => {
    try {
      const response = await api.post(`${BASE_URL}/${userId}/createexpense`, expenseData);
      if (response.status === 201) {
        useStore.getState().addExpense(response.data);
        toast.success('Expense created successfully!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data || 'Failed to create expense.';
      toast.error(message);
      throw error;
    }
  },

  // Read All Expenses
  readExpenses: async (userId) => {
    try {
      useStore.getState().setLoading(true);
      const response = await api.get(`${BASE_URL}/${userId}/readexpense`);
      if (response.status === 200) {
        useStore.getState().setExpenses(response.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data || 'Failed to fetch expenses.';
      toast.error(message);
      throw error;
    } finally {
      useStore.getState().setLoading(false);
    }
  },

  // Update Expense
  updateExpense: async (userId, expenseId, updateData) => {
    try {
      const response = await api.patch(
        `${BASE_URL}/${userId}/${expenseId}/updateexpense`,
        updateData
      );
      if (response.status === 200) {
        useStore.getState().updateExpense(expenseId, response.data);
        toast.success('Expense updated successfully!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data || 'Failed to update expense.';
      toast.error(message);
      throw error;
    }
  },

  // Delete Expense
  deleteExpense: async (userId, expenseId) => {
    try {
      const response = await api.delete(`${BASE_URL}/${userId}/${expenseId}/deleteexpense`);
      if (response.status === 200) {
        useStore.getState().removeExpense(expenseId);
        toast.success('Expense deleted successfully!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data || 'Failed to delete expense.';
      toast.error(message);
      throw error;
    }
  },
};
