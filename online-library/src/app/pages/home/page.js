'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookList from '../../components/bookList.js';

export default function AdminPanel() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!Boolean(localStorage.getItem('isLoggedIn'))) {
            router.push('/');
        } else {
            setIsAdmin(Boolean(localStorage.getItem('isAdmin')));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLoggedIn');
        router.push('/');
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
            <BookList />
            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
        </div>
    );
}