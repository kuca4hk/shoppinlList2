import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from './ErrorMessage';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Informace o dostupných uživatelích z backendu
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      createdAt: '2025-01-01'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      createdAt: '2025-01-02'
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'password123',
      createdAt: '2025-01-03'
    }
  ];

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert('Heslo zkopíováno!');
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert('Email zkopírován!');
  };

  const handleTestLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await api.login(email, password);

      // Uložit přihlášení a přesměrovat
      login(result.user, result.token);

      setTestResult({
        success: true,
        message: 'Přihlášení úspěšné! Přesměrovávám...',
        data: result
      });

      // Přesměrovat na hlavní stránku po 1 sekundě
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err);
      setTestResult({
        success: false,
        message: 'Přihlášení selhalo'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <ErrorMessage error={error} onClose={() => setError(null)} />

      <div className="dashboard-header">
        <h2>Správa uživatelů</h2>
        <p className="dashboard-subtitle">Přehled dostupných uživatelů v systému</p>
      </div>

      <div className="users-grid">
        {users.map((user, index) => (
          <div key={index} className="user-card">
            <div className="user-card-header">
              <div className="user-avatar">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-created">
                  Vytvořeno: {new Date(user.createdAt).toLocaleDateString('cs-CZ')}
                </p>
              </div>
            </div>

            <div className="user-credentials">
              <div className="credential-row">
                <label>Email:</label>
                <div className="credential-value">
                  <code>{user.email}</code>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyEmail(user.email)}
                    title="Kopírovat email"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="credential-row">
                <label>Heslo:</label>
                <div className="credential-value">
                  <code>{user.password}</code>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyPassword(user.password)}
                    title="Kopírovat heslo"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <button
              className="test-login-btn"
              onClick={() => handleTestLogin(user.email, user.password)}
              disabled={loading}
            >
              {loading ? 'Přihlašuji...' : 'Vyzkoušet přihlášení'}
            </button>
          </div>
        ))}
      </div>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h3>{testResult.message}</h3>
          {testResult.data && (
            <pre>{JSON.stringify(testResult.data, null, 2)}</pre>
          )}
        </div>
      )}

      <div className="dashboard-info">
        <h3>Informace o backendu</h3>
        <ul>
          <li>Backend běží na: <code>http://localhost:3000</code></li>
          <li>Všichni uživatelé mají stejné heslo: <code>password123</code></li>
          <li>Pro přihlášení použijte endpoint: <code>POST /api/auth/login</code></li>
          <li>Klikněte na tlačítko "Vyzkoušet přihlášení" u jednotlivých uživatelů pro testování API</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
