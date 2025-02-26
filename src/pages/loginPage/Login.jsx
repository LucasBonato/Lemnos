/* eslint-disable react-hooks/exhaustive-deps */
import './login.scss';
import User from '../userPage/User';
import LoginForm from './components/login/LoginForm';
import AuthService from '../../services/AuthService';
import RegistrationForm from './components/registration/RegistrationForm';
import { toast } from 'react-toastify';
import { cadastrarUsuario } from '../../services/ClienteService';
import { useState, useEffect, useRef } from 'react';

export default function Login() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const logoutTimerRef = useRef(null);
    const [clearUserImgFlag, setClearUserImgFlag] = useState(false);

    useEffect(() => {
        if (AuthService.isLoggedIn()) {
            setLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (loggedIn) {
            startLogoutTimer();
        } else {
            clearLogoutTimer();
        }

        return () => clearLogoutTimer();
    }, [loggedIn]);

    const startLogoutTimer = () => {
        clearLogoutTimer();
        logoutTimerRef.current = setTimeout(
            () => {
                handleLogout();
                toast.warning(
                    'Sessão expirada. Por Favor, Cadastre-se novamente!', {
                        position: "bottom-right"
                    }
                );
            },
            10 * 60 * 1000
        );
    };

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const handleLogin = () => {
        if (AuthService.isLoggedIn()) {
            const tokenList = AuthService.getToken().split('.');
            const json = JSON.parse(atob(tokenList[1]));
            AuthService.setRole(json.role);
            setLoggedIn(true);
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false);
        setClearUserImgFlag(!clearUserImgFlag);
    };

    const handleRegistrationForm = () => {
        setShowLoginForm(false);
    };

    const handleRegistrationSuccess = async (form) => {
        const firstName = form.name.split(' ')[0];

        form.cpf =
            form.cpf.substring(0, 3) +
            form.cpf.substring(4, 7) +
            form.cpf.substring(8, 11) +
            form.cpf.substring(12);

        const formattedForm = {
            name: form.name,
            cpf: form.cpf,
            email: form.email,
            password: form.password,
        };

        try {
            await cadastrarUsuario(formattedForm);
            toast.success(`Cadastro realizado, ${firstName}!!`, {
                position: "bottom-right"
            });
            handleBackToLogin();
        } catch (error) {
            toast.error(`${error.message}`, {
                position: "bottom-right"
            });
        }
    };

    const handleBackToLogin = () => {
        setShowLoginForm(true);
    };

    return (
        <main className="container">
            {loggedIn ? (
                <User onLogout={handleLogout} clearUserImg={clearUserImgFlag} />
            ) : (
                <div className="loginScreen">
                    {showLoginForm ? (
                        <LoginForm
                            onLogin={handleLogin}
                            onCadastroClick={handleRegistrationForm}
                        />
                    ) : (
                        <RegistrationForm
                            onCadastroSuccess={handleRegistrationSuccess}
                            handleBackToLogin={handleBackToLogin}
                        />
                    )}
                </div>
            )}
        </main>
    );
}
