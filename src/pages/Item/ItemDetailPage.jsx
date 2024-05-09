import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import {useParams, useNavigate} from "react-router-dom";
import apiClient from "../../path/apiClient";

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const navigate = useNavigate();

    const handleReserve = () => {
        if (!itemDetails) return;

        // 아이템의 소유자 유형을 확인하고 해당하는 경로로 이동
        if (itemDetails.personOrOfficial === 'OFFICIAL') {
            navigate(`/rent/officialreservation/${itemDetails.id}`);
        } else if (itemDetails.personOrOfficial === 'PERSON') {
            navigate(`/rent/personreservation/${itemDetails.id}`);
        }
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await apiClient.get(`/items/${itemId}`);
                setItemDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch item details:', error);
            }
        };
            fetchItemDetails();
    }, [itemId]);

    if (!itemDetails) {
        return <div>Loading...</div>;
    }

    function getDayOfWeek(dateString) {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' });
        return formatter.format(date).slice(0, 1); // '금요일'을 '금'으로 표시하려면 .slice(0, 1)을 사용합니다.
    }

// 날짜 문자열에서 시간만 추출하는 함수
    function getTime(dateString) {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24시간제를 사용하려면 false로 설정합니다.
        });
        return formatter.format(date);
    }


    return (
        <>
            <GlobalStyle/>
                <MainContainer>
                    <LeftContainer>
                            <ItemImage src={itemDetails.imageUrls[0]} alt={itemDetails.title} />
                            <UserInfoContainer>
                                <Icon src={itemDetails.userProfile || '/assets/img/Profile.png'} alt="Profile"/>
                                <Username>{itemDetails.userNickName}</Username>
                                <RatingContainer>
                                    <StarIcon src="/assets/img/Star.png" alt="Star"/>
                                    <RatingValue>4.5</RatingValue>
                                </RatingContainer>
                            </UserInfoContainer>
                            <ReviewBubble src="/assets/img/ReviewBubble.png" alt="Star">
                                <ReviewText>정말 친절하고 좋은 분입니다..</ReviewText>
                                <ReviewText>횟수가 많이 남아있어요... 괜찮아요..</ReviewText>
                            </ReviewBubble>
                            <ButtonContainer>
                                <MoreReviewsButton>리뷰 더 보러가기</MoreReviewsButton>
                            </ButtonContainer>

                    </LeftContainer>
                    <RightContainer>
                        <ItemDetailsContainer>
                            <ItemDetails>
                                <TitleSection>
                                    <Title>{itemDetails.title}</Title>
                                    <SubTitle>{itemDetails.category}</SubTitle>
                                </TitleSection>
                                <InformationSection>
                                    <InfoItem>
                                        <InfoTitle>대여 비용</InfoTitle>
                                        <InfoContent>{itemDetails.pricePerHour}</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 가능 요일</InfoTitle>
                                        <InfoContent>{getDayOfWeek(itemDetails.canBorrowDateTime)} ~ {getDayOfWeek(itemDetails.returnDateTime)}</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 및 반납 가능 시간</InfoTitle>
                                        <InfoContent>{getTime(itemDetails.canBorrowDateTime)} ~ {getTime(itemDetails.returnDateTime)}</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 위치</InfoTitle>
                                        <InfoContent>{itemDetails.borrowPlace}</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>반납 위치</InfoTitle>
                                        <InfoContent>{itemDetails.returnPlace}</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>상품 상태</InfoTitle>
                                        <InfoContent>새상품(미사용)</InfoContent>
                                    </InfoItem>
                                </InformationSection>
                            </ItemDetails>
                        </ItemDetailsContainer>
                        <ProductDescription>
                            <DescriptionText>{itemDetails.introduction}</DescriptionText>
                            <DescriptionText>구매한지 1년</DescriptionText>
                            <DescriptionText>대여3회</DescriptionText>
                            <DescriptionText>저도 사용하는 제품입니다! 말 다했죠?</DescriptionText>
                        </ProductDescription>
                        <ButtonsContainer>
                            <ActionButton>채팅하기</ActionButton>
                            <ActionButton onClick={handleReserve}>예약하기</ActionButton>
                        </ButtonsContainer>
                    </RightContainer>
                </MainContainer>
            </>
    );
};

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%; 
    margin: 0;
    padding: 0;
    justify-content: center;
    color: #fff;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
    font-family: "Pretendard";
  }

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

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  color: #fff;
  align-items: flex-start;
  background-color: #000;
`

const LeftContainer = styled.div`
  display: flex; 
  flex-direction: column;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4.5rem;
`;

const ItemDetailsContainer = styled.div`
  background: #000;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const DescriptionText = styled.p`
  &::before {
    content: "ㆍ ";
    color: #fff; // 이 가상 요소의 텍스트 색상을 설정
  }
`;

const ProductDescription = styled.div`
  position: relative;
  width: 41.25rem;
  height: 18.4375rem;
  border: 5px solid rgba(217, 217, 217, 0.62);
  border-radius: 1.25rem;
  padding: 1rem;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  color: #fff; // 말풍선 내 텍스트 색상을 지정합니다.
  word-wrap: break-word;

  ::before {
      content: "ㆍ ";
      color: #fff; /* 이 가상 요소의 텍스트 색상도 설정할 수 있습니다. */
    }
`;

const ItemImage = styled.img`
  width: 18.75rem;
  height: 18.75rem;
  object-fit: cover; // 이미지가 컨테이너를 가득 채우도록 설정
  margin-top:3rem;
  margin-bottom: 2rem;
`;



const ItemDetails = styled.div`
  background-color: #000;
  padding: 1rem;
  border-radius: 8px;
`;

const TitleSection = styled.div`
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.span`
  width: 38.125rem;
  height: 3.6875rem;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

const SubTitle = styled.span`
  display: block; // 블록 레벨 요소로 변경
  width: 7.6875rem; // 너비 지정
  height: 2.875rem; // 높이 지정
  line-height: 2.875rem; // line-height를 height와 동일하게 설정하여 텍스트를 수직 중앙에 배치
  text-align: center; // 텍스트 수평 중앙 정렬
  font-size: 0.9375rem;
  font-weight: 800;
  border-radius: 1.25rem;
  border: 3px solid #FF6B00;
  margin-left:13rem;
  position: relative; // 상대적 위치 설정, 필요에 따라 조정 가능
  top: 50%; // 상위 요소 대비 상단에서 50% 위치
  transform: translateY(-80%); // Y축으로 -50% 만큼 이동하여 수직 중앙 정렬
  // 주의: 이 방식을 사용하려면 SubTitle의 상위 요소가 position: relative;로 설정되어야 합니다.
  
`;

const InformationSection = styled.div`
    margin-top:-3rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 38.125rem;
  height: 3.6875rem;
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const InfoTitle = styled.div`
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 650;
  line-height: normal;
  margin-right: 1rem;
`;

const InfoContent = styled.div`
  color: #FFF;
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const ReviewContainer = styled.div`
  background: #000;
  width: 19.5rem;
  height: 18.25rem;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 5.94rem;
  display: flex; // Flexbox 사용
  flex-direction: column; // 세로 정렬
  align-items: flex-start; // 자식 요소들을 왼쪽으로 정렬
`;

const ReviewText = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 1rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-top: 2rem;
  margin-bottom: 4.4rem;
  //7.62rem
`;

// 채팅 말풍선 스타일
const ReviewBubble = styled.div`
  position: relative;
  width: 19.5rem;
  height: 18.25rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  background-image: url('/assets/img/ReviewBubble.png'); // 배경 이미지로 말풍선 이미지를 설정
  background-size: 18.75rem 16.26119rem;// 배경 이미지가 div 크기에 맞게 조정되도록 설정
  background-repeat: no-repeat; // 이미지가 반복되지 않도록 설정
  background-position: center; // 이미지가 컨테이너의 중앙에 위치하도록 설정
  color: #fff; // 말풍선 내 텍스트 색상을 지정합니다.
  display: flex; // Flexbox 사용
  align-items: center; // 텍스트를 수직 중앙에 배치
  justify-content: center; // 텍스트를 수평 중앙에 배치
  flex-direction: column;
  text-align: center; // 텍스트를 중앙 정렬
  word-wrap: break-word;
  
  }

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; // 버튼을 오른쪽에 배치
  margin-bottom: 7.38rem;
  width: 100%; // 부모 컨테이너의 전체 너비 사용
`;

const MoreReviewsButton = styled.button`
  background: #000; // 버튼 배경색
  color: #fff; // 버튼 글자색
  border: none;
  padding: 10px 20px;
  font-size: 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 0.5rem;

  position: relative; // 가상 요소를 위한 상대적 위치 설정

  &::after {
    content: ''; // 필수 속성, 비워진 상태로 둡니다.
    position: absolute; // 절대 위치
    bottom: 0px; // 버튼 아래쪽에서 얼마나 떨어뜨릴지 위치
    right: 0; // 오른쪽에서 0의 위치
    width: 100%; // 부모 컨테이너(여기서는 ButtonContainer)의 전체 너비
    height: 2px; // 선의 두께
    background-color: #808080; // 선의 색상을 흰색으로 지정
  }
`;


const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
`;

const RatingValue = styled.span`
  margin-left: 0.5rem;
  font-size: 1.2rem;
`;

const Icon = styled.img`
  margin-right:1.38rem;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
`;
const Username = styled.h2`
  font-size: 1.5rem;
  margin-right:2.44rem;
  font-weight: bold;
  flex-grow: 1;
`;


const ActionButton = styled.button`
  background: #00FFE0;
  width: 19.125rem;
  height: 3.0625rem;
  border: none;
  border-radius: 2rem;
  font-weight: 800;
  color: #000;
  text-align: center;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 1.37rem;
  margin-bottom: 4.31rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  &:not(:last-child) {
    margin-right: 1rem; // 마지막 버튼을 제외하고 오른쪽 마진 적용
  }
`;



export default ItemDetailPage;
