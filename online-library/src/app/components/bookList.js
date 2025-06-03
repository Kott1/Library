'use client'

import { useEffect, useState } from 'react'
import BookSearch from './bookSearch'
import Link from 'next/link'

export default function BookList() {
    const [displayed, setDisplayed] = useState([])
    const [genres, setGenres] = useState([])
    const [filterGenre, setFilterGenre] = useState('')
    const [filterYear, setFilterYear] = useState('')

    useEffect(() => {
        fetchBooks();
        fetchGenres();
    }, []);

    const fetchBooks = async (genre = '', year = '') => {
        try {
            const params = new URLSearchParams();
            if (genre) params.append('genre', genre);
            if (year) params.append('year', year);
            const res = await fetch(`http://localhost:3002/books?${params}`, {
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok && data.error) {
                alert(data.error);
            }

            setDisplayed(data);
        } catch (err) {
            console.error('Error:', err);
            alert('Error listing book');
        }
    };
    
    const fetchGenres = async () => {
        try {
            const res = await fetch(`http://localhost:3002/genres`, {
                credentials: 'include'
            })

            const data = await res.json()
            if (!res.ok && data.error) {
                alert(data.error)
            }

            setGenres(data)
        } catch (err) {
            console.error('Error fetching genres:', err)
            alert('Error loading genres')
        }
    };

    const applyFilters = () => {
        fetchBooks(filterGenre, filterYear);
    };

    const resetFilters = () => {
        setFilterGenre('');
        setFilterYear('');
        fetchBooks();
    };

    const handleSearch = (results) => {
        setDisplayed(results)
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
                    <button>
                    <Link href={`/pages/book?id=${b.id}`}>
                    Read online
                    </Link>
                    </button>
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