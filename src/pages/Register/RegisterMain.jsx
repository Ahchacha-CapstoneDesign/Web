import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from "../Pagination";
import apiClient from "../../path/apiClient";

const RegisterMain = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null); // 카테고리 변경 시 선택된 아이템 초기화
  };

  const handleRegisterClick = () => {
    // 등록하기 버튼 클릭 시 선택한 카테고리와 아이템 데이터를 다음 페이지로 전달
    if (selectedItem) {
      navigate('/register2', {
        state: {item: selectedItem}
      });
    } else {
      alert("카테고리를 선택하세요.");
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item === selectedItem ? null : item); // 아이템 선택 토글
  };

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <>
      <GlobalStyle />
      <ItemTitle>등록2</ItemTitle>
    </>
  );
};


export default RegisterMain;

// 스타일 컴포넌트들
export const GlobalStyle = createGlobalStyle`
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #000; 
  overflow: hidden;
  background-position: center;
}
`;

const ItemTitle = styled.div` 
  color: #FFF;
  margin-top: 4rem;
  text-align: left;
  margin-left: 28rem;
  font-family: "Pretendard";
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 700;
`;

