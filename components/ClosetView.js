import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import { Howl, Howler } from 'howler';
import { useAuth } from '../context/AuthContext';
import StoryViewer from './StoryViewer'; // We'll create this next
import './ClosetView.css'; // For styling

const ClosetView = () => {
    const { id } = useParams();
    const history = useHistory();
    const { token, logout } = useAuth();

    const [closet, setCloset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isClosetOpen, setIsClosetOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);

    const closetDoorsRef = useRef(null);
    const flashRef = useRef(null);
    const interiorRef = useRef(null);

    // Audio states/instances
    const [bgMusic, setBgMusic] = useState(null);
    const [insideAmbient, setInsideAmbient] = useState(null);
    const [storySound, setStorySound] = useState(null); // For specific story sounds

    useEffect(() => {
        const fetchCloset = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/content/closet/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setCloset(res.data);
                setLoading(false);

                // Initialize background music (N25 style)
                const newBgMusic = new Howl({
                    src: ['/assets/audio/n25_bg.mp3'], // Path to your N25 music
                    loop: true,
                    volume: 0.6
                });
                setBgMusic(newBgMusic);
                newBgMusic.play();

            } catch (err) {
                console.error('Error fetching closet:', err);
                setError('Failed to load closet details.');
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    logout();
                }
            }
        };
        fetchCloset();

        // Cleanup audio on component unmount
        return () => {
            if (bgMusic) bgMusic.unload();
            if (insideAmbient) insideAmbient.unload();
            if (storySound) storySound.unload();
            Howler.stop(); // Stop all sounds if navigating away
        };
    }, [id, token, logout, bgMusic, insideAmbient, storySound]); // Include audio states in dependency array

    const handleOpenCloset = () => {
        if (isClosetOpen) return;

        // Stop N25 music
        if (bgMusic) bgMusic.fade(0.6, 0, 1000).once('fade', () => bgMusic.stop());

        // Stutter animation (GSAP)
        gsap.to(closetDoorsRef.current, {
            x: '+=10', // Small horizontal shake
            repeat: 1, // Repeat once (total 2 shakes)
            yoyo: true,
            duration: 0.05,
            ease: "power1.inOut",
            onComplete: () => {
                // Bright light flash
                gsap.to(flashRef.current, {
                    opacity: 1,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(flashRef.current, {
                            opacity: 0,
                            duration: 0.2,
                            delay: 0.05, // Short delay for full brightness
                            onComplete: () => {
                                setIsClosetOpen(true);
                                // Start inside ambient sounds
                                const newInsideAmbient = new Howl({
                                    src: ['/assets/audio/inside_ambient.mp3'], // Mix of streets, nature, giggling
                                    loop: true,
                                    volume: 0.7
                                });
                                setInsideAmbient(newInsideAmbient);
                                newInsideAmbient.play();
                            }
                        });
                    }
                });
            }
        });
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        // Stop ambient sounds, play specific story sound
        if (insideAmbient) insideAmbient.fade(0.7, 0, 500).once('fade', () => insideAmbient.stop());

        const newStorySound = new Howl({
            src: [`/assets/audio/${story.audioCue}`],
            volume: 1.0,
            onend: () => {
                // When story sound ends, fade ambient back in
                if (insideAmbient) insideAmbient.fade(0, 0.7, 1000).play();
            }
        });
        setStorySound(newStorySound);
        newStorySound.play();
    };

    const handleCloseStoryViewer = () => {
        setSelectedStory(null);
        // Fade ambient back in
        if (insideAmbient) insideAmbient.fade(0, 0.7, 1000).play();
        if (storySound) storySound.stop(); // Stop story specific sound
    };

    if (loading) return <div>Loading closet...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!closet) return <div>Closet not found.</div>;

    return (
        <div className="closet-view-container">
            <button onClick={() => history.push('/gallery')} className="back-button">Back to Gallery</button>
            {!isClosetOpen && (
                <div className="closed-closet" ref={closetDoorsRef} onClick={handleOpenCloset}>
                    <img src={closet.outsidePictures[0]?.src || '/assets/placeholder_closet.png'} alt="Closed Closet" />
                    <p>Click to open {closet.personaName}'s Closet</p>
                </div>
            )}

            <div className="flash-overlay" ref={flashRef}></div> {/* Bright light overlay */}

            {isClosetOpen && (
                <div className="open-closet-interior" ref={interiorRef}>
                    <h2>Inside {closet.personaName}'s Closet</h2>
                    <div className="interior-pictures">
                        {closet.insideStories.map(story => (
                            <img
                                key={story.id}
                                src={story.src}
                                alt={story.caption}
                                onClick={() => handleStoryClick(story)}
                                className="interior-image"
                            />
                        ))}
                    </div>
                </div>
            )}

            {selectedStory && (
                <StoryViewer
                    story={selectedStory}
                    personaExpressions={closet.expressions}
                    onClose={handleCloseStoryViewer}
                />
            )}
        </div>
    );
};

export default ClosetView;