import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.scss';
import LoginForm from './components/login/LoginForm';
import RegistrationForm from './components/registration/RegistrationForm';
import User from './components/user/User';
import { cadastrarCliente, logarUsuario } from '../../services/ApiService'; 

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm , setShowLoginForm] = useState(true);
  
  const handleRegistrationSuccess = async (form) => {
    const firstName = form.name.split(" ")[0];

    form.cpf = form.cpf.substring(0, 3) + form.cpf.substring(4, 7) + form.cpf.substring(8, 11) + form.cpf.substring(12);

    const formattedForm = {
      name: form.name,
      cpf: form.cpf,
      email: form.email,
      password: form.password,
    };

    try {
      await cadastrarCliente(formattedForm);
      toast.success(`Cadastro realizado, ${firstName}!!`);
      handleBackToLogin();
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };
  
    
  const handleLogin = async (email, senha, id) => {
    try {
      const userData = await logarUsuario(email, senha, id);
      toast.success(`Bem-vindo de volta, ${userData.nome}!`);
    } catch (error) {
      toast.error(`${error.message}`);
    }
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // api
    setLoggedIn(false);
  };

  const handleRegistration = () => {
    setShowLoginForm(false);
  };

  const handleBackToLogin = () => {
    setShowLoginForm(true);
  };

  return (
    <main className='container'>
      {loggedIn ? (
        <User onLogout={handleLogout}/>
      ) : (
        <div className='loginScreen'>
          {showLoginForm ? (
            <LoginForm onLogin={handleLogin} onCadastroClick={handleRegistration} />
          ) : (
            <RegistrationForm onCadastroSuccess={handleRegistrationSuccess}  handleBackToLogin={handleBackToLogin} />
          )}
        </div>
      )}
    </main>
  );
}