import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from '../../path/apiClient';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();
  const DEFAULT_IMAGE_URL = '/assets/img/Profile.png';

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/users/login', {
        id: username,
        passwd: password,
      });

      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userTrack', response.data.track1);
      localStorage.setItem('userTrack2', response.data.track2);
      localStorage.setItem('userNickname', response.data.nickname);
      localStorage.setItem('userPhoneNumber', response.data.phoneNumber);
      localStorage.setItem('userID', response.data.id);
      localStorage.setItem('userGrade', response.data.grade);
      localStorage.setItem('userStatus', response.data.status);
      localStorage.setItem('personOrOfficial', response.data.personOrOfficial);
      // 이미지 URL이 없거나 빈 문자열인 경우, 기본 이미지 URL을 사용
      const imageUrl = response.data.defaultProfile || DEFAULT_IMAGE_URL;
      localStorage.setItem('profileImageUrl', imageUrl);
      localStorage.setItem('ownerReviewScore', response.data.ownerReviewScore);
      localStorage.setItem('renterReviewScore', response.data.renterReviewScore);

      // 로그인 후 처리 로직
      if (!response.data.nickname) {
        navigate('/setting-nickname');
      } else {
        navigate('/loading');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginFailed(true);
    }
  };

  return (
    <>
    <GlobalStyle /> 
    <LoginContainer>
      <LoginHeader
        src="/assets/img/Logo_login.png" 
        alt="AhchachaLogo"
      />
      <LoginHint>종합정보시스템의 ID/PW를 입력해주세요</LoginHint>
      <LoginForm onSubmit={handleLogin}>
        <LoginInput 
          type="text" 
          id="id" 
          placeholder="학번 또는 사번" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordContainer>
          <LoginInput 
            type={passwordShown ? "text" : "password"}
            id="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon src="/assets/img/Eye.png"  onClick={togglePasswordVisibility} />
        </PasswordContainer>
        {loginFailed && <ErrorMessage>
          <p>아차차! 로그인 실패! </p>
          <p>아이디와 비밀번호가 일치하지 않습니다</p>
          </ErrorMessage>}
        <LoginButton type="submit">로그인</LoginButton>
      </LoginForm>
      <LoginFooter>
        <p>ID/PW를 잊고 계신다면 학생 지원팀에 문의하세요.</p>
        <p>어떠한 데이터도 수집하지 않습니다.</p>
      </LoginFooter>
    </LoginContainer>
    </>
  );
};

export default Login;


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

export const LoginContainer = styled.div`
    font-family: "Pretendard";
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const LoginHeader = styled.img`
    width: 17.58406rem;
    height: 6.59331rem;
    margin-bottom: 2.5rem;
`;

export const LoginHint = styled.div`
    color: #FFF;
    font-family: "Pretendard";
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 1.5rem;
    color: white;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

export const LoginInput = styled.input`
    font-size: 1.25rem;
    font-style: normal;
    font-family: "Pretendard";
    font-weight: 100;
    margin-bottom: 20px;
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

const EyeIcon = styled.img`
  position: absolute;
  right: 10px;
  top: 10px;
  height: 1.75rem;
  width: 1.75rem;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #F00;
  font-family: "Pretendard";
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 800;
  position: absolute; 
  top: 7rem; 
  left: 1rem;
`;  

export const LoginButton = styled.button`
    width: 22.25rem;
    height: 3.0625rem;
    font-family: "Pretendard";  
    padding: 10px;
    background-color: #00FFE0;
    color: #000;
    text-align: center;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 3.7rem;
    align-self: center;
`;

export const LoginFooter = styled.div`
  color: #B6B6B6;
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: left;
  margin-top: 1.81rem;
  line-height: normal;
`;