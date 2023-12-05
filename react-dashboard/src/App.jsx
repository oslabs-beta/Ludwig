import React, { useState, useEffect } from 'react';
import Score from './components/Score';

export default function App() {
  const vscode = window.vscodeApi;

  return (
    <div className='bg-orange-200'>
      <h3>Ludwig Dashboard</h3>
      <Score />
    </div>
  );
}