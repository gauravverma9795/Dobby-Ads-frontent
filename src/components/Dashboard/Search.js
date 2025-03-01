// client/src/components/Dashboard/Search.js
import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        if (debouncedQuery) {
            handleSearch();
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    const handleSearch = async () => {
        try {
            setSearching(true);
            const response = await api.get(`/images/search?q=${debouncedQuery}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error searching images:', error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="search-container">
            <div className="search-input">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search images..."
                />
                {searching && <div className="search-spinner"></div>}
            </div>

            {results.length > 0 && (
                <div className="search-results">
                    {results.map(image => (
                        <div key={image._id} className="search-result-item">
                            <img 
                                src={`${api.defaults.baseURL}/${image.path}`} 
                                alt={image.name}
                            />
                            <p>{image.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;