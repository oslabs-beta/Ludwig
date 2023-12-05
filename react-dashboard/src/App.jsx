import React, { useState, useEffect } from 'react';
import Score from './components/Score';

export default function App() {
  const vscode = window.vscodeApi;

  return (
    <div>
      <h3>Ludwig Dashboard</h3>
      <Score />
    </div>
  );
}