'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookList from '../../components/bookList.js';

export default function HomePage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3002/user', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsAdmin(data.isAdmin);
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

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3002/logout', {
                method: 'POST',
                credentials: 'include',
            });
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'Arial, sans-serif' }}>
            {isAdmin && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                    You are logged in as ADMIN
                </p>
            )}
            {isAdmin && (
                <button
                onClick={() => router.push('/pages/adminPanel')}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                Go to admin panel
                </button>
            )}
            <button onClick={() => router.push('/pages/history')}>Reading history</button>
            <BookList />
            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
        </div>
    );
}