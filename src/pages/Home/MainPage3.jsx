import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination, Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//대여많이한 순 추천, 메인페이지3
const MainPage3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) { // 마우스 휠을 아래로 스크롤할 경우
        navigate('/mainpage/4');
      } else if (e.deltaY < 0) { // 마우스 휠을 위로 스크롤할 경우
        navigate('/mainpage/2');
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => window.removeEventListener('wheel', handleWheel);
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <SearchSection>
        <SearchText>물건 검색</SearchText>
        <VerticalLine />
        <SearchInput />
        <SearchButton />
      </SearchSection>
      <ItemTitle>OOO님을 위한 물건 추천 🎀</ItemTitle>
      <ScrollIndicators>
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/1')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/2')} />
        <Circle active={!isScrolled} onClick={() => navigate('/mainpage/3')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/4')} />
        <Scroll />
      </ScrollIndicators>
      {/* <ItemGrid>
        <ItemCard>
            <ItemImage src="이미지 URL" alt="아이템 이미지" />
            <ItemInfo>
              <div>제목: 아이템 제목</div>
              <div>비용: 아이템 비용</div>
              <div>대여장소: 아이템 대여장소</div>
              <div>대여가능시간: 아이템 대여가능시간</div>
              <div>예약가능 여부: 예약 가능 여부</div>
            </ItemInfo>
        </ItemCard>
      </ItemGrid> */}
    </>
  );
};

export default MainPage3;

// 스타일 컴포넌트들

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 3열로 구성 */
  grid-gap: 20px; /* 그리드 간격 설정 */
`;

const ItemCard = styled.div`
  border: 2px solid #FFF; /* 흰색 테두리 추가 */
  padding: 10px; /* 내부 여백 추가 */
  text-align: center; /* 텍스트 가운데 정렬 */
  color: #FFF; /* 텍스트 색상 */
`;


const ItemImage = styled.img`
  width: 100px; /* 이미지의 너비 설정 */
  height: auto; /* 이미지의 높이 자동 조정 */
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column; /* 아이템 정보를 세로로 정렬 */
  margin-left: 10px; /* 이미지와 정보 사이의 여백 설정 */
  color: #FFF; /* 텍스트 색상 */
`;

export const GlobalStyle = createGlobalStyle`
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #000; // body 전체의 배경색을 검은색으로 설정
  overflow: hidden;
  background-image: url('/assets/img/MainBackground.png'); // 배경 이미지 설정
  background-size: cover; // 배경 이미지가 전체를 커버하도록 설정
  background-position: center;
}
`;

const SearchSection = styled.section`
  width: 62.1875rem;
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items:center;
  margin: auto;
  margin-top: 3rem;
  padding: 10px;
  border-radius: 0.625rem;
  border: 1px solid #00FFE0; // 테두리 색상 설정
  background: transparent;
`;

const SearchText = styled.div`
  color: #fff; // 텍스트 색상
  width: 11rem;
  text-align: center;
  font-family: "Pretendard";
  font-size: 1.3rem;
  font-weight: 700;
`;

const VerticalLine = styled.div`
  height: 30px; // 세로 선의 높이
  width: 1px; // 세로 선의 두께
  background-color: #00FFE0; // 세로 선 색상
  margin-right: 2rem; // 입력 필드와의 간격
`;

const SearchInput = styled.input`
  flex: 1; // 검색 입력 창이 섹션을 가득 채우도록 함
  padding: 10px;
  border: none; // 테두리 없음
  background: transparent;
  margin-right: 10px; // 버튼과의 간격
  font-family: "Pretendard";
  font-size: 1.3rem;
  font-weight: 300;
  color: #fff;

  &:focus {
    outline: none; // 입력 시 테두리 없앰
  }
`;

const SearchButton = styled.button`
  padding: 10px;
  width: 1.8rem;
  height: 1.8rem;
  margin-right: 1.5rem;
  border: none; // 테두리 없음
  cursor: pointer; // 마우스 오버 시 포인터
  background-image: url('/assets/img/Search.png'); // 돋보기 아이콘 이미지 경로
  background-color: transparent; // 배경색 투명
  background-repeat: no-repeat; // 이미지 반복 없음
  background-position: center; // 이미지를 버튼 중앙에 위치
  background-size: contain; // 이미지 사이즈를 버튼에 맞게 조정
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#D6F800' : '#F8F8F8'};
  margin: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const Scroll = styled.div`
  width: 4rem;
  height: 2rem;
  background-image: url('/assets/img/Scroll.png'); // 배경 이미지 설정
  background-repeat: no-repeat;
  background-size: contain; // 배경 이미지 크기 조절
  background-position: center; // 배경 이미지 위치
  margin-left: -2.2rem;
  margin-top: 0.5rem;
`;

const ScrollIndicators = styled.div`
  position: fixed;
  margin-left: 15rem;
  top: 60%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.div` 
  color: #FFF;
  margin-top: 4rem;
  text-align: left;
  margin-left: 22rem;
  font-family: "Pretendard";
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 700;
`;

