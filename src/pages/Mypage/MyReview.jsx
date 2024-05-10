import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';

const MyReview = () => {
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
    const nickname = localStorage.getItem('userNickname');
    setUserNickname(nickname);
    const storedProfileImage = localStorage.getItem('profileImageUrl');
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    } else {
      // 저장된 이미지가 없을 경우 기본 이미지 경로 설정
      setProfileImage('/assets/img/Profile.png');
    }
  });

  const handlePageChange = (path) => {
    navigate(path);
  };

    return (
        <>
        <GlobalStyle /> 
            <Container>
                <ProfileContainer>
                  <ProfileInfo>
                    <Avatar src={profileImage || "/assets/img/Profile.png"} alt="Profile" />
                      <ProfileDetails>
                        <NameAndRating>
                          {/* <Name>{userName}</Name> */}
                          <Rating src="/assets/img/Star.png" alt="Star" />
                          <Ratingavg>(4.5)</Ratingavg>
                        </NameAndRating>
                        <Nickname>{userNickname}</Nickname>
                      </ProfileDetails>
                  </ProfileInfo>
                </ProfileContainer>
                
                <RentingInfoBox>
                  <Reserved>대여 후기 0</Reserved>
                  <Returned>반납 완료 0</Returned>
                </RentingInfoBox>

                <RentingTitleContainer>
                   <RentingTitle>대여후기</RentingTitle> {/*대여 후기/거래 후기 선택에 따라 변경 */}
                </RentingTitleContainer>

                <ItemContainer>
                  <ItemImage/>
                  <ItemTitle>제목</ItemTitle>
                  <ItemPrice>0000원</ItemPrice>
                  <ItemStatus>대여중</ItemStatus>
                </ItemContainer>
            </Container>
      </ >
    );
  };
  
  export default MyReview;

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

const scoreContainer = styled.div`
  display: flex;
  width: 59.5rem;
  height: 6rem;
  margin-top: 1rem;
  margin-left: 15rem;
  border: 0.5px solid #FFF;
`;

const ItemContainer = styled.div`
  display: flex;
  width: 59.5rem;
  height: 6rem;
  margin-top: 1rem;
  margin-left: 15rem;
  border-bottom: 0.5px solid #FFF;
`;



const ItemImage = styled.img`
  width: 100px; /* 원하는 이미지 너비로 조정 */
  height: auto; /* 높이 자동 조정 */
  margin-right: 1rem; /* 이미지와 제목 사이 여백 조정 */
`;

const ItemTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.2rem;
`;

const ItemPrice = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  margin-left: 1rem; /* 가격과 상태 사이 여백 조정 */
`;

const ItemStatus = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 700;
`;

const RentingTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

const RentingTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  margin-right: 38rem;
`;

const RentingInfoBox = styled.div`
  background: #343434;
  display: flex;
  justify-content: space-between;
  width: 59.5rem;
  height: 2.5rem;
  margin-top: 0rem;
  margin-left: 15rem;
  align-items: center;
  border-radius: 12px;
`;

const Reserved = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
  border-right: 1px solid #FFF;
`;

const Renting = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
  border-right: 1px solid #FFF;
`;

const Returned = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
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
  border-radius: 5px;
  padding: 10px;
  display: flex;
  margin-top: 4rem;
  margin-left: 15rem;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 2rem;
  
`;

const Avatar = styled.img`
  width: 4.6875rem;
  height: 4.6875rem;
  margin-left: 2rem;
  border-radius: 50%;
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

const Break = styled.div`
  margin-bottom: 0.75rem; /* 원하는 간격 조정 */
`;