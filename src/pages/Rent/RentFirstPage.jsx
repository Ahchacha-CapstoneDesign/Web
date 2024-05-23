import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from "../Pagination";
import apiClient from "../../path/apiClient";

//최신등록 아이템 page, 메인페이지2
const RentFirstPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]); // 검색된 게시글 목록
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const searchInputRef = useRef(null);

  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      let url = `/items/categories/top`;
      try {
        const response = await apiClient.get(url);
        setTopCategories(response.data);
      } catch (error) {
        console.error('Error fetching top categories:', error);
      }
    };

    fetchTopCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchAllPosts();
    }
  }, [searchTerm]);


  const handleCategoryClick = (categoryName) => {
    // navigate 함수를 사용하여 /rent/mainpage 경로로 이동하면서 상태 전달
    navigate('/rent/mainpage', { state: { searchTerm: categoryName } });
  };

  const fetchAllPosts = async () => {
    try {
      const response = await apiClient.get(`/items/latest`);
      setPosts(response.data.content);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // 사용자가 Enter 키를 누르면 검색 실행
    }
  };

  const handleSearch = async () => {

    if (searchTerm.trim() === '') {
      fetchAllPosts();
      navigate('/rent/mainpage', { state: { searchResults: [] } });
      return;
    }

    navigate('/rent/mainpage', { state: { searchTerm } }); // 상태와 함께 navigate 호출

    try {
      const [titleResponse, categoryResponse] = await Promise.all([
        apiClient.get(`/items/search-title?title=${searchTerm}`),
        apiClient.get(`/items/search-category?category=${searchTerm}`)
      ]);

      const combinedResults = [
        ...titleResponse.data.content,
        ...categoryResponse.data.content
      ];

      // 중복 제거
      const uniqueResults = Array.from(new Set(combinedResults.map(item => item.id)))
        .map(id => {
          return combinedResults.find(item => item.id === id);
        });

        setSearchedPosts(uniqueResults); 

      // 검색 결과를 RentMainPage로 전달
      navigate('/rent/mainpage', { state: { searchResults: uniqueResults } });

    } catch (error) {
      console.error('Error during search:', error);
    }
  };


  return (
    <>
      <GlobalStyle />
      <SearchSection>
        <SearchText>물건 검색</SearchText>
        <VerticalLine />
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearch}/>
      </SearchSection>
      <ItemTitle>아차차! 집에 뭔가 놓고 온 것 같은데...</ItemTitle>
      <CategoryGrid>
        {topCategories.map((category, index) => (
          // CategoryItem 클릭 시 handleCategoryClick 함수 호출하도록 수정
          <CategoryItem key={index} onClick={() => handleCategoryClick(category.category)}>
            {category.category}
          </CategoryItem>
        ))}
      </CategoryGrid>
    </>
  );
};

export default RentFirstPage;

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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 2fr);
  grid-gap: 1.5rem;
  margin-top: 5rem;
  margin-right: 30rem;
  margin-left: 30rem;
  cursor: pointer;
`;

const CategoryItem = styled.div`
  color: #FFF;
  padding: 0.5rem;
  text-align: center;
  border: 3px solid #FF6B00;
  border-radius: 20px;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;


