import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from '../../path/apiClient';

const SettingUrl = () => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!url.trim()) {
      setErrorMessage('URL을 입력해주세요.');
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('url', url);

      await apiClient.post('/users/kakaoUrl', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      localStorage.setItem('kakaoUrl', url);
      console.log('URL 설정 성공:', url);
      navigate('/register/'); // 성공 후 이동할 경로
    } catch (error) {
      setErrorMessage("URL 설정 중 오류가 발생했습니다.");
      console.error("URL 설정 실패:", error);
    }
  };

  return (
    <>
      <GlobalStyle /> 
      <Container>
        <Hint>카카오톡 오픈채팅방 URL을 등록해주세요.</Hint>
        <Hint>My페이지-계정관리에서 수정이 가능합니다.</Hint>
        <Form onSubmit={handleSubmit}>
          <InputContainer>
            <Input
              type="text"
              placeholder="카카오톡 오픈채팅방 URL"
              value={url}
              onChange={handleUrlChange}
            />
          </InputContainer>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Button type="submit">URL 등록</Button>
        </Form>
      </Container>
    </>
  );
};

export default SettingUrl;

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
  justify-content: center; // Centers content vertically
  height: 150%; // 전체 화면 높이를 차지
`;

export const Header = styled.img`
    width: 17.58406rem;
    height: 6.59331rem;
    margin-bottom: 3rem;
`;

export const Hint = styled.p`
    color: #FFF;
    font-family: "Pretendard";
    font-size: 0.9375rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 0.2rem;
    color: white;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
  margin-top: 4rem;
`;

export const InputContainer = styled.div`
  position: relative;
`;

export const Input = styled.input`
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

export const Button = styled.button`
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

export const Counter = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  color: #FFFFFF;
  font-size: 0.8rem;
`;

const ErrorMessage = styled.div`
  color: #F00;
  font-family: "Pretendard";
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 800;
  position: absolute; 
  margin-top: 4rem; 
`;  