import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import {useParams, useNavigate} from "react-router-dom";
import apiClient from "../../path/apiClient";
import OwnerReview from './OwnerReview';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formattedScore, setFormattedScore] = useState("0.0"); // 초기값을 "0.0"으로 설정

    const handleReserve = () => {
        if (!itemDetails) return;

        // 아이템의 소유자 유형을 확인하고 해당하는 경로로 이동
        if (itemDetails.personOrOfficial === 'OFFICIAL') {
            navigate(`/rent/officialreservation/${itemDetails.id}`, { state: { itemDetails } });
        } else if (itemDetails.personOrOfficial === 'PERSON') {
            navigate(`/rent/personreservation/${itemDetails.id}`, { state: { itemDetails } });
        }
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await apiClient.get(`/items/${itemId}`);
                setItemDetails(response.data);

                const { ownerReviewScore, renterReviewScore } = response.data;
                const scores = [];
                if (ownerReviewScore != null && !isNaN(ownerReviewScore)) scores.push(ownerReviewScore);
                if (renterReviewScore != null && !isNaN(renterReviewScore)) scores.push(renterReviewScore);

                const newFormattedScore = scores.length > 0 ? (scores.reduce((acc, score) => acc + score, 0) / scores.length).toFixed(1) : '0.0';
                setFormattedScore(newFormattedScore); // 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch item details:', error);
            }
        };
            fetchItemDetails();
    }, [itemId]);

    if (!itemDetails) {
        return <div>Loading...</div>;
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
      return formatter.format(date); // 예: '2024년 5월 17일'
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

    const handleGoBack = () => {
      console.log('돌아가기 버튼 클릭');
      navigate(-1);
    };

    const handleCategoryClick = (categoryName) => {
      // navigate 함수를 사용하여 /rent/mainpage 경로로 이동하면서 상태 전달
      navigate('/rent/mainpage', { state: { searchTerm: categoryName } });
    };

    const handleNextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % itemDetails.imageUrls.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + itemDetails.imageUrls.length) % itemDetails.imageUrls.length);
    };

    const handleGoToOwnerReview = () => {
      navigate(`/rent/ownerreview/${itemDetails.userId}`, { state: { userProfile: itemDetails.userProfile, userNickName: itemDetails.userNickName, averageScore: formattedScore } });
    };

    return (
        <>
            <GlobalStyle/>
            <BackButton src="/assets/img/BackArrow.png" alt="Back" onClick={handleGoBack} />
              <MainContainer>
                <LeftContainer>
                  {itemDetails.imageUrls && itemDetails.imageUrls.length > 0 ? (
                    <ItemImageContainer>
                        <Image src={itemDetails.imageUrls[currentImageIndex]} alt="Item" />
                        {itemDetails.imageUrls.length > 1 && (
                            <>
                                <LeftArrow src="/assets/img/PrevArrow.png" onClick={handlePrevImage} />
                                <RightArrow src="/assets/img/NextArrow.png" onClick={handleNextImage} />
                                <ImageIndicator>
                                    {currentImageIndex + 1} / {itemDetails.imageUrls.length}
                                </ImageIndicator>
                            </>
                        )}
                    </ItemImageContainer>
                  ): (
                    // 기본 이미지를 불러오는 경우
                    <ItemImageContainer>
                      <Image src="/assets/img/ItemDefault.png" alt="Item" />
                    </ItemImageContainer>
                  )}
                  <UserInfoContainer>
                    <Icon src={itemDetails.userProfile || '/assets/img/Profile.png'} alt="Profile"/>
                      <Username>{itemDetails.userNickName}</Username>
                      <RatingContainer>
                        <StarIcon src="/assets/img/Star.png" alt="Star"/>
                        <RatingValue>{formattedScore}</RatingValue>
                      </RatingContainer>
                  </UserInfoContainer>
                  <ReviewBubble src="/assets/img/ReviewBubble.png" alt="Star">
                    <ReviewText>정말 친절하고 좋은 분입니다..</ReviewText>
                    <ReviewText>횟수가 많이 남아있어요... 괜찮아요..</ReviewText>
                  </ReviewBubble>
                    <ButtonContainer>
                      <MoreReviewsButton onClick={handleGoToOwnerReview}>리뷰 더 보러가기</MoreReviewsButton>
                    </ButtonContainer>

                  </LeftContainer>
                    <RightContainer>
                        <ItemDetailsContainer>
                            <ItemDetails>
                                <TitleSection>
                                    <Title>{itemDetails.title}</Title>
                                    <SubTitle onClick={() => handleCategoryClick(itemDetails.category)}>{itemDetails.category}</SubTitle>
                                </TitleSection>
                                <InformationSection>
                                    <InfoItem>
                                        <InfoTitle>대여 비용</InfoTitle>
                                        <InfoContent>{itemDetails.pricePerHour}원(1시간)</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 가능 날짜</InfoTitle>
                                        <InfoContent>{formatDate(itemDetails.canBorrowDateTime)} ~ {formatDate(itemDetails.returnDateTime)}</InfoContent>
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
                        </ProductDescription>
                        <ButtonsContainer>
                            <ActionButton>채팅하기</ActionButton>
                            <ReservationButton 
                              reservation={itemDetails.reservation} 
                              onClick={itemDetails.reservation !== 'NO' ? handleReserve : undefined}
                            >
                              {itemDetails.reservation === 'NO' ? '예약불가' : '예약하기'}
                            </ReservationButton>
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
    overflow: hidden;
  }
`;

const BackButton = styled.img`
  width: 2rem;
  height: 2rem;
  margin-left: 15rem;
  cursor: pointer;
  margin-bottom: -4rem;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  color: #fff;
  align-items: flex-start;
  margin-top: -3rem;
  background-color: #000;
`;

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
  margin-top: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
`;

const DescriptionText = styled.p`
  &::before {
    content: "ㆍ ";
    color: #fff; // 이 가상 요소의 텍스트 색상을 설정
  }
`;

const ProductDescription = styled.div`
  margin-top: -1rem;
  position: relative;
  width: 41.25rem;
  height: 18.4375rem;
  border: 3px solid rgba(217, 217, 217, 0.62);
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

const ItemImageContainer = styled.div`
  position: relative;
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 18.75rem;
  height: 18.75rem;
  object-fit: cover;
  border: 1px solid #fff;
  border-radius: 5%;
`;

const Arrow = styled.img`
  position: absolute;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  user-select: none;
`;

const LeftArrow = styled(Arrow)`
  left: -40px;
`;

const RightArrow = styled(Arrow)`
  right: -40px;
`;

const ImageIndicator = styled.div`
  position: absolute;
  margin-bottom: -17rem;
  margin-right: -15rem;
  background-color: transparent;
  color: #B6B6B6;
  font-size: 1.25rem;
  font-weight: 800;
  font-family:'Pretendard';
`;

const ItemDetails = styled.div`
  background-color: #000;
  padding: 1rem;
  border-radius: 8px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13rem;
  padding-bottom: 1rem;
  max-width: 17rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.span`
  width: 38.125rem;
  font-size: 1.7rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-right: 5rem;
`;

const SubTitle = styled.span`
  display: block; // 블록 레벨 요소로 변경
  width: 7.6875rem; // 너비 지정
  line-height: 2.875rem; // line-height를 height와 동일하게 설정하여 텍스트를 수직 중앙에 배치
  text-align: center; // 텍스트 수평 중앙 정렬
  font-size: 1rem;
  font-weight: 600;
  border-radius: 1.25rem;
  border: 3px solid #FF6B00;
  margin-left:20rem;
  position: relative; // 상대적 위치 설정, 필요에 따라 조정 가능
  transform: translateY(-80%); // Y축으로 -50% 만큼 이동하여 수직 중앙 정렬
  // 주의: 이 방식을 사용하려면 SubTitle의 상위 요소가 position: relative;로 설정되어야 합니다.
  cursor: pointer;
`;

const InformationSection = styled.div`
    margin-top:-3rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 38.125rem;
  height: 3rem;
`;

const InfoTitle = styled.div`
  font-size: 1.3rem;
  font-style: 'Pretendard';
  font-weight: 650;
  margin-right: 1rem;
`;

const InfoContent = styled.div`
  color: #FFF;
  font-size: 1.3rem;
  font-style: 'Pretendard';
  font-weight: 300;
`;

const ReviewText = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 1rem;
  font-style: 'Pretendard';
  font-weight: 800;
  line-height: normal;
  margin-top: 2.2rem;
  margin-bottom: 4.4rem;
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
  margin-top: -3rem;
  width: 100%; // 부모 컨테이너의 전체 너비 사용
`;

const MoreReviewsButton = styled.button`
  background: #000; // 버튼 배경색
  color: #fff; // 버튼 글자색
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
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
`;
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
`;

const RatingValue = styled.span`
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const Icon = styled.img`
  margin-right:1.38rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
`;
const Username = styled.h2`
  font-size: 1.3rem;
  margin-right:2.44rem;
  font-weight: 500;
  flex-grow: 1;
`;


const ActionButton = styled.button`
  background: #00FFE0;
  width: 18rem;
  height: 3.0625rem;
  border: none;
  border-radius: 2rem;
  font-weight: 700;
  color: #000;
  text-align: center;
  font-size: 1.3rem;
  cursor: pointer;
  margin-top: 2.5rem;
  margin-bottom: 4.31rem;
`;

const ReservationButton = styled.button`
  background: ${props => props.reservation === 'NO' ? '#FF0000' : '#00FFE0'};
  width: 18rem;
  height: 3.0625rem;
  border: none;
  border-radius: 2rem;
  font-weight: 700;
  color: #000;
  text-align: center;
  font-size: 1.3rem;
  cursor: ${props => props.reservation === 'NO' ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.reservation === 'NO' ? 0.5 : 1};
  margin-top: 2.5rem;
  margin-bottom: 4.31rem;
`;



export default ItemDetailPage;
