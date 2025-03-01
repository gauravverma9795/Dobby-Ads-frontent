// client/src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import Folder from './Folder';
import ImageUpload from './ImageUpload';
import Search from './Search';
import Loading from '../UI/Loading';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFolderContents();
    }, [currentFolder]);

    const loadFolderContents = async () => {
        try {
            setLoading(true);
            setError('');
            await loadBreadcrumbs();
            setLoading(false);
        } catch (err) {
            setError('Failed to load folder contents');
            setLoading(false);
        }
    };

    const loadBreadcrumbs = async () => {
        if (!currentFolder) {
            setBreadcrumbs([{ id: null, name: 'Root' }]);
            return;
        }

        try {
            const response = await api.get(`/folders/path/${currentFolder}`);
            setBreadcrumbs([
                { id: null, name: 'Root' },
                ...response.data
            ]);
        } catch (error) {
            console.error('Error loading breadcrumbs:', error);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="breadcrumbs">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.id || 'root'}>
                            <span 
                                className="breadcrumb-link"
                                onClick={() => setCurrentFolder(crumb.id)}
                            >
                                {crumb.name}
                            </span>
                            {index < breadcrumbs.length - 1 && ' / '}
                        </span>
                    ))}
                </div>
                <Search />
            </div>
            
            <div className="dashboard-content">
                <ImageUpload 
                    currentFolder={currentFolder} 
                    onUploadComplete={loadFolderContents}
                />
                <Folder 
                    folderId={currentFolder}
                    onFolderClick={setCurrentFolder}
                    onUpdate={loadFolderContents}
                />
            </div>
        </div>
    );
};

export default Dashboard;