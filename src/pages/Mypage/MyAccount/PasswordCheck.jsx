import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';  
import apiClient from '../../../path/apiClient';


const PasswordCheck = () => {
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userName'));
  }, []);

  const handlePasswordCheck = async (event) => {
    event.preventDefault();
  
    // 로컬 스토리지에서 username을 가져옵니다.
    const username = localStorage.getItem('userName');
  
    if (!username) {
      setError('로그인 정보가 없습니다. 다시 로그인 해주세요.');
      return;
    }
  
    try {
      // axios를 사용하여 요청을 보낼 때 'Content-Type': 'text/plain'으로 설정해야 합니다.
      const response = await apiClient.post('/users/validatePassword', password, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
  
      if (response.status === 200) {
        // 비밀번호 확인이 성공하면 계정 설정 페이지로 이동합니다.
        navigate('/mypage/accountsettings');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // 서버로부터 받은 에러 메시지를 사용
        setError(error.response.data);
      } else {
        // 일반적인 에러 메시지
        setError('비밀번호 검증에 실패했습니다.');
      }
      console.error("Password check failed:", error);
    }
  };

  return (
    <>
    <GlobalStyle /> 
      <PasswordContainer>
        <PasswordForm onSubmit={handlePasswordCheck}>
          <PasswordInput 
            type={passwordShown ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon 
            src="/assets/img/Eye.png" 
            onClick={togglePasswordVisibility}
            alt="비밀번호 보기/숨기기" 
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Confirmbutton type="submit">확인</Confirmbutton>
        </PasswordForm>
      </PasswordContainer>
    </>
  );
};

export default PasswordCheck;

export const GlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
    overflow: hidden;
  }
`;

const PasswordContainer = styled.div`
  font-family: "Pretendard";
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // 추가된 부분
  height: 100%;
  margin-top: 9rem;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const PasswordInput = styled.input`
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
  font-size: 0.9375rem;
  font-weight: 800;
  position: absolute;
  margin-top: 5rem;
`;

export const Confirmbutton = styled.button`
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
