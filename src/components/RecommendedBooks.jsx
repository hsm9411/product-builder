import React, { useState, useEffect } from 'react';

const subjects = [
    { key: 'artificial_intelligence', name: '인공지능' },
    { key: 'science_fiction', name: '과학 소설' },
    { key: 'history', name: '역사' },
];

const RecommendedBooks = () => {
    const [books, setBooks] = useState([]);
    const [activeSubject, setActiveSubject] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBooksBySubject = async (subject) => {
        if (!subject) return;
        setLoading(true);
        setBooks([]);

        try {
            const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBooks(data.works || []);
        } catch (error) {
            console.error(`Error fetching books for subject "${subject}":`, error);
            setBooks([]); // Ensure books is an array on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectClick = (subjectKey) => {
        setActiveSubject(subjectKey);
        fetchBooksBySubject(subjectKey);
    };

    return (
        <section className="tool-section">
            <h2 className="title">주제별 추천 도서</h2>
            <div className="subject-buttons">
                {subjects.map(subject => (
                    <button
                        key={subject.key}
                        className={`subject-btn ${activeSubject === subject.key ? 'active' : ''}`}
                        onClick={() => handleSubjectClick(subject.key)}
                    >
                        {subject.name}
                    </button>
                ))}
            </div>
            <div id="book-list-container" className="book-list-container">
                {loading && <div className="placeholder">도서 정보를 불러오는 중...</div>}
                {!loading && books.length === 0 && activeSubject && (
                    <div className="placeholder">해당 주제의 도서를 찾을 수 없습니다.</div>
                )}
                {!loading && books.length === 0 && !activeSubject && (
                    <div className="placeholder">주제를 선택하여 관련 도서를 확인하세요.</div>
                )}
                {books.map(book => {
                    const coverUrl = book.cover_id
                        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                        : 'https://via.placeholder.com/180x240.png?text=No+Cover';
                    const authorName = book.authors?.length > 0 ? book.authors[0].name : '저자 정보 없음';

                    return (
                        <div key={book.key} className="book-card">
                            <img src={coverUrl} alt={`${book.title} 표지`} className="book-cover" />
                            <div className="book-info">
                                <h4 className="book-title">{book.title}</h4>
                                <p className="book-author">{authorName}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RecommendedBooks;
