/**
 * ============================================================================
 * APP COMPONENT - Componente raíz de la aplicación
 * ============================================================================
 *
 * Este es el componente principal que define la estructura de rutas
 * y envuelve la aplicación con los providers necesarios.
 *
 * DIFERENCIA CON LA VERSIÓN CONTEXT:
 * ----------------------------------
 * En la versión con Context teníamos:
 *   <UserProvider>
 *     <BrowserRouter>
 *       ...
 *     </BrowserRouter>
 *   </UserProvider>
 *
 * En la versión con Redux tenemos:
 *   <Provider store={store}>
 *     <BrowserRouter>
 *       ...
 *     </BrowserRouter>
 *   </Provider>
 *
 * El Provider de React-Redux hace que el store esté disponible
 * para todos los componentes mediante useSelector y useDispatch.
 *
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

// Store de Redux
import { store } from './store';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import './App.css';

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    // =========================================================================
    // PROVIDER DE REDUX
    // =========================================================================
    // El Provider es el componente de React-Redux que conecta React con Redux.
    // Hace que el store esté disponible para todos los componentes hijos.
    //
    // Internamente usa React Context, pero proporciona optimizaciones
    // adicionales para evitar re-renders innecesarios.
    //
    // IMPORTANTE: Debe estar en el nivel más alto de la aplicación,
    // envolviendo todos los componentes que necesiten acceder al store.
    <Provider store={store}>
      {/* ===================================================================
          BROWSER ROUTER
          ===================================================================
          Proporciona el sistema de enrutamiento de React Router.
          Debe estar dentro del Provider de Redux para que las páginas
          puedan acceder al store. */}
      <BrowserRouter>
        <div className="app">
          {/* =================================================================
              DEFINICIÓN DE RUTAS
              =================================================================
              Routes es el contenedor de todas las rutas.
              Renderiza el primer Route que coincida con la URL actual. */}
          <Routes>
            {/* Ruta de login - accesible sin autenticación */}
            <Route path="/login" element={<Login />} />

            {/* Ruta de registro - accesible sin autenticación */}
            <Route path="/register" element={<Register />} />

            {/* Ruta protegida del dashboard
                ProtectedRoute verifica la autenticación usando Redux.
                Si no está autenticado, redirige a /login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto - redirige al login
                Navigate con replace evita que / quede en el historial */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
