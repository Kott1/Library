'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [history, setHistory] = useState([])
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:3002/reading-progress/user', {
                    credentials: 'include',
                })

                if (!res.ok) {
                    throw new Error('Failed to fetch reading history')
                }

                const data = await res.json()
                setHistory(data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchHistory()
    }, [])

    const handleGoHome = async () => {
        router.push('/pages/home');
    };

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

    if (history.length === 0) return <p>You haven’t started reading any books yet.</p>

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Reading History</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #ccc', fontWeight: 'bold', padding: '8px 0' }}>
                <div>Book ID</div>
                <div>Current Page</div>
                <div>Progress (%)</div>
            </div>
            {history.map(entry => (
                <div key={entry.book_id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <div>{entry.book_id}</div>
                    <div>{entry.current_page + 1}</div>
                    <div>{entry.percentage_read.toFixed(2)}</div>
                </div>
            ))}
            <button onClick={handleGoHome} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
                Go back to Home
            </button>
            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
        </div>
    )
}