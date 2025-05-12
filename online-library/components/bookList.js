'use client'

import { useEffect, useState } from 'react'
import BookSearch from './bookSearch'

export default function BookList() {
    const [allBooks, setAllBooks] = useState([])
    const [displayed, setDisplayed] = useState([])
    const [genres, setGenres] = useState([])
    const [filterGenre, setFilterGenre] = useState('')
    const [filterYear, setFilterYear] = useState('')

    useEffect(() => {
        async function fetchBooks() {
        try {
            const res = await fetch('http://localhost:3002/books')

            const data = await res.json();
            if (!res.ok && data.error) {
                alert(data.error);
            }

            setAllBooks(data)
            setDisplayed(data)
            const uniq = Array.from(new Set(data.map((b) => b.genre))).sort()
            setGenres(uniq)
        } catch (err) {
            console.error('Error:', err);
            alert('Error listing book');
        }
        }
        fetchBooks()
    }, [])

    const applyFilters = () => {
        let filtered = allBooks;

        if (filterGenre) {
            filtered = filtered.filter((b) => b.genre === filterGenre);
        }

        if (filterYear) {
            filtered = filtered.filter((b) => String(b.publication_year) === String(filterYear));
        }

        setDisplayed(filtered);
    };

    const handleSearch = (results) => {
        setDisplayed(results)
    }

    const resetFilters = () => {
        setFilterGenre('')
        setFilterYear('')
        setDisplayed(allBooks)
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
        <h2>Books</h2>

        <BookSearch onSearch={handleSearch} />

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div>
            <label>
                Genre:{' '}
                <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                >
                <option value=''>All</option>
                {genres.map((g) => (
                    <option key={g} value={g}>
                    {g}
                    </option>
                ))}
                </select>
            </label>
            </div>
            <div>
            <label>
                Year:{' '}
                <input
                type='number'
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                placeholder='e.g. 2025'
                style={{ width: '6rem' }}
                />
            </label>
            </div>
            <button onClick={applyFilters}>Apply Filters</button>
            <button onClick={resetFilters}>Reset Filters</button>
        </div>

        {displayed.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {displayed.map((b) => (
                <li
                key={b.id}
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                }}
                >
                <h3>{b.title}</h3>
                <p><strong>Author:</strong> {b.author}</p>
                <p><strong>Genre:</strong> {b.genre}</p>
                <p><strong>Year:</strong> {b.publication_year}</p>
                {b.description && <p>{b.description}</p>}
                {b.file_url && (
                    <p>
                    <a href={b.file_url} target='_blank' rel='noopener noreferrer'>
                        Read online
                    </a>
                    </p>
                )}
                </li>
            ))}
            </ul>
        ) : (
            <p>No books found.</p>
        )}
        </div>
    )
}