'use client'

import { useState } from 'react'
import BookSearch from './bookSearch'

export default function EditBookForm() {
    const [bookId, setBookId] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [genre, setGenre] = useState('')
    const [description, setDescription] = useState('')
    const [publication_year, setPublicationYear] = useState('')
    const [fileUrl, setFileUrl] = useState('')

    const resetForm = () => {
        setBookId('')
        setTitle('')
        setAuthor('')
        setGenre('')
        setDescription('')
        setPublicationYear('')
        setFileUrl('')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`http://localhost:3002/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                title,
                author,
                genre,
                description,
                publication_year,
                file_url: fileUrl,
                }),
            })
            const data = await res.json()

            if (res.ok && !data.error) {
                alert('Book updated successfully!')
            } else {
                alert(data.error);
            }

            resetForm()
        } catch (err) {
            console.error('Error:', err);
            alert('Error updating book');
        }
    }

    const onSearch = ([book]) => {
        setBookId(book.id)
        setTitle(book.title)
        setAuthor(book.author)
        setGenre(book.genre)
        setDescription(book.description)
        setPublicationYear(book.publication_year)
        setFileUrl(book.file_url)
        console.log(book)
    }

    return (
        <div style={{ maxWidth: '400px', margin: '1rem auto', fontFamily: 'Arial, sans-serif' }}>
        {!bookId ? (
            <>
            <h2>Find Book to Edit</h2>
            <BookSearch onSearch={onSearch} />
            </>
        ) : (
            <>
            <h2>Edit Book</h2>
            <form onSubmit={handleUpdate}>
                <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <br />
                <label>
                Author:
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </label>
                <br />
                <label>
                Genre:
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                </label>
                <br />
                <label>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <br />
                <label>
                Publication Year:
                <input
                    type="number"
                    value={publication_year}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    required
                />
                </label>
                <br />
                <label>
                File URL:
                <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    required
                />
                </label>
                <br />
                <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
                Edit
                </button>
            </form>
            </>
        )}
        </div>
    )
}