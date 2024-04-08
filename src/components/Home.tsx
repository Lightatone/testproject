import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  
  return (
    <div className="page">
      <h1>Welcome to the App</h1>
      <button onClick={() => navigate('/todo')} className="button">Todo List</button>
      <button onClick={() => navigate('/currency-converter')} className="button">Currency Converter</button>
    </div>
  );
};

export default HomePage;
