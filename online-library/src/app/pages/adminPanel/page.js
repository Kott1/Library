'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AddBookForm from '../../components/addBookForm';
import EditBookForm from '../../components/editBookForm';
import RemoveBookForm from '../../components/removeBookForm';

export default function AdminPanel() {
    const router = useRouter();
    const [mode, setMode] = useState('add');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3002/user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.isAdmin) {
                        setIsAdmin(true);
                    } else {
                        router.push('/');
                    }
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    const handleMode = (newMode) => {
        setMode(newMode);
    };

    const handleGoHome = () => {
        router.push('/pages/home');
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3002/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            router.push('/');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Admin Panel</h1>
            <p style={{ color: 'red', fontWeight: 'bold' }}>You are logged in as ADMIN</p>

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => handleMode('add')} disabled={mode === 'add'}>
                Add
                </button>
                <button
                onClick={() => handleMode('edit')}
                disabled={mode === 'edit'}
                style={{ marginLeft: '0.5rem' }}
                >
                Edit
                </button>
                <button
                onClick={() => handleMode('remove')}
                disabled={mode === 'remove'}
                style={{ marginLeft: '0.5rem' }}
                >
                Remove
                </button>
            </div>

            {mode === 'add' && <AddBookForm />}

            {mode === 'edit' && <EditBookForm />}

            {mode === 'remove' && <RemoveBookForm />}
            
            <button onClick={handleGoHome} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
                Go back to Home
            </button>

            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
            
        </div>
    );
}
