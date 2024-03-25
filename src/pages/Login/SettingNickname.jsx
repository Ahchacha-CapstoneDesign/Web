import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import config from '../../path/config';
import apiClient from '../../path/apiClient';

// SettingNickname 컴포넌트 구현
const SettingNickname = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSetNickname = async (event) => {
    event.preventDefault();
    
    try {
      // FormData 객체를 사용하여 nickname을 추가합니다.
      const formData = new URLSearchParams();
      formData.append('nickname', nickname);
      
      // apiClient 인스턴스를 사용하여 요청을 보냅니다.
      await apiClient.post('/users/nickname', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('닉네임 설정:', nickname);
      navigate('/loading');
    } catch (error) {
      console.error("닉네임 설정 실패:", error);
    }
  };

  return (
    <>
        <GlobalStyle /> 
        <NicknameContainer>
        <NicknameHeader
            src="/assets/img/Logo_login.png" 
            alt="AhchachaLogo"
        />
        <NicknameHint>처음 오시는 군요! 닉네임을 설정해주세요</NicknameHint>
        <NicknameSettingForm onSubmit={handleSetNickname}>
          <NicknameInputContainer> 
            <NicknameInput
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={handleNicknameChange}
                maxLength="8" // 닉네임 길이 제한
            />
            <NicknameCounter>{`${nickname.length}/8`}</NicknameCounter>
          </NicknameInputContainer>
          <NicknameButton type="submit">아차차 시작</NicknameButton>
        </NicknameSettingForm>
        </NicknameContainer>
    </ >
  );
};

export default SettingNickname;

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

export const NicknameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
  
`;

export const NicknameHeader = styled.img`
    width: 17.58406rem;
    height: 6.59331rem;
    margin-bottom: 3rem;
`;

export const NicknameHint = styled.p`
    color: #FFF;
    font-family: "Pretendard";
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 4rem;
    color: white;
`;

export const NicknameSettingForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
`;

export const NicknameInputContainer = styled.div`
  position: relative;
`;

export const NicknameInput = styled.input`
    font-size: 1.25rem;
    font-style: normal;
    font-family: "Pretendard";
    font-weight: 100;
    padding: 10px;
    width: 22.25rem;
    background-color: transparent; // 배경색을 투명하게 설정
    color:white;
    outline: none;
    box-shadow: none;
    border: 0;
    border-bottom: 3px solid #00FFE0; 
    &::placeholder {
        color: rgba(255, 255, 255, 0.5); // 플레이스홀더 글자 색상
    }
`;

export const NicknameButton = styled.button`
    width: 22.25rem;
    height: 3.0625rem;
    font-family: "Pretendard";  
    padding: 10px;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 600;
    background-color: #00FFE0;
    color: #000;
    text-align: center;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 3.7rem;
`;

export const NicknameCounter = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  color: #FFFFFF;
  font-size: 0.8rem;
`;
