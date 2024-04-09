import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const ItemDetailPage = () => {


    return (
        <>
            <GlobalStyle/>
                <MainContainer>
                    <LeftContainer>
                            <ItemImage>이미지 자리</ItemImage>
                            <UserInfoContainer>
                                <Icon src="/assets/img/Profile.png" alt="Profile"/>
                                <Username>아차차</Username>
                                <RatingContainer>
                                    <StarIcon src="/assets/img/Star.png" alt="Star"/>
                                    <RatingValue>4.5</RatingValue>
                                </RatingContainer>
                            </UserInfoContainer>
                        <ReviewContainer>
                            <ReviewBubble>정말 친절하고 좋은 분입니다..</ReviewBubble>
                            <ReviewBubble>횟수가 많이 남아있어요... 괜찮아요..</ReviewBubble>
                            <ButtonContainer>
                                <MoreReviewsButton>리뷰 더 보러가기</MoreReviewsButton>
                            </ButtonContainer>
                        </ReviewContainer>
                    </LeftContainer>
                    <RightContainer>
                        <ItemDetailsContainer>
                            <ItemDetails>
                                <TitleSection>
                                    <Title>C타입 충전기</Title>
                                    <SubTitle>충전기</SubTitle>
                                </TitleSection>
                                <InformationSection>
                                    <InfoItem>
                                        <InfoTitle>수량</InfoTitle>
                                        <InfoContent>1</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 비용</InfoTitle>
                                        <InfoContent>2000원(시간당)</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 가능 요일 및 시간</InfoTitle>
                                        <InfoContent>월 ~ 금 / 10:00 ~ 17:00</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>대여 위치</InfoTitle>
                                        <InfoContent>상상관 1층</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>반납 위치</InfoTitle>
                                        <InfoContent>상상관 1층</InfoContent>
                                    </InfoItem>
                                    <InfoItem>
                                        <InfoTitle>상품 상태</InfoTitle>
                                        <InfoContent>새상품(미사용)</InfoContent>
                                    </InfoItem>
                                </InformationSection>
                            </ItemDetails>
                        </ItemDetailsContainer>
                        <ProductDescription>
                            <DescriptionText>삼성 정품 충전기</DescriptionText>
                            <DescriptionText>구매한지 1년</DescriptionText>
                            <DescriptionText>대여3회</DescriptionText>
                            <DescriptionText>저도 사용하는 제품입니다! 말 다했죠?</DescriptionText>
                        </ProductDescription>
                        <ButtonsContainer>
                            <ActionButton>채팅하기</ActionButton>
                            <ActionButton>예약하기</ActionButton>
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
  justify-content: space-between; // 버튼을 양쪽으로 분배
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

const ItemImage = styled.div`
  width: 18.75rem;
  height: 18.75rem;
  background-color: #ddd; // 임시 배경색, 실제 이미지로 대체할 것
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
  font-weight: bold;
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

// 채팅 말풍선 스타일
const ReviewBubble = styled.img`
  position: relative;
  width: 20.75rem;
  height: 16.26119rem;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  background-color: transparent; // 배경색을 투명하게 설정합니다.
  border: 2px solid #00FFE0; // 테두리 색상을 지정합니다.
  border-radius: 20px; // 둥근 테두리 반경을 지정합니다.
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff; // 말풍선 내 텍스트 색상을 지정합니다.
  align-self: flex-start;
  text-align: center;
  word-wrap: break-word;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0;
    height: 0;
    border: 10px solid transparent; // 투명한 테두리를 만듭니다.
    border-top-color: #00bfa5; // 위쪽 테두리 색상을 말풍선 테두리 색상과 동일하게 합니다.
    transform: translateX(-50%) translateY(100%); // 위치를 조정합니다.
    transform-origin: 0 0;
  }

  &:last-child {
    margin-bottom: 0;
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
  border-radius: 8px;
  font-weight: 800;
  color: #000;
  text-align: center;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 1.37rem;
  margin-bottom: 4.31rem;
  &:not(:last-child) {
    margin-right: 1rem; // 마지막 버튼을 제외하고 오른쪽 마진 적용
  }
`;



export default ItemDetailPage;
