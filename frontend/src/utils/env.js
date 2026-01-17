/**
 * Environment Variables Configuration
 * 
 * This file centralizes all environment variable access.
 * In Vite, environment variables must be prefixed with VITE_ to be accessible.
 * 
 * Usage:
 *   import { API_BASE_URL, API_BASE_PATH, FRONTEND_BASE_PATH } from '../utils/env';
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://expense-backend-ygjj.onrender.com';
export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/expense/backend/api/v1';
export const FRONTEND_BASE_PATH = import.meta.env.VITE_FRONTEND_BASE_PATH || '/expense/frontend/api/v1';

// Development mode check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Environment name
export const env = import.meta.env.MODE || 'development';
