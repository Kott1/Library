'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation';

function BookPageClient() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter();
    const [book, setBook] = useState(null)
    const [pages, setPages] = useState([])
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (!id) return

        const fetchBookAndProgress = async () => {
            try {
                const res = await fetch(`http://localhost:3002/books/${id}`, {
                    credentials: 'include',
                })
                const data = await res.json()
                setBook(data)

                const progressRes = await fetch(`http://localhost:3002/reading-progress?bookId=${id}`, {
                    credentials: 'include',
                })
                const progress = await progressRes.json()
                console.log(progress);
                if (progressRes.ok && progress && typeof progress.current_page === 'number' && typeof progress.percentage_read === 'number') {
                    const calculatedTotalPages = Math.max(
                        Math.ceil(progress.current_page / (progress.percentage_read / 100)),
                        progress.current_page + 1
                    )
                    setTotalPages(calculatedTotalPages);

                    const loadedPages = Array.from(
                        { length: calculatedTotalPages },
                        (_, i) => `Page ${i + 1}: Lorem ipsum dolor sit amet...`
                    )
                    setPages(loadedPages)
                    setCurrentPageIndex(progress.current_page)
                } else {
                    const randomTotalPages = Math.floor(Math.random() * 151) + 50
                    setTotalPages(randomTotalPages)
                    console.log(randomTotalPages)
                    const fakePages = Array.from(
                        { length: randomTotalPages },
                        (_, i) => `Page ${i + 1}: Lorem ipsum dolor sit amet...`
                    )
                    setPages(fakePages)
                    setCurrentPageIndex(0)
                }
            } catch (err) {
                console.error('Failed to load book or progress', err)
            }
        }

        fetchBookAndProgress()
    }, [id])

    const currentPageNumber = currentPageIndex + 1

    const goPrev = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1)
        }
    }

    const goNext = () => {
        if (currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(currentPageIndex + 1)
        }
    }

    const saveProgress = async () => {
        if (!id) return
        try {
            const res = await fetch(`http://localhost:3002/reading-progress?bookId=${id}`, {
                credentials: 'include',
            })
            const existing = await res.json()
            const percentage = (currentPageIndex / totalPages) * 100;
            const body = {
                book_id: id,
                current_page: currentPageIndex,
                percentage_read: percentage,
            }
            if (res.ok && existing.id) {
                await fetch(`http://localhost:3002/reading-progress/${existing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(body),
                })
            } else {
                await fetch(`http://localhost:3002/reading-progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(body),
                })
            }
        } catch (err) {
            console.error('Failed to save reading progress:', err)
        }
    }

    const handleGoHome = async () => {
        await saveProgress();
        router.push('/pages/home');
    };

    const handleLogout = async () => {
        try {
            await saveProgress();
            await fetch('http://localhost:3002/logout', {
                method: 'POST',
                credentials: 'include',
            });
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!book) {
        return <p>Loading book data...</p>
    }

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>{book.title}</h1>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Year:</strong> {book.publication_year}</p>
            <p>{book.description}</p>

            <div style={{
                border: '1px solid #ccc',
                padding: '1rem',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none',
            }}>
                <button onClick={goPrev} disabled={currentPageIndex === 0}>Previous</button>
                <p style={{ flexGrow: 1, textAlign: 'center' }}>{pages[currentPageIndex]}</p>
                <button onClick={goNext} disabled={currentPageIndex === totalPages - 1}>Next</button>
            </div>

            <p style={{ textAlign: 'center' }}>{currentPageNumber} / {totalPages}</p>
            <button onClick={handleGoHome} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
                Go back to Home
            </button>
            <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
                Logout
            </button>
        </div>
    )
}

export default function BookPageWrapper() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <BookPageClient />
        </Suspense>
    )
}