import './Loading.css';
import { useState, useEffect } from 'react';
import sleepGif from '../../assets/sleep.gif';

function Loading({ duration = 3000, onLoadingComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) {
                onLoadingComplete();
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onLoadingComplete]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="loading">
            <div className="loading-content">
                <img src={sleepGif} alt="Carregando..." className="loading-gif" />
                <p className="loading-text">Carregando...</p>
                <div className="loading-dots">
                </div>
            </div>
        </div>
    );
}

export default Loading;