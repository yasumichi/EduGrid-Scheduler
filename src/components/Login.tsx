import { useState } from 'preact/hooks';
import './Login.css';
import { useTranslation } from 'react-i18next';

interface Props {
  onLogin: (email: string, pass: string) => void;
  error?: string;
}

export function Login({ onLogin, error }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>EduGrid Scheduler</h2>
        <p>{t('Please sign in to continue')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('Email')}</label>
            <input 
              type="email" 
              value={email} 
              onInput={(e) => setEmail(e.currentTarget.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('Password')}</label>
            <input 
              type="password" 
              value={password} 
              onInput={(e) => setPassword(e.currentTarget.value)}
              required 
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button">{t('Sign In')}</button>
        </form>
        <div className="login-footer">
          <small>{t('Admin Login Hint')}</small>
        </div>
      </div>
    </div>
  );
}
