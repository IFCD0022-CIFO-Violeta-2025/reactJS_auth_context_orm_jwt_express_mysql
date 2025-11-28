/**
 * ============================================================================
 * LOGIN PAGE - Página de inicio de sesión con Redux
 * ============================================================================
 *
 * Esta página maneja el formulario de login e integra con Redux para
 * gestionar el estado de autenticación.
 *
 * HOOKS DE REACT-REDUX:
 * ---------------------
 * - useSelector: Para leer datos del store
 * - useDispatch: Para disparar acciones que modifican el store
 *
 * FLUJO DE AUTENTICACIÓN:
 * -----------------------
 * 1. Usuario completa el formulario
 * 2. Al enviar, se dispara loginStart() (loading = true)
 * 3. Se llama al servicio API
 * 4. Si éxito: loginSuccess({ token, email })
 * 5. Si error: loginFailure(mensaje)
 * 6. El componente reacciona a los cambios en el store
 *
 * COMPARACIÓN CON CONTEXT:
 * ------------------------
 * Con Context teníamos:
 *   const { login } = useUser();
 *
 * Con Redux tenemos:
 *   const dispatch = useDispatch();
 *   dispatch(loginSuccess({ token, email }));
 *
 * La diferencia principal es que Redux hace explícito el flujo de datos
 * mediante acciones, mientras que Context encapsula la lógica en el provider.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Importamos acciones y selectores desde el barrel export
import {
  loginStart,
  loginSuccess,
  loginFailure,
  selectLoading,
  selectError,
} from '../store';

// Servicio para llamadas al backend
import { authService } from '../services/api';

const Login = () => {
  // =========================================================================
  // ESTADO LOCAL DEL FORMULARIO
  // =========================================================================
  // Usamos useState para el estado del formulario porque:
  // 1. Es efímero (no necesita persistir)
  // 2. Solo lo usa este componente
  // 3. No afecta a otros componentes
  //
  // Regla general: Estado local para UI, Redux para estado compartido.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // =========================================================================
  // HOOKS DE REDUX
  // =========================================================================

  // useDispatch retorna la función dispatch del store
  // La usamos para enviar acciones que modifican el estado
  const dispatch = useDispatch();

  // useSelector extrae datos del store de Redux
  // Se re-renderiza automáticamente cuando estos valores cambian
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // =========================================================================
  // HOOK DE REACT ROUTER
  // =========================================================================
  // Para navegación programática después del login exitoso
  const navigate = useNavigate();

  // =========================================================================
  // MANEJADOR DEL FORMULARIO
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // PASO 1: Indicar que comenzó el proceso de login
    // Esto pone loading=true y limpia errores anteriores
    dispatch(loginStart());

    try {
      // PASO 2: Llamar al servicio de autenticación
      const response = await authService.signin(email, password);

      // PASO 3: Si todo sale bien, guardar el token y usuario en Redux
      // El reducer loginSuccess actualizará:
      // - token: response.data.accessToken
      // - user: { email }
      // - isAuthenticated: true
      // - loading: false
      dispatch(loginSuccess({
        token: response.data.accessToken,
        email: email,
      }));

      // PASO 4: Navegar al dashboard
      navigate('/dashboard');

    } catch (err) {
      // PASO 3 (alternativo): Si hay error, guardarlo en Redux
      // El reducer loginFailure actualizará:
      // - error: mensaje de error
      // - loading: false
      dispatch(loginFailure(
        err.response?.data?.message || 'Error al iniciar sesión'
      ));
    }
  };

  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        {/* Campo de email */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Mensaje de error - viene del store de Redux */}
        {error && <p className="error">{error}</p>}

        {/* Botón de submit - deshabilitado mientras carga */}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>

      {/* Link a registro */}
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default Login;
