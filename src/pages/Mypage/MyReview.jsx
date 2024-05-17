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
  const [activeReviewType, setActiveReviewType] = useState('rental');
  const [isActiveMyReview, setIsActiveMyReview] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // 처음에 보여줄 리뷰 수
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

    fetchReviews();
  } ,[isActiveMyReview, activeReviewType]);

  const fetchReviews = async () => {
    let url = '';
    if (isActiveMyReview) {
      url = activeReviewType === 'rental' ? '/review/getCreatedReviewToOwnerByMe' : '/review/getCreatedReviewToRenterByMe';
    } else {
      url = activeReviewType === 'rental' ? '/review/getOtherCreateReviewToMeInMyRegisterItem' : '/review/getOtherCreateReviewToMeInMyRentedItem';
    }
    const response = await apiClient.get(url);
    setReviews(response.data.content); // 예시로 .content를 사용했습니다.
  };

  const isOwnerEndpoint = () => {
    return (isActiveMyReview && activeReviewType === 'rental') || (!isActiveMyReview && activeReviewType !== 'rental');
  };

  const handleReviewTypeChange = (type) => {
    setActiveReviewType(type);
  };

  const handleReviewSectionChange = (isMyReview) => {
    setIsActiveMyReview(isMyReview);
  };

  const handlePageChange = (path) => {
    navigate(path);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3); // 현재 보이는 리뷰 수를 3개 증가
  };

  const StarRating = ({ score }) => {
    const fullStars = Math.floor(score);
    const emptyStars = 5 - fullStars;
  
    return (
      <div>
        {Array.from({ length: fullStars }, (_, index) => (
          <img key={`full-${index}`} src="/assets/img/YellowStar.png" alt="Full Star" style={{ width: '20px' }} />
        ))}
        {Array.from({ length: emptyStars }, (_, index) => (
          <img key={`empty-${index}`} src="/assets/img/GrayStar.png" alt="Empty Star" style={{ width: '20px' }} />
        ))}
      </div>
    );
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
                  <Reserved onClick={() => handleReviewSectionChange(true)} isActive={isActiveMyReview}>
                    내가 쓴 리뷰
                  </Reserved>
                  <Returned onClick={() => handleReviewSectionChange(false)} isActive={!isActiveMyReview}>
                    나에게 쓴 리뷰
                  </Returned>
                </RentingInfoBox>

                <RentingTitleContainer>
                   <RentingTitle onClick={() => handleReviewTypeChange('rental')} isActive={activeReviewType === 'rental'}>
                    대여 후기
                  </RentingTitle>
                   <DealTitle onClick={() => handleReviewTypeChange('deal')} isActive={activeReviewType === 'deal'}>
                    거래 후기
                  </DealTitle>
                </RentingTitleContainer>

                <ReviewList>
                  {reviews.slice(0, visibleCount).map(review => (
                    <ReviewItem key={review.reviewId}>
                      <ProfileItem>
                        <ProfileImg src={isOwnerEndpoint() ? review.ownerProfile || "/assets/img/Profile.png" : review.renterProfile || "/assets/img/Profile.png"} alt="Profile" />
                        <NickNameAndRating>
                          <UserNickname>{isOwnerEndpoint() ? review.ownerNickName : review.renterNickName}</UserNickname>
                          <StarRating score={review.reviewScore} />
                        </NickNameAndRating>
                      </ProfileItem>
                      <ItemTitle>c타입 충전기 &gt;</ItemTitle>
                      <Comment>{review.reviewComment}</Comment>
                    </ReviewItem>
                  ))}
                </ReviewList>
                {visibleCount < reviews.length && (
                  <MoreViewButton onClick={handleLoadMore}>더 보기</MoreViewButton> // 리뷰가 더 있을 경우 더 보기 버튼 표시
                )}
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
      font-family: "Pretendard";
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
  }

  /* 스크롤바 전체 스타일 */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  /* 스크롤바 트랙(바탕) 스타일 */
  ::-webkit-scrollbar-track {
    background: transparent; /* 트랙의 배경색 */
  }

  /* 스크롤바 핸들(움직이는 부분) 스타일 */
  ::-webkit-scrollbar-thumb {
    background: #00FFE0; /* 핸들의 배경색 */
    border-radius: 5px;
  }
`;

const RentingTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
`;

const RentingTitle = styled.button`
  color: ${(props) => (props.isActive ? '#00FFE0' : 'white')};
  background-color: transparent;
  border: none;
  font-family: "Pretendard";
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 700;
  margin-left: -22rem;
  width: 7rem;
  border-right: 1px solid white;
  cursor: pointer;
`;

const DealTitle = styled.button`
  color: ${(props) => (props.isActive ? '#00FFE0' : 'white')};
  background-color: transparent;
  border: none;
  font-family: "Pretendard";
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 700;
  margin-left: 0.7rem;
  cursor: pointer;
`;

const RentingInfoBox = styled.div`
  background: #1F1F1F;
  display: flex;
  justify-content: space-between;
  width: 59.5rem;
  height: 4rem;
  margin-top: 0rem;
  margin-left: 15rem;
  align-items: center;
  border-radius: 10px;
`;

const Reserved = styled.button`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  height: 100%;
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#00FFE0' : 'white')};
  border-bottom: ${(props) => (props.isActive ? '2px solid #00FFE0' : 'none')};
`;

const Returned = styled.button`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  height: 100%;
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#00FFE0' : 'white')};
  border-bottom: ${(props) => (props.isActive ? '2px solid #00FFE0' : 'none')};
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

const ReviewList = styled.div`
`;

const ProfileItem = styled.div `
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NickNameAndRating = styled.div `
  display: flex;
  flex-direction: column;
`;

const UserNickname = styled.span`
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  margin-top: 3rem;
  width: 60rem;
  margin-left: 15rem;
  border: none;
  border-bottom: 2px solid #5A5A5A; /* 각 리뷰 항목 아래에 구분선 추가 */
`;

const ProfileImg = styled.img`
  width: 3.5rem; 
  height: 3.5rem;
  border-radius: 50%; 
  margin-right: 20px;
`;

const ItemTitle = styled.button`
  font-size: 1rem;
  color: white; /* 아이템 제목 색상 */
  margin-top: 1.5rem;
  margin-left: 1rem;
  height: 2rem;
  border: 1px solid #B2B2B2;
  background-color: transparent;
  display: inline-block; /* 내용에 따라 너비가 조정되도록 */
  white-space: nowrap;
  max-width: 10rem;
`;

const Comment = styled.div`
  font-size: 1.2rem;
  color: #FFF;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  margin-left: 1rem;
  white-space: pre-wrap; /* 내용에 줄바꿈 적용 */
`;

const MoreViewButton = styled.button `
  margin-left: 15rem;
  color: #9C9C9C;
  background-color: transparent;
  border: none;
  font-family: 'Pretendard';
  font-size: 1.2rem;
  font-weight: 500;
  padding-left: 30px; /* 텍스트 왼쪽에 공간 추가 */
  background-image: url('/assets/img/Plus.png');
  background-repeat: no-repeat;
  background-size: 20px 20px; /* 이미지 크기 조정 */
  background-position: left center; 
  cursor: pointer;
  margin-top: 1rem;
`;
