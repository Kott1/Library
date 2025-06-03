'use client'

import { useState } from 'react'

export default function BookSearch({ onSearch }) {
    const [bookId, setBookId] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`http://localhost:3002/books/${bookId}`, {
                credentials: 'include'
            });

            const data = await res.json()
            
            if (res.ok) {
                alert('Book found!')
                onSearch([data])
            } else {
                alert(data.message || 'Book not found.')
            }
        } catch (err) {
            console.error('Error:', err)
            alert('Error finding book')
        }
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    placeholder="Enter Book ID (UUID)"
                    style={{ flex: 1, padding: '0.5rem' }}
                    required
                />
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>
                    Search
                </button>
            </form>
        </div>
    )
}