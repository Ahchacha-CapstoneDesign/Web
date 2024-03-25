import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination,Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//대여많이한 순 추천, 메인페이지3
const MainPage3 = () => {
    return (
        <>
        <GlobalStyle /> 
          <SearchSection>
            <SearchInput placeholder="물건 검색" />
            <SearchButton>검색</SearchButton>
          </SearchSection>
          
          <div style={{ color: "#FFF" }}>OOO님을 위한 물건 추천🎀</div>
          
        </>
      );
};

export default MainPage3;

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