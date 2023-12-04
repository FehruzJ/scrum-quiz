import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

const App = () => {
  const [isQuizFinished, setIsQuizFinished] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/question" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
