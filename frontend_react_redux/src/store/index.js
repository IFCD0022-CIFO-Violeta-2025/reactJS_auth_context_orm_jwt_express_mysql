/**
 * ============================================================================
 * STORE INDEX - Punto de entrada centralizado para el store
 * ============================================================================
 *
 * Este archivo actúa como barrel export (exportación barril) para todo
 * lo relacionado con Redux en nuestra aplicación.
 *
 * VENTAJAS DEL BARREL EXPORT:
 * ---------------------------
 * 1. Imports más limpios:
 *    En lugar de:
 *      import store from './store/store';
 *      import { login, logout } from './store/authSlice';
 *      import { selectUser } from './store/authSlice';
 *
 *    Podemos hacer:
 *      import { store, login, logout, selectUser } from './store';
 *
 * 2. Mejor encapsulación:
 *    Podemos reorganizar la estructura interna sin afectar los imports.
 *
 * 3. Punto único de exportación:
 *    Facilita el mantenimiento y la documentación.
 */

// Exportamos el store configurado
export { default as store } from './store';

// Exportamos todas las acciones y selectores del slice de autenticación
export {
  // Actions (Action Creators)
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setLoading,
  // Selectores
  selectUser,
  selectIsAuthenticated,
  selectToken,
  selectLoading,
  selectError,
} from './authSlice';
