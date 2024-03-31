import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const MypageMain = () => {
    return (
        <>
        <GlobalStyle /> 
            <RightContainer>
                <ProfileContainer>
                <ProfileInfo>
                    <Avatar src="/assets/img/Profile.png" alt="Profile" />
                    <ProfileDetails>
                    <Name>사용자 이름</Name>
                    <Rating>★ 4.5</Rating>
                    <Nickname>@nickname</Nickname>
                    </ProfileDetails>
                </ProfileInfo>
                <button>계정 관리</button>
                </ProfileContainer>
                
                <HistoryContainer>
                <Title>대여 내역</Title>
                <HistoryList>
                    <HistoryItem>대여한 아이템 1</HistoryItem>
                    <HistoryItem>대여한 아이템 2</HistoryItem>
                    <HistoryItem>대여한 아이템 3</HistoryItem>
                </HistoryList>
                </HistoryContainer>

                
            </RightContainer>
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

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileContainer = styled.div`
  padding: 15px;
  margin-bottom: 15px;
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
  border-radius: 50%;
  margin-right: 10px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Rating = styled.span`
  /* 스타일 추가 예정 */
`;

const Nickname = styled.span`
  color: white;
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