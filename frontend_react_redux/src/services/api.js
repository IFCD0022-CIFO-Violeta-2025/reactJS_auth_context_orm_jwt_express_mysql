/**
 * ============================================================================
 * API SERVICE - Servicios de comunicación con el backend
 * ============================================================================
 *
 * Este archivo contiene todas las funciones para comunicarse con el backend.
 * Centralizar las llamadas API tiene varias ventajas:
 *
 * 1. Reutilización: Las mismas funciones se pueden usar en cualquier componente
 * 2. Mantenibilidad: Si cambia la API, solo hay que modificar un archivo
 * 3. Consistencia: Todas las peticiones siguen el mismo patrón
 * 4. Testabilidad: Fácil de mockear en tests
 *
 * INTEGRACIÓN CON REDUX:
 * ----------------------
 * Este servicio es independiente de Redux. Los componentes o thunks
 * llaman a estas funciones y luego disparan acciones de Redux
 * basándose en las respuestas.
 *
 * Flujo típico:
 * 1. Componente dispara loginStart()
 * 2. Componente llama a authService.signin()
 * 3. Si éxito: dispara loginSuccess(response)
 * 4. Si error: dispara loginFailure(error)
 */

// URL base del backend - en producción usaríamos variables de entorno
const BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Obtiene el valor de una cookie por su nombre
 * Necesaria para incluir el token en las peticiones autenticadas
 */
const getCookie = (name) => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

/**
 * Genera los headers HTTP para las peticiones
 * Incluye automáticamente el token de autenticación si existe
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Si hay un token en las cookies, lo añadimos al header Authorization
  // El formato Bearer es el estándar para JWT
  const token = getCookie('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Procesa la respuesta del servidor
 * Convierte a JSON y maneja errores de forma consistente
 */
const handleResponse = async (response) => {
  const data = await response.json();

  // Si la respuesta no es exitosa (status >= 400), lanzamos un error
  if (!response.ok) {
    const error = new Error(data.message || 'Error en la petición');
    error.response = { data, status: response.status };
    throw error;
  }

  // Envolvemos la data en un objeto para consistencia con axios
  return { data };
};

/**
 * ============================================================================
 * AUTH SERVICE - Servicios de autenticación
 * ============================================================================
 */
export const authService = {
  /**
   * Registro de nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Respuesta del servidor
   */
  signup: async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  /**
   * Inicio de sesión
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Respuesta con token y datos del usuario
   */
  signin: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  /**
   * Obtiene datos de un endpoint protegido
   * Requiere que el usuario esté autenticado
   * @returns {Promise} - Datos protegidos del servidor
   */
  getProtected: async () => {
    const response = await fetch(`${BASE_URL}/protected`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
