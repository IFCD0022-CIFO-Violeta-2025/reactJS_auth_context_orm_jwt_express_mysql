/**
 * ============================================================================
 * DASHBOARD PAGE - Página principal del usuario autenticado
 * ============================================================================
 *
 * Esta página es accesible solo para usuarios autenticados.
 * Muestra información del usuario y permite cerrar sesión.
 *
 * INTEGRACIÓN CON REDUX:
 * ----------------------
 * Este componente demuestra cómo:
 * 1. Leer datos del usuario desde el store (useSelector)
 * 2. Disparar acciones como logout (useDispatch)
 *
 * PATRÓN DE USO DE SELECTORES:
 * ----------------------------
 * En lugar de:
 *   const auth = useSelector(state => state.auth);
 *   const email = auth.user.email;
 *
 * Usamos selectores específicos:
 *   const user = useSelector(selectUser);
 *   const email = user.email;
 *
 * Esto hace el código más mantenible y evita re-renders innecesarios.
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Importamos acciones y selectores del store
import { logout, selectUser } from '../store';

// Servicio para llamadas al backend
import { authService } from '../services/api';

const Dashboard = () => {
  // =========================================================================
  // ESTADO LOCAL
  // =========================================================================
  // El mensaje protegido y su estado de carga son locales porque:
  // - Solo este componente los usa
  // - Son efímeros (no necesitan persistir)
  // - Si otros componentes necesitaran estos datos, los moveríamos a Redux
  const [protectedMessage, setProtectedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================================================================
  // HOOKS DE REDUX
  // =========================================================================

  // useDispatch nos da acceso a la función dispatch para enviar acciones
  const dispatch = useDispatch();

  // useSelector extrae el usuario del store
  // Se re-renderiza automáticamente cuando user cambia
  const user = useSelector(selectUser);

  // =========================================================================
  // HOOK DE REACT ROUTER
  // =========================================================================
  const navigate = useNavigate();

  // =========================================================================
  // FUNCIÓN PARA OBTENER DATOS PROTEGIDOS
  // =========================================================================
  const fetchProtectedData = async () => {
    setLoading(true);
    try {
      // Llamamos al endpoint protegido
      // El token se incluye automáticamente en los headers (ver api.js)
      const response = await authService.getProtected();
      setProtectedMessage(response.data.message);
    } catch (err) {
      setProtectedMessage('Error al obtener datos protegidos');
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // EFECTO PARA CARGAR DATOS AL MONTAR
  // =========================================================================
  // useEffect con array vacío se ejecuta solo al montar el componente
  useEffect(() => {
    fetchProtectedData();
  }, []);

  // =========================================================================
  // MANEJADOR DE LOGOUT
  // =========================================================================
  const handleLogout = () => {
    // Disparamos la acción de logout
    // Esto actualizará el store:
    // - user: null
    // - token: null
    // - isAuthenticated: false
    // Y eliminará el token de las cookies
    dispatch(logout());

    // Navegamos al login
    navigate('/login');
  };

  // =========================================================================
  // RENDERIZADO
  // =========================================================================
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Mostramos el email del usuario desde Redux */}
      <p>Bienvenido, {user?.email}</p>

      {/* Sección de datos protegidos */}
      <div className="protected-section">
        <h3>Datos Protegidos:</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <p>{protectedMessage}</p>
        )}
        <button onClick={fetchProtectedData}>Recargar</button>
      </div>

      {/* Botón de logout */}
      <button onClick={handleLogout} className="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
