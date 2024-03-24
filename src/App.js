import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SettingNickname from './pages/Login/SettingNickname';
import Header from './pages/Header';
import MainPage1 from './pages/Home/MainPage1';
import MainPage4 from './pages/Home/MainPage4';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setting-nickname" element={<SettingNickname />} />
          <Route 
            path="/mainpage/1" 
            element={
            <>
              <Header /> <MainPage1 />
            </>
            }
          />
          <Route 
            path="/mainpage/4" 
            element={
            <>
              <Header /> <MainPage4 />
            </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
