/**
 * ============================================================================
 * AUTH SLICE - Gestión del estado de autenticación con Redux Toolkit
 * ============================================================================
 *
 * Este archivo define un "slice" de Redux para manejar toda la lógica
 * relacionada con la autenticación del usuario.
 *
 * ¿QUÉ ES UN SLICE?
 * -----------------
 * Un slice es una porción del estado global de Redux que agrupa:
 * - Estado inicial (initialState)
 * - Reducers (funciones que modifican el estado)
 * - Actions (acciones que disparan los reducers)
 *
 * Redux Toolkit simplifica enormemente la creación de slices mediante
 * createSlice(), que genera automáticamente los action creators y
 * permite escribir lógica "mutativa" gracias a Immer.
 *
 * FLUJO DE DATOS EN REDUX:
 * ------------------------
 * 1. El usuario interactúa (ej: click en "Login")
 * 2. Se dispara una acción (dispatch(login(payload)))
 * 3. El reducer procesa la acción y actualiza el estado
 * 4. Los componentes suscritos se re-renderizan con el nuevo estado
 */

import { createSlice } from '@reduxjs/toolkit';

// ============================================================================
// UTILIDADES PARA MANEJO DE COOKIES
// ============================================================================
// Las cookies nos permiten persistir el token de autenticación entre sesiones
// del navegador, a diferencia de localStorage que puede ser más vulnerable a XSS.

/**
 * Establece una cookie en el navegador
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor a almacenar
 * @param {number} days - Días de expiración (default: 1)
 */
const setCookie = (name, value, days = 1) => {
  // Calculamos la fecha de expiración
  // 864e5 = 86400000 milisegundos = 24 horas
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  // Configuramos la cookie con opciones de seguridad:
  // - path=/: Disponible en toda la aplicación
  // - SameSite=Strict: Protección contra CSRF
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

/**
 * Obtiene el valor de una cookie por su nombre
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} - Valor de la cookie o null si no existe
 */
const getCookie = (name) => {
  // document.cookie devuelve todas las cookies como "nombre1=valor1; nombre2=valor2"
  const value = document.cookie
    .split('; ')                              // Separamos cada cookie
    .find(row => row.startsWith(`${name}=`)); // Buscamos la que coincide

  // Si existe, decodificamos y retornamos el valor después del "="
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

/**
 * Elimina una cookie estableciendo su fecha de expiración en el pasado
 * @param {string} name - Nombre de la cookie a eliminar
 */
const deleteCookie = (name) => {
  // Al establecer una fecha pasada, el navegador elimina la cookie automáticamente
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// ============================================================================
// ESTADO INICIAL
// ============================================================================
// Define la estructura inicial del estado de autenticación.
// Este estado se hidrata con el token de las cookies si existe.

const initialState = {
  // Usuario autenticado (null si no está logueado)
  user: null,

  // Token JWT para autenticación en el backend
  // Intentamos recuperarlo de las cookies al cargar la aplicación
  token: getCookie('token'),

  // Indica si estamos verificando el estado de autenticación
  // Útil para mostrar spinners de carga
  loading: false,

  // Almacena mensajes de error para mostrar al usuario
  error: null,

  // Propiedad computada que indica si hay un usuario autenticado
  // Se calcula basándose en la existencia del token
  isAuthenticated: !!getCookie('token'),
};

// ============================================================================
// CREACIÓN DEL SLICE
// ============================================================================
// createSlice es la función principal de Redux Toolkit que genera
// automáticamente actions y reducers.

const authSlice = createSlice({
  // Nombre único del slice - se usa como prefijo en los action types
  // Ejemplo: 'auth/login', 'auth/logout'
  name: 'auth',

  // Estado inicial definido arriba
  initialState,

  // =========================================================================
  // REDUCERS
  // =========================================================================
  // Los reducers son funciones puras que reciben el estado actual y una
  // acción, y retornan el nuevo estado.
  //
  // IMPORTANTE: Gracias a Immer (incluido en Redux Toolkit), podemos
  // escribir código que "parece" mutar el estado directamente, pero
  // internamente se crea una copia inmutable.
  //
  // Sin Immer tendríamos que escribir:
  //   return { ...state, user: action.payload }
  //
  // Con Immer podemos escribir:
  //   state.user = action.payload

  reducers: {
    // -----------------------------------------------------------------------
    // LOGIN START - Indica que comenzó el proceso de login
    // -----------------------------------------------------------------------
    // Se dispara antes de hacer la petición al servidor.
    // Establece loading=true para mostrar indicadores de carga.
    loginStart: (state) => {
      state.loading = true;  // Activamos el indicador de carga
      state.error = null;    // Limpiamos errores anteriores
    },

    // -----------------------------------------------------------------------
    // LOGIN SUCCESS - El login fue exitoso
    // -----------------------------------------------------------------------
    // Se dispara cuando el servidor responde con el token y datos del usuario.
    // Actualiza el estado con la información del usuario autenticado.
    loginSuccess: (state, action) => {
      // action.payload contiene: { token: string, email: string }
      state.loading = false;                    // Desactivamos carga
      state.user = { email: action.payload.email };  // Guardamos datos del usuario
      state.token = action.payload.token;       // Guardamos el token
      state.isAuthenticated = true;             // Marcamos como autenticado
      state.error = null;                       // Limpiamos errores

      // Persistimos el token en cookies para mantener la sesión
      setCookie('token', action.payload.token);
    },

    // -----------------------------------------------------------------------
    // LOGIN FAILURE - El login falló
    // -----------------------------------------------------------------------
    // Se dispara cuando hay un error en la autenticación.
    // Guarda el mensaje de error para mostrarlo al usuario.
    loginFailure: (state, action) => {
      state.loading = false;          // Desactivamos carga
      state.error = action.payload;   // Guardamos el mensaje de error
      state.user = null;              // Aseguramos que no hay usuario
      state.token = null;             // Limpiamos el token
      state.isAuthenticated = false;  // No está autenticado
    },

    // -----------------------------------------------------------------------
    // LOGOUT - Cerrar sesión
    // -----------------------------------------------------------------------
    // Limpia todo el estado de autenticación y elimina el token de cookies.
    logout: (state) => {
      state.user = null;              // Eliminamos datos del usuario
      state.token = null;             // Eliminamos el token
      state.isAuthenticated = false;  // Ya no está autenticado
      state.error = null;             // Limpiamos errores
      state.loading = false;          // Aseguramos que loading está en false

      // Eliminamos el token de las cookies
      deleteCookie('token');
    },

    // -----------------------------------------------------------------------
    // CLEAR ERROR - Limpiar mensaje de error
    // -----------------------------------------------------------------------
    // Útil para limpiar el error cuando el usuario comienza a escribir
    // o navega a otra página.
    clearError: (state) => {
      state.error = null;
    },

    // -----------------------------------------------------------------------
    // SET LOADING - Controlar estado de carga manualmente
    // -----------------------------------------------------------------------
    // Permite controlar el estado de carga desde fuera del slice.
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// ============================================================================
// EXPORTACIONES
// ============================================================================

// Exportamos los action creators generados automáticamente.
// Cada reducer genera un action creator con el mismo nombre.
//
// Uso en componentes:
//   import { login, logout } from './authSlice';
//   dispatch(loginStart());
//   dispatch(loginSuccess({ token: 'xxx', email: 'user@example.com' }));
//   dispatch(logout());
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setLoading,
} = authSlice.actions;

// ============================================================================
// SELECTORES
// ============================================================================
// Los selectores son funciones que extraen datos específicos del estado.
// Permiten encapsular la estructura del estado y facilitan la reutilización.
//
// Uso en componentes:
//   const user = useSelector(selectUser);
//   const isAuth = useSelector(selectIsAuthenticated);

// Selector para obtener el usuario actual
export const selectUser = (state) => state.auth.user;

// Selector para verificar si está autenticado
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Selector para obtener el token
export const selectToken = (state) => state.auth.token;

// Selector para obtener el estado de carga
export const selectLoading = (state) => state.auth.loading;

// Selector para obtener el error actual
export const selectError = (state) => state.auth.error;

// Exportamos el reducer para añadirlo al store
// El reducer es la función que procesa todas las acciones del slice
export default authSlice.reducer;
