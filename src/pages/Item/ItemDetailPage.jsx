import React from 'react';
import styled from 'styled-components';

const ItemDetailPage = () => {


    return (
        <PageLayout>
            <ContentSection>
                <MainContainer>
                    <LeftContainer>
                            <ItemImage>이미지 자리</ItemImage>
                            <UserInfoContainer>
                                <Icon src="/assets/img/Profile.png" alt="Profile"/>
                                <Username>아차차</Username>
                                <RatingContainer>
                                    <StarIcon>⭐</StarIcon>
                                    <RatingValue>4.5</RatingValue>
                                </RatingContainer>
                            </UserInfoContainer>
                        <ReviewContainer>
                            <ReviewBubble>정말 친절하고 좋은 분입니다.</ReviewBubble>
                            <ReviewBubble>횟수가 많이 남아있어요... 괜찮아요.</ReviewBubble>
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
                            삼성 정품 충전기<br /><br />
                            구매한지 1년 <br /><br />
                            대여3회<br /><br />
                            저도 사용하는 제품입니다! 말 다했죠?<br /><br />
                        </ProductDescription>
                        <ButtonsContainer>
                            <ActionButton>채팅하기</ActionButton>
                            <ActionButton>예약하기</ActionButton>
                        </ButtonsContainer>
                    </RightContainer>
                </MainContainer>
            </ContentSection>
        </PageLayout>
    );
};

const MainContainer = styled.div`
  display: flex;
`;

const LeftContainer = styled.div`
  display: flex; 
  flex-direction: column;
  margin-right: 3rem; // 오른쪽에 공간을 추가합니다.
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 3rem;
`;

const PageLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  padding: 2rem;
`;

const ContentSection = styled.section`
  width: 100%;
  max-width: 768px; // 또는 이미지에 맞는 최대 너비
  display: flex;
  flex-direction: column;
  align-items: center;
`;



const ItemDetailsContainer = styled.div`
  background: #000;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 6rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between; // 버튼을 양쪽으로 분배
`;

const ProductDescription = styled.div`
  position: relative;
  background-color: transparent; // 배경색을 투명하게 설정합니다.
  border: 2px solid #00FFE0; // 테두리 색상을 지정합니다.
  border-radius: 20px; // 둥근 테두리 반경을 지정합니다.
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff; // 말풍선 내 텍스트 색상을 지정합니다.
  font-size: 0.9rem;
  max-width: 80%;
  word-wrap: break-word;
`;

const ItemImage = styled.div`
  width: 100%; // 이미지의 너비
  height: 400px; // 이미지의 높이, 실제 이미지에 맞게 조정 필요
  background-color: #ddd; // 임시 배경색, 실제 이미지로 대체할 것
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

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  color: #aaa;
  margin: 0;
`;

const InformationSection = styled.div`
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

const InfoTitle = styled.div`
  font-weight: bold;
  margin-right: 1rem;
`;

const InfoContent = styled.div`
  color: #ddd;
`;

const ReviewContainer = styled.div`
  background: #000;
  width: 100%;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex; // Flexbox 사용
  flex-direction: column; // 세로 정렬
  align-items: flex-start; // 자식 요소들을 왼쪽으로 정렬
`;

// 채팅 말풍선 스타일
const ReviewBubble = styled.div`
  position: relative;
  background-color: transparent; // 배경색을 투명하게 설정합니다.
  border: 2px solid #00FFE0; // 테두리 색상을 지정합니다.
  border-radius: 20px; // 둥근 테두리 반경을 지정합니다.
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff; // 말풍선 내 텍스트 색상을 지정합니다.
  align-self: flex-start;
  text-align: left;
  font-size: 0.9rem;
  max-width: 80%;
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
  margin-top: 1rem;

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

const StarIcon = styled.span`
  // 별 아이콘 스타일
`;

const RatingValue = styled.span`
  margin-left: 0.5rem;
  font-size: 1.2rem;
`;

const Icon = styled.img`
  margin-right: 8px;
  width: 35px;
  height: 30px;
`;
const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  flex-grow: 1;
`;


const ActionButton = styled.button`
  background: #00FFE0;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: #000;
  font-size: 1rem;
  cursor: pointer;
  flex: 1; // 버튼들이 동일한 크기를 갖도록
  &:not(:last-child) {
    margin-right: 1rem; // 마지막 버튼을 제외하고 오른쪽 마진 적용
  }
`;



export default ItemDetailPage;
