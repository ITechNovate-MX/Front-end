import React, { useState } from 'react';
import ASRIcon from "../../icons/asr_bg.png";
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  status: 'default' | 'error';
  onInputChange: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  status,
  onInputChange,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    onInputChange();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onInputChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form className="LoginForm" onSubmit={handleSubmit}>
      <div className='logo-container'><img src={ASRIcon} alt="ASR Logo" className="form-logo" /></div>
      <h2 className="form-title">Iniciar Sesión</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          required
        />
      </div>
      {status === 'error' && (
        <p className="error-message">
          Credenciales inválidas. <br /> Corrobora los datos ingresados.
        </p>
      )}
      <div className='button-container'><button type="submit" className="submit-button">Enviar</button></div>
    </form>
  );
};

export default LoginForm;