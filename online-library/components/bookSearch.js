'use client'

import { useState } from 'react'

export default function BookSearch({ onSearch }) {
    const [bookId, setBookId] = useState('')

    const validateId = (id) => {
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        return uuidV4Regex.test(id)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!bookId) {
            alert('Please enter a Book ID')
            return
        }
        if (!validateId(bookId)) {
            alert('Invalid ID format. Expected UUID v4.')
            return
        }

        try {
            const res = await fetch(`http://localhost:3002/books/${bookId}`)

            const data = await res.json();
            if (res.ok && !data.error) {
                alert('Book found!')
            } else {
                alert(data.error);
            }

            onSearch([data])
        } catch (err) {
            console.error('Error:', err);
            alert('Error finding book');
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