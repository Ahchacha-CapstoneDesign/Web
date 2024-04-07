import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination, Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 조회수 top 10 카테고리 페이지
const RentFirstPage = () => {
  return (
    <>
      <GlobalStyle />
      <SearchSection>
        <SearchText>물건 검색</SearchText>
        <VerticalLine />
        <SearchInput />
        <SearchButton />
      </SearchSection>
      <ItemTitle>아차차! 집에 뭔가 놓고 온 것 같은데... 🤔</ItemTitle>

      {/* {<ItemGrid>
        {items.map((item, index) => (
          <ItemCard key={index}>
            <ItemImage src={item.imageUrl} alt={`아이템 이미지 ${index + 1}`} />
            <ItemInfo>
              <div>{item.title}</div>
              <div>{item.cost}</div>
              <div>대여가능시간: {item.rentalTime}</div>
              <div>예약가능 여부: {item.available}</div>
            </ItemInfo>
          </ItemCard>
        ))}
      </ItemGrid>} */}
    </>
  );
};

export default RentFirstPage;

// 스타일 컴포넌트들

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열로 구성 */
  grid-template-rows: repeat(3, auto); /* 3행으로 구성, 행 높이는 자동으로 설정 */
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

