import React from 'react';
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/question');
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Hoş Geldiniz!</h1>
                <p style={styles.description}>Sorulara başlamak için aşağıdaki butona tıklayın.</p>
                <button style={styles.button} onClick={handleStartClick}>Başla</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #2980B9, #6DD5FA)',
        color: '#fff',
    },
    content: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '1.5rem',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    description: {
        fontSize: '1.3rem',
        marginBottom: '2.5rem',
        opacity: 0.9,
    },
    button: {
        padding: '1.2rem 2.5rem',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        backgroundColor: '#FF5722',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        outline: 'none',
    },
};

export default MainPage;
