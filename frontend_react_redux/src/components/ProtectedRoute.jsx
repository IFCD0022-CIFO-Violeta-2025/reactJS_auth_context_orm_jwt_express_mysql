/**
 * ============================================================================
 * PROTECTED ROUTE - Componente de ruta protegida con Redux
 * ============================================================================
 *
 * Este componente actúa como un "guardián" que protege rutas que requieren
 * autenticación. Si el usuario no está autenticado, lo redirige al login.
 *
 * INTEGRACIÓN CON REDUX:
 * ----------------------
 * A diferencia de la versión con Context, aquí usamos useSelector para
 * obtener el estado de autenticación directamente del store de Redux.
 *
 * useSelector es un hook de React-Redux que:
 * 1. Extrae datos del store usando una función selectora
 * 2. Se suscribe automáticamente a cambios en esos datos
 * 3. Re-renderiza el componente cuando los datos cambian
 *
 * PATRÓN DE SELECTORES:
 * ---------------------
 * En lugar de acceder al estado directamente (state.auth.isAuthenticated),
 * usamos selectores importados del slice. Esto tiene ventajas:
 *
 * 1. Encapsulación: Si cambia la estructura del estado, solo hay que
 *    modificar los selectores, no todos los componentes
 *
 * 2. Reutilización: El mismo selector se usa en toda la aplicación
 *
 * 3. Memoización: Se pueden usar selectores memoizados con createSelector
 *    para evitar recálculos innecesarios (ver Reselect)
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectLoading } from '../store';

/**
 * Componente que protege rutas que requieren autenticación
 * @param {object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  // =========================================================================
  // ACCESO AL ESTADO DE REDUX
  // =========================================================================
  // useSelector recibe una función que selecciona la parte del estado que necesitamos.
  // React-Redux optimiza automáticamente los re-renders: solo se re-renderiza
  // cuando el valor seleccionado cambia (comparación por referencia).

  // Verificamos si el usuario está autenticado
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Verificamos si estamos cargando (ej: verificando token inicial)
  const loading = useSelector(selectLoading);

  // =========================================================================
  // RENDERIZADO CONDICIONAL
  // =========================================================================

  // Mientras se verifica la autenticación, mostramos un loading
  // Esto evita redirecciones prematuras al login
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigimos al login
  // Navigate es el componente de React Router para redirecciones programáticas
  // replace evita que la ruta protegida quede en el historial
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos los hijos (la página protegida)
  return children;
};

export default ProtectedRoute;
