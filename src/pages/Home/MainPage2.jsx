import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination,Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//최신등록 아이템 page, 메인페이지2
const MainPage2 = () => {
    return (
        <>
        <GlobalStyle /> 
          <SearchSection>
            <SearchInput placeholder="물건 검색" />
            <SearchButton>검색</SearchButton>
          </SearchSection>
          <div style={{ color: "#FFF" }}>최신 등록 아차!물건🎁</div>
          <ItemGrid>
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
          </ItemGrid>
        </>
      );
};

export default MainPage2;

// 스타일 컴포넌트들

export const GlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
    overflow: hidden;
  }
`;

const SearchSection = styled.section`
  display: flex;
  justify-content: center;
  margin: 20px;
  // 추가적인 스타일링
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  // 추가적인 스타일링
`;

const SearchButton = styled.button`
  padding: 10px;
  // 추가적인 스타일링
`;

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