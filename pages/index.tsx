import React from "react";

export default function Home() {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#121212',
        color: '#e0e0e0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        textAlign: 'center',
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          backgroundColor: '#1e1e1e',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
          maxWidth: '480px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛠️</div>
        <h1 style={{ color: '#d4a574', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Technical Maintenance in Progress
        </h1>
        <p>The game is currently being updated.</p>
        <br />
        <p>Please try again later.</p>
      </div>
    </div>
  );
}
