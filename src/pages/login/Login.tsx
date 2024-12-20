import React from 'react';
import { LoginForm } from '../../components/LoginForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../app-context/app-context';


import './Login.css';

const Login: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'default' | 'error'>('default');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const resetFormStatus = () => {
    setFormStatus('default');
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('Intentando iniciar sesión con:', { email, password });

      const firebaseCredential = await login(email, password);
      console.log('Inicio de sesión exitoso con Firebase:', firebaseCredential);

      const token = await firebaseCredential.user.getIdToken();
      console.log('Token obtenido:', token);

      setFormStatus('default');
      navigate('/home'); // Redirigir al home
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);

      setFormStatus('error');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wcm">
        <h1 className= "login-wheader">Bienvenido al Portal de Facturación</h1>
      </div>
      <div className="login-overlay"></div>
      <div className="login-form-container">
        <LoginForm
          onSubmit={handleSignIn}
          status={formStatus}
          onInputChange={resetFormStatus}
        />
        {formStatus === 'error' && (
          <p className="custom-error mt-4">Correo o contraseña incorrectos</p>
        )}
      </div>
    </div>
  );
};

export default Login;