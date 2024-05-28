import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MainPage4 = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치를 저장할 상태
    const scrollThreshold = 100; // 스크롤 임계값 설정

    useEffect(() => {
      const handleWheel = (e) => {
          setScrollPosition(prev => {
              const newScrollPosition = prev + e.deltaY;
              if (newScrollPosition <= -scrollThreshold) {
                  navigate('/mainpage/3');
                  return 0; // 페이지가 변경되면 스크롤 위치를 초기화
              }
              return newScrollPosition;
          });
      };

      window.addEventListener('wheel', handleWheel);

      return () => window.removeEventListener('wheel', handleWheel);
  }, [navigate]);
    

    return (
        <>
        <GlobalStyle /> 
        <ScrollIndicators>
            <Circle active={isScrolled} onClick={() => navigate('/mainpage/1')} />
            <Circle active={isScrolled} onClick={() => navigate('/mainpage/2')} />
            <Circle active={isScrolled} onClick={() => navigate('/mainpage/3')} />
            <Circle active={!isScrolled} onClick={() => navigate('/mainpage/4')} />
            <Scroll />
        </ScrollIndicators>
        </>
    );
};

export default MainPage4;

export const GlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
    overflow: hidden;
    background-image: url('/assets/img/MainBackground4.png'); // 배경 이미지 설정
    background-size: cover; // 배경 이미지가 전체를 커버하도록 설정
    background-position: center;
  }
`;

const ScrollIndicators = styled.div`
  position: fixed;
  margin-left: 15rem;
  top: 60%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#D6F800' : '#F8F8F8'};
  margin: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const Scroll = styled.div`
  width: 4rem;
  height: 2rem;
  background-image: url('/assets/img/Scroll.png'); // 배경 이미지 설정
  background-repeat: no-repeat;
  background-size: contain; // 배경 이미지 크기 조절
  background-position: center; // 배경 이미지 위치
  margin-left: -2.2rem;
  margin-top: 0.5rem;
`;