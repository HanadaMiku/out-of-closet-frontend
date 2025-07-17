import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To get the token
import './ClosetGallery.css'; // For styling

const ClosetGallery = () => {
    const [closets, setClosets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        const fetchClosets = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/content/closets', {
                    headers: { 'x-auth-token': token }
                });
                setClosets(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching closets:', err);
                setError('Failed to load closets. Please try again or login.');
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    logout(); // Log out if token is invalid/expired
                }
            }
        };
        fetchClosets();
    }, [token, logout]);

    const handleClosetClick = (id) => {
        history.push(`/closet/${id}`);
    };

    if (loading) return <div>Loading closets...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="gallery-container">
            <h1>Out of Closet: The Exhibition</h1>
            <button onClick={logout} className="logout-button">Logout</button>
            <div className="closet-grid">
                {closets.map(closet => (
                    <div key={closet.id} className="closet-thumbnail" onClick={() => handleClosetClick(closet.id)}>
                        {/* Display an 'outside' picture or a placeholder for the closed closet */}
                        <img src={closet.outsidePictures[0]?.src || '/assets/placeholder_closet.png'} alt={`${closet.personaName}'s closet`} />
                        <h3>{closet.personaName}'s Closet</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClosetGallery;