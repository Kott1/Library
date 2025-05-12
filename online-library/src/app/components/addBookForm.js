'use client'

import { useState } from 'react';

export default function BookForm() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [publication_year, setPublicationYear] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    const resetForm = () => {
        setTitle('')
        setAuthor('')
        setGenre('')
        setDescription('')
        setPublicationYear('')
        setFileUrl('')
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3002/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                title,
                author,
                genre,
                description,
                publication_year,
                file_url: fileUrl,
                }),
            });

            const data = await res.json();

            if (res.ok && !data.error) {
                alert('Book added successfully!');
            } else {
                alert(data.error);
            }
            resetForm();
        } catch (err) {
            console.error('Error:', err);
            alert('Error adding book');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '1rem auto', fontFamily: 'Arial, sans-serif' }}>
        <h2>Add New Book</h2>
        <form onSubmit={handleSubmit}>
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
            <input type="number" value={publication_year} onChange={(e) => setPublicationYear(e.target.value)} required />
            </label>
            <br />
            <label>
            File URL:
            <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." required />
            </label>
            <br />
            <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
            Submit
            </button>
        </form>
        </div>
    );
}