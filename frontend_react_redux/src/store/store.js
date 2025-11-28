/**
 * ============================================================================
 * REDUX STORE - Configuración central del estado de la aplicación
 * ============================================================================
 *
 * El Store es el corazón de Redux. Es un objeto que contiene todo el estado
 * de la aplicación y proporciona métodos para:
 *
 * 1. getState() - Obtener el estado actual
 * 2. dispatch(action) - Disparar acciones para modificar el estado
 * 3. subscribe(listener) - Suscribirse a cambios en el estado
 *
 * PRINCIPIOS DE REDUX:
 * --------------------
 * 1. ÚNICA FUENTE DE VERDAD (Single Source of Truth)
 *    Todo el estado de la aplicación se almacena en un único store.
 *    Esto hace que el estado sea predecible y fácil de debuggear.
 *
 * 2. EL ESTADO ES DE SOLO LECTURA (State is Read-Only)
 *    La única forma de cambiar el estado es disparando acciones.
 *    Las acciones son objetos planos que describen qué pasó.
 *
 * 3. LOS CAMBIOS SE HACEN CON FUNCIONES PURAS (Changes with Pure Functions)
 *    Los reducers son funciones puras que toman el estado anterior y
 *    una acción, y retornan el nuevo estado.
 *
 * ESTRUCTURA DEL ESTADO:
 * ----------------------
 * El estado de nuestra aplicación tiene esta forma:
 * {
 *   auth: {
 *     user: { email: string } | null,
 *     token: string | null,
 *     loading: boolean,
 *     error: string | null,
 *     isAuthenticated: boolean
 *   }
 * }
 *
 * A medida que la aplicación crece, podemos añadir más slices:
 * {
 *   auth: { ... },
 *   products: { ... },
 *   cart: { ... },
 *   ui: { ... }
 * }
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// ============================================================================
// CONFIGURACIÓN DEL STORE
// ============================================================================
// configureStore es la forma recomendada de crear un store en Redux Toolkit.
// Incluye automáticamente:
// - Redux DevTools Extension (para debugging en el navegador)
// - redux-thunk middleware (para acciones asíncronas)
// - Middleware de desarrollo que detecta mutaciones accidentales

const store = configureStore({
  // =========================================================================
  // REDUCERS
  // =========================================================================
  // Aquí combinamos todos los reducers de la aplicación.
  // La clave (ej: 'auth') determina cómo se accede en el estado:
  //   state.auth.user, state.auth.token, etc.
  reducer: {
    // El authReducer maneja todo el estado de autenticación
    // Todas las acciones con prefijo 'auth/' serán procesadas por este reducer
    auth: authReducer,

    // Aquí podríamos añadir más reducers:
    // products: productsReducer,
    // cart: cartReducer,
    // ui: uiReducer,
  },

  // =========================================================================
  // MIDDLEWARE (opcional)
  // =========================================================================
  // Por defecto, configureStore incluye:
  // - thunk: Para manejar acciones asíncronas
  // - serializableCheck: Detecta valores no serializables en el estado
  // - immutableCheck: Detecta mutaciones accidentales del estado
  //
  // Podemos personalizar o añadir middleware así:
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(customMiddleware),

  // =========================================================================
  // DEV TOOLS (opcional)
  // =========================================================================
  // Redux DevTools está habilitado por defecto en desarrollo.
  // Puedes deshabilitarlo en producción:
  // devTools: process.env.NODE_ENV !== 'production',
});

// ============================================================================
// EXPORTACIÓN DEL STORE
// ============================================================================
// Exportamos el store para usarlo en el Provider de React-Redux.
// El Provider hace que el store esté disponible en toda la aplicación.
export default store;
