/**
 * ============================================================================
 * REGISTER PAGE - Página de registro de usuarios
 * ============================================================================
 *
 * Esta página maneja el formulario de registro. A diferencia del login,
 * el registro no modifica directamente el estado de autenticación en Redux.
 *
 * FLUJO DE REGISTRO:
 * ------------------
 * 1. Usuario completa el formulario
 * 2. Se envía al backend (sin usar Redux para esta operación)
 * 3. Si éxito: Redirige al login
 * 4. Si error: Muestra mensaje de error (estado local)
 *
 * ¿POR QUÉ NO USAMOS REDUX AQUÍ?
 * ------------------------------
 * El registro es una operación puntual que:
 * - No afecta el estado global de la aplicación
 * - No necesita persistir después de completarse
 * - Solo interesa a este componente
 *
 * Por eso usamos estado local (useState) en lugar de Redux.
 *
 * CUÁNDO USAR REDUX VS ESTADO LOCAL:
 * -----------------------------------
 * USA REDUX cuando:
 * - Múltiples componentes necesitan los datos
 * - El estado debe persistir entre navegaciones
 * - El estado representa algo "importante" de la app
 *
 * USA ESTADO LOCAL cuando:
 * - Solo un componente usa los datos
 * - Es estado efímero de UI (modales, formularios)
 * - No afecta a otros componentes
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Register = () => {
  // =========================================================================
  // ESTADO LOCAL
  // =========================================================================
  // Todo el estado del formulario es local porque:
  // 1. Solo este componente lo necesita
  // 2. Se reinicia al desmontar el componente
  // 3. No afecta a otros componentes de la aplicación
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook para navegación programática
  const navigate = useNavigate();

  // =========================================================================
  // MANEJADOR DEL FORMULARIO
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');       // Limpiamos errores anteriores
    setLoading(true);   // Indicamos que está cargando

    try {
      // Llamamos al servicio de registro
      await authService.signup(username, email, password);

      // Si todo sale bien, redirigimos al login
      // El usuario deberá iniciar sesión con sus nuevas credenciales
      navigate('/login');

    } catch (err) {
      // Si hay error, lo mostramos al usuario
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      // Siempre desactivamos el loading al terminar
      setLoading(false);
    }
  };

  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  return (
    <div className="auth-container">
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        {/* Campo de nombre de usuario */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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

        {/* Mensaje de error - estado local, no Redux */}
        {error && <p className="error">{error}</p>}

        {/* Botón de submit */}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>

      {/* Link a login */}
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
