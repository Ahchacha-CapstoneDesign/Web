import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../path/apiClient';


const Sidebar = () => {
  const [activePage, setActivePage] = useState('');
  const location = useLocation(); // 현재 위치를 가져옵니다.
  const navigate = useNavigate();

  useEffect(() => {
    setActivePage(location.pathname); // 현재 경로를 상태로 설정합니다.
  }, [location]);

  const handlePageChange = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // 로그아웃 요청을 서버로 보냅니다.
      const response = await apiClient.get('/users/logout');
      if (response.status === 200) {
        console.log("로그아웃 성공");
        localStorage.clear(); // 로컬 스토리지 클리어
        navigate('/'); // 홈페이지 혹은 로그인 페이지로 이동
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <SidebarContainer>
      <MenuTitle
        onClick={() => handlePageChange('/mypage/main')}
      >
        마이 페이지
      </MenuTitle>
      <ItemTitle>아차! 정보</ItemTitle>
      <MenuItem active={activePage === '/mypage/rentinglist'} onClick={() => handlePageChange('/mypage/rentinglist')}>대여 내역</MenuItem>
      <MenuItem active={activePage === '/mypage/registerlist'} onClick={() => handlePageChange('/mypage/registerlist')}>등록 내역</MenuItem>
      <ItemTitle>나의 정보</ItemTitle>
      <MenuItem 
        active={activePage === '/mypage/passwordcheck' || activePage === '/mypage/accountsettings'}
        onClick={() => handlePageChange('/mypage/passwordcheck')}
      >
        계정 관리
      </MenuItem>
      <MenuItem>My 리뷰</MenuItem>
      <Logout onClick={handleLogout}>로그아웃</Logout>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
    background-color: #000;
    position: fixed; // 위치 고정
    top: 12.44rem; // 상단 정렬
    left: 15rem; // 왼쪽 정렬
    display: flex;
    flex-direction: column;
    font-family: "Pretendard";
`;

const MenuTitle = styled.div`
    color: ${props => props.active ? '#00FFE0' : '#FFF'};
    margin-bottom: 2.5rem;
    cursor: pointer;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 800;
`;

const ItemTitle = styled.div`
    color: #fff;
    padding: 10px 0;
    cursor: pointer;
    margin-bottom: 1.2rem;
    font-size: 1.3rem;
    font-style: normal;
    font-weight: 600;   
`;

const MenuItem = styled.div`
    color: ${props => props.active ? '#00FFE0' : '#D9D9D9'};
    margin-bottom: 1rem;
    cursor: pointer;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
`;

const Logout = styled.div`
    color: #fff;
    margin-top: 8rem;
    cursor: pointer;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 800;
`;
