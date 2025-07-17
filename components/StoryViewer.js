import React from 'react';
import './StoryViewer.css'; // For styling

const StoryViewer = ({ story, personaExpressions, onClose }) => {
    if (!story) return null;

    return (
        <div className="story-viewer-overlay">
            <div className="story-viewer-content">
                <button onClick={onClose} className="story-viewer-close-button">X</button>
                <div className="story-display">
                    <div className="story-media">
                        {story.type === 'image' ? (
                            <img src={story.src} alt={story.caption} />
                        ) : (
                            <video src={story.src} controls autoPlay />
                        )}
                    </div>
                    <div className="story-persona">
                        <img src={personaExpressions[story.personaExpression]} alt="Persona" />
                    </div>
                </div>
                <div className="story-subtitle-box">
                    <p>{story.caption}</p>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;