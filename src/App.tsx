import React , { useState }  from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink  } from 'react-router-dom';
import Todo from './components/Todo';
import CurrencyConverter from './components/CurrencyConverter';
import Home from './components/Home';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#131052',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={darkMode ? 'dark-mode' : 'light-mode'}>
          <nav className="navbar">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/todo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Todo List</NavLink>
            <NavLink to="/currency-converter" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Currency Converter</NavLink>
            <button className="modebutton" onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};
export default App;
