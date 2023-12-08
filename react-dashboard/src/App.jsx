import React, { useState, useEffect } from 'react';
import Score from './components/Score';
import Issues from './components/Issues';


export default function App() {
  const vscode = window.vscodeApi;
  const [recommendations, setRecommendations] = useState({});
  useEffect(() =>{
    window.addEventListener('message', (event) => {
      const message = event.data;
      if(message) {
        setRecommendations(message.ariaRecommendations);
        console.log('Received message in Dashboard App:', message.ariaRecommendations);
      }
    });
  }, []);

  return (
    <div>
      <h2>Welcome to the Ludwig Dashboard!</h2>
      <Score recommendations={recommendations}/>
      <Issues recommendations={recommendations}/>
    </div>
  );
}