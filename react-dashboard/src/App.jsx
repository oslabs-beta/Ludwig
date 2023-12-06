import React, { useState, useEffect } from 'react';
import Score from './components/Score';

export default function App() {
  const vscode = window.vscodeApi;

  return (
    <div>
      <h2>Welcome to the Ludwig Dashboard!</h2>
      <Score />
    </div>
  );
}