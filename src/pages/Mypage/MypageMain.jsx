import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';

const MypageMain = () => {
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();
  const [rentData, setRentData] = useState({ reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });
  const [registerData, setRegisterData] = useState({ reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setUserNickname(localStorage.getItem('userNickname'));
    setProfileImage(localStorage.getItem('profileImageUrl') || '/assets/img/Profile.png');
    fetchRentData();
    fetchRegisterData();
  }, []);

  const fetchRentData = async () => {
    try {
      const response = await apiClient.get('/reservation/myItems');
      const data = response.data.content;
      setRentData({
        reservedCount: data.filter(item => item.rentingStatus === 'RESERVED').length,
        rentingCount: data.filter(item => item.rentingStatus === 'RENTING').length,
        returnedCount: data.filter(item => item.rentingStatus === 'RETURNED').length,
        items: data.slice(0, 3)
      });
    } catch (error) {
      console.error('Failed to fetch rent data:', error);
    }
  };

  const fetchRegisterData = async () => {
    try {
      const response = await apiClient.get('/items/myItems');
      const data = response.data.content;
      setRegisterData({
        reservedCount: data.filter(item => item.rentingStatus === 'RESERVED').length,
        rentingCount: data.filter(item => item.rentingStatus === 'RENTING').length,
        returnedCount: data.filter(item => item.rentingStatus === 'RETURNED').length,
        items: data.slice(0, 3)
      });
    } catch (error) {
      console.error('Failed to fetch register data:', error);
    }
  };
  
  const statusColors = {
    NONE: { text: "대여 가능", color: "white" },
    RESERVED: { text: "예약 완료", color: "#00FFF0" },
    RENTING: { text: "대여중", color: "#52FF00" },
    RETURNED: { text: "반납완료", color: "#F00" }
  };
  
  const getStatusStyle = (status) => ({
    color: statusColors[status]?.color || "white",
  });


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
                          <Name>{userName}</Name>
                          <Rating src="/assets/img/Star.png" alt="Star" />
                          <Ratingavg>(4.5)</Ratingavg>
                        </NameAndRating>
                        <Nickname>{userNickname}</Nickname>
                      </ProfileDetails>
                  </ProfileInfo>
                  <Editbutton onClick={() => handlePageChange('/mypage/passwordcheck')}>
                    계정 관리
                  </Editbutton>
                </ProfileContainer>

                <RentingTitleContainer>
                  <RentingTitle>대여 내역</RentingTitle>
                  <MoreView onClick={() => handlePageChange('/mypage/rentinglist')}>더보기&gt;</MoreView>
                </RentingTitleContainer>
                
                <RentingInfoBox>
                  <Reserved>예약 완료<Break/>{rentData.reservedCount}</Reserved>
                  <Renting>대여중<Break/>{rentData.rentingCount}</Renting>
                  <Returned>반납 완료<Break/>{rentData.returnedCount}</Returned>
                </RentingInfoBox>

                {rentData.items.map(item => (
                  <ItemContainer key={item.id}>
                    <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} />
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemPrice>{item.totalPrice}원</ItemPrice>
                    <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                  </ItemContainer>
                ))}

                <RentingTitleContainer>
                  <RentingTitle>등록 내역</RentingTitle>
                  <MoreView onClick={() => handlePageChange('/mypage/registerlist')}>더보기&gt;</MoreView>
                </RentingTitleContainer>
                
                <RentingInfoBox>
                  <Reserved>예약 완료<Break/>{registerData.reservedCount}</Reserved>
                  <Renting>대여중<Break/>{registerData.rentingCount}</Renting>
                  <Returned>반납 완료<Break/>{registerData.returnedCount}</Returned>
                </RentingInfoBox>

                {registerData.items.map(item => (
                  <ItemContainer key={item.id}>
                    <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} />
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemPrice>{item.pricePerHour}원/시간</ItemPrice>
                    <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                  </ItemContainer>
                ))}
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

const ItemContainer = styled.div`
  display: flex;
  width: 59.5rem;
  height: 7rem;
  margin-top: 1rem;
  margin-left: 15rem;
  border-bottom: 0.5px solid #FFF;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 20px;
  border: 1px solid white;
  margin-left: 2rem;
`;

const ItemTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.2rem;
  font-weight: 500;
  width: 15.875rem;
  margin-left: 2rem;
`;

const ItemPrice = styled.div`
  width: 6rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
  margin-left: 13rem;
`;

const ItemStatus = styled.div`
  font-family: 'Pretendard';
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  margin-left: 8rem;
  ${(props) => `color: ${props.color}; background-color: ${props.backgroundColor};`}
`;

const RentingTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
  margin-left: 14rem;
`;

const RentingTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
`;

const MoreView = styled.div`
  color: gray;
  font-family: "Pretendard";
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  cursor: pointer;
  margin-left: 48rem;
  padding-top: 0.5rem;
`;

const RentingInfoBox = styled.div`
  background: #343434;
  display: flex;
  justify-content: space-between;
  width: 59.5rem;
  height: 7rem;
  margin-top: 1rem;
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
  border: 0.5px solid #FFF;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  margin-top: 4rem;
  margin-left: 15rem;
  align-items: center;
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
    border-radius: 10px;
    border: 1px solid #00FFE0;
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