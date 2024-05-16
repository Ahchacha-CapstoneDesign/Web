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
  const [averageScore, setAverageScore] = useState(0); // 평균 점수 상태 추가
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
    const ownerScore = parseFloat(localStorage.getItem('ownerReviewScore'));
    const renterScore = parseFloat(localStorage.getItem('renterReviewScore'));
    
    let validScores = [];
    if (!isNaN(ownerScore)) validScores.push(ownerScore);
    if (!isNaN(renterScore)) validScores.push(renterScore);

    if (validScores.length === 1) {
      setAverageScore(validScores[0].toFixed(1));
    } else if (validScores.length === 2) {
      const avgScore = (validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length).toFixed(1);
      setAverageScore(avgScore);
    } else {
      // 두 점수 모두 유효하지 않을 때
      setAverageScore('0.0');
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
                        <Nickname>{userNickname}</Nickname>
                        <RatingDetail>
                          <Rating src="/assets/img/Star.png" alt="Star" />
                          <Ratingavg>{averageScore}</Ratingavg>
                        </RatingDetail>
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 2rem;
`;

const Avatar = styled.img`
  width: 4.6875rem;
  height: 4.6875rem;
  border-radius: 50%;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

const RatingDetail = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-left: -1rem;
  margin-bottom: 2rem;
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
  margin-left: 1rem;
`;

const Nickname = styled.span`
  color: #00FFE0;
  font-family: "Pretendard";
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 600;
  margin-top: 1rem;
`;