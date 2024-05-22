import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import apiClient from "../path/apiClient";

const Header = () => {
  const [activePage, setActivePage] = useState('');
  const location = useLocation(); // 현재 위치를 가져옵니다.
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userTrack, setUserTrack] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };


  useEffect(() => {
    setActivePage(location.pathname); // 현재 경로를 상태로 설정합니다.
  }, [location]);

  const handlePageChange = (path) => {
    navigate(path);
  };

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notification');
      const notifications = response.data;
      const hasUnread = notifications.some(notification => !notification.read);
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
    const personOrOfficial = localStorage.getItem('personOrOfficial');
    let track;
    if (personOrOfficial === "OFFICIAL") {
      track = localStorage.getItem('officialName'); // 공식 사용자일 경우 officialName 사용
    } else if (personOrOfficial === "ADMIN") {
      track = "관리자"; // 관리자일 경우 "관리자"라는 텍스트 사용
    } else {
      track = localStorage.getItem('userTrack'); // 일반 사용자일 경우 userTrack 사용
    }
    setUserTrack(track);
  }, []);


  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo src="/assets/img/Logo_login.png" alt="Ah!Chacha"
          onClick={() => handlePageChange('/mainpage/1')}
        />
        <Nav>
          <NavItem active={activePage.startsWith('/mainpage/')}
            onClick={() => handlePageChange('/mainpage/1')}>홈</NavItem>
          <NavItem active={activePage.startsWith('/rent/')}
            onClick={() => handlePageChange('/rent/')}>아차! 대여</NavItem>
          <NavItem active={activePage.startsWith('/register/')}
            onClick={() => handlePageChange('/register/')}>아차! 등록</NavItem>
          <NavItem active={activePage === '/talk'}
            onClick={() => handlePageChange('/talk')}>아차! 톡</NavItem>
          <NavItem active={activePage.startsWith('/community/')}
            onClick={() => handlePageChange('/community/main')}>아차! 게시판</NavItem>
          <NavItem active={activePage.startsWith('/mypage/')}
            onClick={() => handlePageChange('/mypage/main')}>마이페이지</NavItem>
        </Nav>  
        <UserAndNotificationContainer>
          <UserInfo>
            <UserTrack>{userTrack}</UserTrack>
            <UserName>{userName}님</UserName>
          </UserInfo>
          <NotificationIcon onClick={toggleModal} 
            src={hasUnreadNotifications ? "/assets/img/NotificationPlus.png" : "/assets/img/Notification.png"} 
            alt="알림" />          
          <NotificationModal isOpen={modalOpen} onClose={toggleModal} onNotificationsChange={fetchNotifications}/>
        </UserAndNotificationContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;

export const HeaderContainer = styled.header`
  font-family:"Pretendard";
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #000;
  color: #fff;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between; /* 내부 요소들을 양 끝으로 정렬 */
  align-items: center;
  width: 80%; /* 혹은 디자인에 맞게 조정 */
`;

export const Logo = styled.img`
  cursor: pointer;
  width: 252.35px;
  height: 95.49px;
`;

export const Nav = styled.nav`
  display: flex;
  /* 내비게이션 아이템들 사이의 간격 등을 조정합니다. */
`;

export const activeBar = css`
  content: '';
  display: block;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 80%;
  height: 4px;
  background-color: #00FFE0;
`;

export const NavItem = styled.div`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  color: ${props => props.active ? '#00FFE0' : '#FFF'};
  cursor: pointer;
  position: relative;
  padding: 0 1.5rem;

  &:hover {
    color: #00FFE0;
  }

  &::after {
    content: '';
    display: block;
    width: 4.5rem;
    height: 0.125rem;
    background: #00FFE0;
    border-radius: 2px;
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%) scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }
`;

export const UserAndNotificationContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

export const UserName = styled.span`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  color: #00FFE0;
  margin-right: 0.5rem;
`;

export const UserTrack = styled.span`
font-size: 1.25rem;
font-style: normal;
font-weight: 700;
color: #00FFE0;
margin-right: 0.5rem;
`;

export const NotificationIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  /* 알림 아이콘의 스타일을 설정합니다. */
`;