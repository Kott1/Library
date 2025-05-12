'use client';
import { useState } from 'react';
import Login from '../../components/login.js';
import Register from '../../components/register.js';

export default function AuthForm() {
    const [mode, setMode] = useState('register');

    return (
        <div>
            {mode === 'login' ? <Login /> : <Register />}
            <p>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
}