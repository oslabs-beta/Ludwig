import React, { useState, useEffect } from 'react';
import Score from './components/Score';
import Issues from './components/Issues';

export default function App() {
  const [ariaRecommendations, setAriaRecommendations] = useState({});

  useEffect(() => {
    const handleMessage = (event) => {
      const { ariaRecs } = event.data;
      console.log('Received App.jsx - ariaRecs message:', ariaRecs);

      if (ariaRecs) {
        setAriaRecommendations(ariaRecs);
      }
    };
  
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  },[]);

  return (
    <div style={{ margin: 15 }}>
      <Score ariaRecommendations={ariaRecommendations} />
      <Issues ariaRecommendations={ariaRecommendations} />
    </div>
  );
}
