import React, { useState, useEffect } from 'react';
import Score from './components/Score';
import Issues from './components/Issues';


export default function App() {

  const [ariaRecommendations, setAriaRecommendations] = useState({});

  useEffect(() => {
    const handleEvent = (event) => {
      const recs = event.data;
      if (recs) {
        setAriaRecommendations(recs);
      }
    };
  
    window.addEventListener('message', handleEvent);
  
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('message', handleEvent);
    };
  }, []);
 
  return (
    <div style={{margin:15}}>
      <Score ariaRecommendations={ariaRecommendations}/>
      <Issues ariaRecommendations={ariaRecommendations}/>
    </div>
  );
}