import './ErrorMessage.css';

function ErrorMessage({ error, onClose }) {
  if (!error) return null;

  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'Neznámá chyba';
  };

  const getErrorDetails = () => {
    if (!error.status) return null;

    const statusMessages = {
      400: 'Neplatný požadavek',
      401: 'Nejste přihlášeni',
      403: 'Nemáte oprávnění',
      404: 'Nenalezeno',
      500: 'Chyba serveru',
      503: 'Server je nedostupný'
    };

    return statusMessages[error.status] || `HTTP ${error.status}`;
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="error-message">
      <div className="error-message-content">
        <div className="error-message-header">
          <span className="error-icon">⚠️</span>
          {errorDetails && <span className="error-status">{errorDetails}</span>}
        </div>
        <p className="error-text">{getErrorMessage()}</p>
        {error.data && error.data.errors && (
          <ul className="error-list">
            {error.data.errors.map((err, index) => (
              <li key={index}>{err.msg || err.message || err}</li>
            ))}
          </ul>
        )}
        {onClose && (
          <button className="error-close" onClick={onClose}>
            Zavřít
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
