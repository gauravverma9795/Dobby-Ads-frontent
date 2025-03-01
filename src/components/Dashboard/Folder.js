
// src/components/Dashboard/Folder.js
// src/components/Dashboard/Folder.js
import React, { useState, useEffect } from 'react';
import { FaFolder, FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/styles.css';

// Rest of your component code remains the same  // Update the import path

const Folder = ({ folderId, onFolderClick, onUpdate }) => {
    const [folders, setFolders] = useState([]);
    const [images, setImages] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPath, setCurrentPath] = useState([]);

    useEffect(() => {
        loadFolderContents();
        loadFolderPath();
    }, [folderId]);

    const loadFolderContents = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/folders/${folderId || ''}`);
            setFolders(response.data.folders);
            setImages(response.data.images);
        } catch (err) {
            setError('Failed to load folder contents');
            console.error('Error loading folder:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadFolderPath = async () => {
        if (!folderId) {
            setCurrentPath([{ _id: null, name: 'Root' }]);
            return;
        }

        try {
            const response = await api.get(`/folders/path/${folderId}`);
            setCurrentPath([
                { _id: null, name: 'Root' },
                ...response.data
            ]);
        } catch (err) {
            console.error('Error loading folder path:', err);
        }
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            setError('');
            await api.post('/folders', {
                name: newFolderName,
                parent: folderId
            });
            setNewFolderName('');
            loadFolderContents();
        } catch (err) {
            setError('Failed to create folder');
            console.error('Error creating folder:', err);
        }
    };

    const deleteFolder = async (id) => {
        if (!window.confirm('Are you sure you want to delete this folder and all its contents?')) {
            return;
        }

        try {
            setError('');
            await api.delete(`/folders/${id}`);
            loadFolderContents();
        } catch (err) {
            setError('Failed to delete folder');
            console.error('Error deleting folder:', err);
        }
    };

    const deleteImage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            setError('');
            await api.delete(`/images/${id}`);
            loadFolderContents();
        } catch (err) {
            setError('Failed to delete image');
            console.error('Error deleting image:', err);
        }
    };

    const navigateToFolder = (id) => {
        onFolderClick(id);
    };

    const navigateUp = () => {
        if (currentPath.length > 1) {
            const parentFolder = currentPath[currentPath.length - 2];
            navigateToFolder(parentFolder._id);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="folder-container">
            {error && <div className="error-message">{error}</div>}

            {/* Breadcrumb Navigation */}
            <div className="breadcrumb">
                {currentPath.map((folder, index) => (
                    <span key={folder._id || 'root'}>
                        <span 
                            className="breadcrumb-item"
                            onClick={() => navigateToFolder(folder._id)}
                        >
                            {folder.name}
                        </span>
                        {index < currentPath.length - 1 && ' / '}
                    </span>
                ))}
            </div>

            {/* Create New Folder */}
            <div className="create-folder">
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="folder-input"
                />
                <button 
                    onClick={createFolder}
                    className="create-button"
                    disabled={!newFolderName.trim()}
                >
                    Create Folder
                </button>
            </div>

            {/* Folder Navigation */}
            {folderId && (
                <button 
                    onClick={navigateUp}
                    className="back-button"
                >
                    <FaArrowLeft /> Back
                </button>
            )}

            {/* Folders Grid */}
            <div className="folders-grid">
                {folders.map(folder => (
                    <div key={folder._id} className="folder-item">
                        <div 
                            className="folder-name"
                            onClick={() => navigateToFolder(folder._id)}
                        >
                            <FaFolder className="folder-icon" />
                            <span>{folder.name}</span>
                        </div>
                        <button 
                            onClick={() => deleteFolder(folder._id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Images Grid */}
            <div className="images-grid">
                {images.map(image => (
                    <div key={image._id} className="image-item">
                        <img 
                            src={`${process.env.REACT_APP_API_URL || 'https://dobby-ads-backend-12di.onrender.com'}/${image.path}`}
                            alt={image.name}
                        />
                        <div className="image-info">
                            <span>{image.name}</span>
                            <button 
                                onClick={() => deleteImage(image._id)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Folder;