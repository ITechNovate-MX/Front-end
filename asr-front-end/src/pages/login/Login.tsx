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

      // Autenticar al usuario con Firebase
      const firebaseCredential = await login(email, password);
      console.log('Inicio de sesión exitoso con Firebase:', firebaseCredential);

      // Obtener el token de Firebase
      const token = await firebaseCredential.user.getIdToken();
      console.log('Token obtenido:', token);

      // Si llega aquí, las credenciales son correctas
      setFormStatus('default');
      navigate('/home'); // Redirigir al home
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);

      // Mostrar mensaje de error en el formulario
      setFormStatus('error');
    }
  };

  return (
    <div className="MainLoginComponent">
      <LoginForm
        onSubmit={handleSignIn}
        status={formStatus}
        onInputChange={resetFormStatus}
      />
    </div>
  );
};

export default Login;