import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination,Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const MainPage1 = () => {
  return (
    <>
    <GlobalStyle /> 
      <SearchSection>
        <SearchInput placeholder="물건 검색" />
        <SearchButton>검색</SearchButton>
      </SearchSection>
      <SwiperContainer>
        <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={30} 
            coverflowEffect={{
              rotate: 50,
              stretch: 0, 
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="mySwiper"
            >
            {/* 10개의 네모칸 슬라이드를 만듭니다 */}
            {[...Array(10).keys()].map((index) => (
                <SwiperSlide key={index}>
                <SlideBox>Slide {index + 1}</SlideBox>
                </SwiperSlide>
            ))}
        </Swiper>
      </SwiperContainer>
    </>
  );
};

export default MainPage1;

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

const SwiperContainer = styled.div`
  width: 60%; // 또는 필요한 대로 조정
  margin: auto; // 가운데 정렬

  .swiper-slide {
    /* 정사각형 크기를 유지하기 위해 너비와 높이를 같게 설정 */
    width: 200px; // 가로 크기
    height: 300px; // 세로 크기
  }
`;

const SlideBox = styled.div`
  height: 300px; // 슬라이드 높이 설정
  background-color: #fff; // 슬라이드 배경색 설정
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  border-radius: 20px; // 슬라이드 모서리 둥글게 설정
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 슬라이드 그림자 설정
  color: #000; // 슬라이드 텍스트 색상 설정
`;