// client/src/components/Dashboard/ImageUpload.js
import React, { useState } from 'react';
import api from '../../services/api';
import './ImageUpload.css';

const ImageUpload = ({ currentFolder, onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setName(selectedFile.name);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', name || file.name);
        if (currentFolder) {
            formData.append('folder', currentFolder);
        }

        try {
            setUploading(true);
            setError('');

            const response = await api.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Upload response:', response.data);
            setFile(null);
            setName('');
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (err) {
            console.error('Upload error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="upload-input">
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="file-input"
                    />
                    {file && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Image name (optional)"
                            className="name-input"
                        />
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={uploading || !file}
                    className="upload-button"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default ImageUpload;