import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from "../Pagination";
import apiClient from "../../path/apiClient";

//최신등록 아이템 page, 메인페이지2
const MainPage3 = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState([]); // 현재 페이지에 표시될 포스트
  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]); // 검색된 게시글 목록
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('date');
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const searchInputRef = useRef(null);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name);
  });

  const fetchPosts = async () => {
    const url = '/items/MyTop-reservations';
    try {
      const response = await apiClient.get(url, { withCredentials: true });
      const totalPosts = response.data; // 이제 response.data 자체가 필요한 배열입니다.
      setPosts(totalPosts);
      setTotalPages(Math.ceil(totalPosts.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('데이터를 불러오는 데 실패했습니다. 서버 설정을 확인하세요.');
    }
  };

  // 처음 렌더링될 때와 sort 상태가 변경될 때 전체 게시글 불러오기
  useEffect(() => {
    fetchPosts();
  }, [sort]);

  useEffect(() => {
    const newDisplayedPosts = posts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setDisplayedPosts(newDisplayedPosts);
  }, [currentPage, posts]);

  useEffect(() => {
    // 검색 결과에 대한 displayedPosts 설정
    // searchedPosts가 있을 때만 updateDisplayedAndPagination 호출
    if (searchedPosts.length > 0) {
      updateDisplayedAndPagination(searchedPosts);
    } else {
      updateDisplayedAndPagination(posts);
    }
  }, [currentPage, searchedPosts, posts]);

  useEffect(() => {
    if (searchedPosts.length > 0 || posts.length > 0) {
      let targetPosts = searchedPosts.length > 0 ? searchedPosts : posts;
      let sortedPosts = [...targetPosts];

      if (sort === 'view-counts') {
        sortedPosts.sort((a, b) => b.viewCount - a.viewCount);
      } else if (sort === 'date') {
        sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      if (searchedPosts.length > 0) {
        setSearchedPosts(sortedPosts);
      } else {
        setPosts(sortedPosts);
      }
      updateDisplayedAndPagination(sortedPosts);
    }
  }, [sort]);

  const updateDisplayedAndPagination = (postsToUpdate) => {
    const newDisplayedPosts = postsToUpdate.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setDisplayedPosts(newDisplayedPosts);
    setTotalPages(Math.ceil(postsToUpdate.length / ITEMS_PER_PAGE));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const goToItemDetail = (itemId) => {
    navigate(`/rent/itemdetail/${itemId}`);
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

  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes}`;
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // 사용자가 Enter 키를 누르면 검색 실행
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      try {
        const response = await apiClient.get('/items/latest');
        navigate('/rent/mainpage', { state: { searchResults: response.data.content, searchTerm: '' } });
      } catch (error) {
        console.error('Error fetching latest items:', error);
      }
      return;
    }

    navigate('/rent/mainpage', { state: { searchTerm } });

    try {
      const [titleResponse, categoryResponse] = await Promise.all([
        apiClient.get(`/items/search-title?title=${searchTerm}`),
        apiClient.get(`/items/search-category?category=${searchTerm}`)
      ]);

      const combinedResults = [...titleResponse.data.content, ...categoryResponse.data.content];
      const uniqueResults = Array.from(new Set(combinedResults.map(item => item.id)))
      .map(id => {
        return combinedResults.find(item => item.id === id);
      });
      navigate('/rent/mainpage', { state: { searchResults: uniqueResults} });
    } catch (error) {
      console.error('Error during search:', error);
    }
};

  return (
    <>
      <GlobalStyle />
      <ScrollIndicators>
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/1')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/2')} />
        <Circle active={!isScrolled} onClick={() => navigate('/mainpage/3')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/4')} />
        <Scroll />
      </ScrollIndicators>
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
      <ItemTitle>{userName}님을 위한 물건 추천 🎀</ItemTitle>

      <PageContainer>
        <PostList>
          {displayedPosts.map((post) => (
            <PostItem key={post.id} onClick={() => goToItemDetail(post.id)}>
              {post.imageUrls && post.imageUrls.length > 0 ? (
                  <ImageWrapper>
                    <img src={post.imageUrls[0]} alt="Item" />
                    {post.reservation === 'NO' && <RentingImage src={"/assets/img/renting.png"} alt="Renting" />}
                  </ImageWrapper>
              ) : (
                  // 기본 이미지를 불러오는 경우
                  <ImageWrapper>
                    <img src="/assets/img/ItemDefault.png" alt="Default" />
                    {post.reservation === 'NO' && <RentingImage src={"/assets/img/renting.png"} alt="Renting" />}
                  </ImageWrapper>
              )}
              <ContentWrapper>
                <TitleWrapper>
                  {post.title}
                </TitleWrapper>
                <Cost>
                  비용 : {post.pricePerHour}원
                </Cost>
                <CanBorrowDateTime>
                  대여 가능 시간 : {formatTime(post.canBorrowDateTime)} ~ {formatTime(post.returnDateTime)}
                </CanBorrowDateTime>
              </ContentWrapper>
            </PostItem>
          ))}
        </PostList>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageContainer>
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
  background-image: url('/assets/img/MainBackground23.png'); // 배경 이미지 설정
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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`;

const PostList = styled.div`
    background-color: background: transparent;;
    color: #FFF;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    width:53%;
    margin-right: 1rem;
    margin-top: 0.5rem;
`;

const PostItem = styled.div`
    display: flex;
    padding: 1rem;
    border: 1px solid #FFF;
    cursor: pointer;
    margin-top: 1rem;
`;

const TitleWrapper = styled.div`
    font-family: "Pretendard";
    font-size: 1.1rem;
    font-style: normal;
    font-weight: 600; 
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;
    margin-left: 2rem;
`;

const Cost = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; // 한 줄의 높이
    margin-top: 0.65rem;
    margin-left: 2rem;
`;

const CanBorrowDateTime = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    margin-left: 2rem;
    margin-top: 0.65rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  border: 1px solid #fff;
  width: 90px; /* 원하는 너비 */
  height: 90px; /* 원하는 높이 */
  overflow: hidden; /* 이미지가 컨테이너를 벗어나면 숨깁니다. */
  img {
    width: 100%; /* 부모 요소의 100%로 이미지 크기를 조정합니다. */
    height: 100%; /* 부모 요소의 100%로 이미지 크기를 조정합니다. */
    object-fit: cover; /* 이미지가 비율을 유지하면서 컨테이너를 채우도록 합니다. */
  }
`;

const RentingImage = styled.img`
  position: absolute; /* 이미지를 부모 요소를 기준으로 위치시키기 위해 절대 위치를 설정합니다. */
  top: 0; /* 부모 요소의 맨 위에 이미지를 배치합니다. */
  left: 0; /* 부모 요소의 맨 왼쪽에 이미지를 배치합니다. */
  z-index: 2; /* 다른 요소 위에 이미지를 배치하기 위해 z-index 값을 설정합니다. */
`;