import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SettingNickname from './pages/Login/SettingNickname';
import Header from './pages/Header';

import MainPage2 from './pages/Home/MainPage2'; import MainPage3 from './pages/Home/MainPage3.jsx';



import MainPage1 from './pages/Home/MainPage1';
import MainPage4 from './pages/Home/MainPage4';
import Loading from './pages/Login/Loading';
import Sidebar from './pages/Mypage/Sidebar';
import MypageMain from './pages/Mypage/MypageMain';
import PasswordCheck from './pages/Mypage/MyAccount/PasswordCheck';
import AccountSettings from './pages/Mypage/MyAccount/AccountSettings';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/" element={<Login />} />
          {/* 닉네임 설정 */}
          <Route path="/setting-nickname" element={<SettingNickname />} />
          {/* 로딩 페이지 */}
          <Route path="/loading" element={<Loading />} />
          {/* 메인 페이지 */}
          <Route 
            path="/mainpage/1" 
            element={
            <>
              <Header /> <MainPage1 />
            </>
            }
          />
          <Route path="/mainpage/2" element={<> <Header /> <MainPage2 /> </>}/>
          <Route path="/mainpage/3" element={<> <Header /> <MainPage3 /> </>}/>

          <Route 
            path="/mainpage/4" 
            element={
            <>
              <Header /> <MainPage4 />
            </>
            }
          />
          {/* 마이 페이지 */}
          <Route 
            path="/mypage/main" 
            element={
            <>
              <Header /> <Sidebar /> <MypageMain />
            </>
            }
          />
          <Route 
            path="/mypage/passwordcheck" 
            element={
            <>
              <Header /> <Sidebar /> <PasswordCheck />
            </>
            }
          />
          <Route 
            path="/mypage/accountsettings" 
            element={
            <>
              <Header /> <Sidebar /> <AccountSettings />
            </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
