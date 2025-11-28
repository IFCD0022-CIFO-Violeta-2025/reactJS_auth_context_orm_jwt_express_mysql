import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { authService } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useUser();
  const [protectedMessage, setProtectedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProtectedData = async () => {
    setLoading(true);
    try {
      const response = await authService.getProtected();
      setProtectedMessage(response.data.message);
    } catch (err) {
      setProtectedMessage('Error al obtener datos protegidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Bienvenido, {user?.email}</p>

      <div className="protected-section">
        <h3>Datos Protegidos:</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <p>{protectedMessage}</p>
        )}
        <button onClick={fetchProtectedData}>Recargar</button>
      </div>

      <button onClick={logout} className="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
