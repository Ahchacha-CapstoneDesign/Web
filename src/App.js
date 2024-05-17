import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SettingNickname from './pages/Login/SettingNickname';
import Header from './pages/Header';
import MainPage1 from './pages/Home/MainPage1';
import MainPage2 from './pages/Home/MainPage2';
import MainPage3 from './pages/Home/MainPage3';
import MainPage4 from './pages/Home/MainPage4';
import Loading from './pages/Login/Loading';
import Sidebar from './pages/Mypage/Sidebar';
import MypageMain from './pages/Mypage/MypageMain';
import PasswordCheck from './pages/Mypage/MyAccount/PasswordCheck';
import AccountSettings from './pages/Mypage/MyAccount/AccountSettings';
import MyRegister from './pages/Mypage/MyRegisterList.jsx';
import MyRentingList from './pages/Mypage/MyRentingList.jsx';
import MyReview from './pages/Mypage/MyReview.jsx';

import CommunityMain from './pages/Community/CommunityMain';
import RentMainPage from './pages/Rent/RentMainPage.jsx';
import RentFirstPage from './pages/Rent/RentFirstPage.jsx';
import ItemDetailPage from "./pages/Item/ItemDetailPage";
import PersonReservationPage from "./pages/Reservation/PersonReservationPage";
import PersonReservationDetailsPage from "./pages/Reservation/PersonReservationDetailsPage";
import OfficialReservationDetailsPage from "./pages/Reservation/OfficialReservationDetailsPage";
import OfficialReservationPage from "./pages/Reservation/OfficialReservationPage";
import PostCreationPage from './pages/Community/Posting.jsx';
import CommunityDetail from './pages/Community/CommunityDetail.jsx';
import EditPost from './pages/Community/EditPost.jsx';
import Register1 from './pages/Register/Register1.jsx';
import PersonRegisterDetails from "./pages/Register/PersonRegisterDetails";
import OfficialRegisterDetails from "./pages/Register/OfficialRegisterDetails";
import UpdatePersonRegisterDetails from "./pages/Register/UpdatePersonRegisterDetails";
import UpdateOfficialRegisterDetails from "./pages/Register/UpdateOfficialRegisterDetails";
import OwnerReview from './pages/Item/OwnerReview.jsx';


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
            <Route path="/mainpage/1" element={<> <Header /> <MainPage1 /> </> } />
            <Route path="/mainpage/2" element={<> <Header /> <MainPage2 /> </> } />
            <Route path="/mainpage/3" element={<> <Header /> <MainPage3 /> </> } />
            <Route path="/mainpage/4" element={<> <Header /> <MainPage4 /> </> } />
            
            {/* 대여 페이지 */}
            <Route path="/rent" element={<> <Header /> <RentFirstPage /> </> } />
            <Route path="/rent/mainpage" element={<> <Header /> <RentMainPage /> </> } />

            {/* 커뮤니티 */}
            <Route path="/community/main" element={<> <Header /> <CommunityMain /> </> } />
            <Route path="/community/posting" element={<> <Header /> <PostCreationPage /> </> } />
            <Route path="/community/editpost/:communityId" element={<> <Header /> <EditPost /> </> } />
            <Route path="/community/:communityId" element={<> <Header /> <CommunityDetail /> </> } />

            {/* 대여 페이지 */}
            <Route path="rent/itemdetail/:itemId" element={<> <Header /> <ItemDetailPage /> </> } />
            <Route path="rent/ownerreview/:userId" element={<> <Header /> <OwnerReview /> </> } />
            <Route path="rent/personreservation/:itemId" element={<> <Header /> <PersonReservationPage /> </> } />
            <Route path="rent/officialreservation/:itemId" element={<> <Header /> <OfficialReservationPage /> </> } />
            <Route path="rent/personreservationdetails/:itemId" element={<> <Header /> <PersonReservationDetailsPage /> </> } />
            <Route path="rent/officialreservationdetails/:itemId" element={<> <Header /> <OfficialReservationDetailsPage /> </> } />

            {/* 등록 페이지 */}
            <Route path="/register" element={<> <Header /> <Register1 /> </>}/>
            <Route path="/register/personregisterdetails" element={<> <Header /> <PersonRegisterDetails /> </> } />
            <Route path="/register/officialregisterdetails" element={<> <Header /> <OfficialRegisterDetails /> </> } />
            <Route path="/register/personUpdate/:itemId" element={<><Header /> <UpdatePersonRegisterDetails /></> } />
            <Route path="/register/officialUpdate/:itemId" element={<><Header /> <UpdateOfficialRegisterDetails /></> } />

            {/* 마이 페이지 */}
            <Route path="/mypage/main" element={<> <Header /> <Sidebar /> <MypageMain /> </> } />
            <Route path="/mypage/registerlist" element={<> <Header /> <Sidebar /> <MyRegister /> </> } />
            <Route path="/mypage/rentinglist" element={<> <Header /> <Sidebar /> <MyRentingList /> </> } />
            <Route path="/mypage/passwordcheck" element={<> <Header /> <Sidebar /> <PasswordCheck /> </> } />
            <Route path="/mypage/accountsettings" element={<> <Header /> <Sidebar /> <AccountSettings /> </> } />
            <Route path="/mypage/myreview" element={<> <Header /> <Sidebar /> <MyReview /> </> } />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
