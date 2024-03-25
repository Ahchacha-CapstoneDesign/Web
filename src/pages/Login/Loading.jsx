// Loading.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';


const Loading = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
  
    useEffect(() => {

        const name = localStorage.getItem('userName');
        setUserName(name);
        const timer = setTimeout(() => {
            navigate('/mainpage/1');
        }, 5000);
    
        return () => clearTimeout(timer);
    }, [navigate]);
  
    return (
        <>
            <GlobalStyle /> 
            <LoadingContainer>
                <Name>{userName} 님!</Name>
                <LoadingText src="/assets/img/Welcome.png" alt="Welcome to Ah!Chacha" />
                <Spinner />
            </LoadingContainer>
        </>
    );
  };
  
  export default Loading;

export const GlobalStyle = createGlobalStyle`
    html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        background-color: #000; // body 전체의 배경색을 검은색으로 설정
        margin-top: 75px;
        overflow: hidden;
    }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  margin-top: 5rem;
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top-color: #00ffe0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 2s linear infinite;
`;

const Name = styled.div`
    color: #FFF;
    font-size: 3.125rem;
    font-style: normal;
    font-weight: 800;
`;

const LoadingText = styled.img`
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 41.58406rem;
    height: 4.5625rem;
`;

