import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';

const MypageMain = () => {
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
    const nickname = localStorage.getItem('userNickname');
    setUserNickname(nickname);
  });

    return (
        <>
        <GlobalStyle /> 
            <Container>
                <ProfileContainer>
                  <ProfileInfo>
                      <Avatar src="/assets/img/Profile.png" alt="Profile" />
                      <ProfileDetails>
                        <NameAndRating>
                          <Name>{userName}</Name>
                          <Rating src="/assets/img/Star.png" alt="Star" />
                          <Ratingavg>(4.5)</Ratingavg>
                        </NameAndRating>
                        <Nickname>{userNickname}</Nickname>
                      </ProfileDetails>
                  </ProfileInfo>
                  <Editbutton>계정 관리</Editbutton>
                </ProfileContainer>
                
                <HistoryContainer>
                <Title>대여 내역</Title>
                <HistoryList>
                    <HistoryItem>대여한 아이템 1</HistoryItem>
                    <HistoryItem>대여한 아이템 2</HistoryItem>
                    <HistoryItem>대여한 아이템 3</HistoryItem>
                </HistoryList>
                </HistoryContainer>

                
            </Container>
      </ >
    );
  };
  
  export default MypageMain;

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
`;

const ProfileContainer = styled.div`
  width: 58rem;
  height: 6.5rem;
  margin-bottom: 15px;
  border: 0.5px solid #FFF;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  margin-top: 4rem;
  margin-left: 15rem;
  align-items: center;
`;

const HistoryContainer = styled.div`
  padding: 15px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  color: white;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 4.6875rem;
  height: 4.6875rem;
  margin-left: 2rem;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 3rem;
`;

const NameAndRating = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  color: #00FFE0;
  text-align: left;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  width: 4.875rem;
  margin-right: 0.8rem;
`;

const Rating = styled.img`
  width: 1.3rem;
  height: 1.3rem;
`;

const Ratingavg = styled.span` 
  color: #FFF;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-left: 0.5rem;
`;

const Nickname = styled.span`
  color: #00FFE0;
  text-align: left;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 0.8rem;
`;

const Editbutton = styled.button`
    width: 6.5rem;
    height: 2.1875rem;
    background-color: #000;
    color: #00FFE0;
    border-radius: 0.625rem;
    border: 0.5px solid #00FFE0;
    cursor: pointer;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    color: #00FFE0;
    font-family: "Pretendard";
    margin-top: 0.8rem;
    margin-left: 30rem;
`;

const HistoryList = styled.ul`
  color: white;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HistoryItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
  &:last-child {
    border-bottom: none;
  }
`;