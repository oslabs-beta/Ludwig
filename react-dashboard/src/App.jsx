import React, { useState, useEffect } from 'react';
import Score from './components/Score';
import IssueTable from './components/IssueTable';


export default function App() {

  const [recommendations, setRecommendations] = useState({data:{}, recData:[]});
  
  //Get message when sent from extension.ts (triggered when 'scan document' pressed)
  useEffect(() =>{
    window.addEventListener('message', (event) => {
      
      const message = event.data;
      if(message) {
        setRecommendations(message);
        // console.log('Received message in Dashboard App:', message);
      }
    });
  }, []);
 
  return (
    <div style={{margin:15}}>
      <Score recommendations={recommendations}/>
      <IssueTable recommendations={recommendations}/>
    </div>
  );
}