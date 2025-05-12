'use client'

import { useState } from 'react'
import BookSearch from './bookSearch'

export default function RemoveBookForm() {
    const [bookId, setBookId] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')

    const resetForm = () => {
        setBookId('')
        setTitle('')
        setAuthor('')
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`http://localhost:3002/books/${bookId}`, {
                method: 'DELETE',
            })
            
            const data = await res.json();

            if (res.ok && !data.error) {
                alert('Book deleted successfully!')
            } else {
                alert(data.error);
            }

            resetForm()
        } catch (err) {
            console.error('Error:', err);
            alert('Error deleting book');
        }
    }

    const onSearch = ([book]) => {
        setBookId(book.id)
        setTitle(book.title)
        setAuthor(book.author)
    }

    return (
        <div style={{ maxWidth: '400px', margin: '1rem auto', fontFamily: 'Arial, sans-serif' }}>
            {!bookId ? (
                <>
                <h2>Find Book to Remove</h2>
                <BookSearch onSearch={onSearch} />
                </>
            ) : (
                <>
                <h2>Confirm Removal</h2>
                <p>
                    Title: <strong>{title}</strong>
                </p>
                <p>
                    Author: <strong>{author}</strong>
                </p>
                <button
                    onClick={handleDelete}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                    }}
                >
                Delete
                </button>
                </>
            )}
        </div>
    )
}