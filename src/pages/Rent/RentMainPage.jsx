import React, { useState, useEffect, useRef } from "react";
import ReactPaginate from 'react-paginate';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from "../Pagination";
import apiClient from "../../path/apiClient";

//대여물품 메인페이지
const RentMainPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [displayedPosts, setDisplayedPosts] = useState([]); // 현재 페이지에 표시될 포스트
  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]); // 검색된 게시글 목록
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('date');
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const searchInputRef = useRef(null);

  const ITEMS_PER_PAGE = 6;

  const fetchPosts = async () => {
    // 모든 게시글을 불러오는 URL. 페이지나 사이즈 매개변수 없음
    let url = `/items/latest`;

    if (sort === 'view-counts') { //조회수 순
      url = `/items/view-counts`;
    }
    else if (sort === 'reservation') { //예약가능 여부 순
      url = `/items/reservation`;
    }
    else if (sort === 'personOrOfficial') { //개인 or 학교 여부 순
      url = `/items/personOrOfficial`;
    }

    try {
      const response = await apiClient.get(url);
      const totalPosts = response.data.content;
      setPosts(totalPosts);
      setTotalPages(Math.ceil(totalPosts.length / ITEMS_PER_PAGE)); // 전체 게시글을 기반으로 총 페이지 수 계산
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const executeSearch = async () => {
    if (!searchTerm.trim()) {
      // 검색어가 비어있으면 기존 게시글 목록을 다시 불러옵니다.
      fetchPosts();
      setSearchedPosts([]);
      return; // 함수 종료
    }
    // searchTerm 상태를 직접 사용합니다.
    // 제목으로 검색
    const searchTitleUrl = `/items/search-title?title=${encodeURIComponent(searchTerm)}&page=1`;
    // 카테고리로 검색
    const searchCategoryUrl = `/items/search-category?category=${encodeURIComponent(searchTerm)}&page=1`;

    try {
      const [titleResponse, categoryResponse] = await Promise.all([
        apiClient.get(searchTitleUrl),
        apiClient.get(searchCategoryUrl)
      ]);

      let combinedResults = [...titleResponse.data.content, ...categoryResponse.data.content];

      // 중복 제거
      combinedResults = Array.from(new Map(combinedResults.map(post => [post.id, post])).values());

      // '조회수 순' 선택 시 결과를 조회수 수에 따라 정렬
      if (sort === 'view-counts') {
        combinedResults.sort((a, b) => b.viewCount - a.viewCount);
      } else if (sort === 'date') {
        // '최근 작성순' 선택 시 결과를 생성 날짜에 따라 내림차순 정렬
        combinedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.created_at));
      } else if (sort === 'reservation') {
        combinedResults.sort((a, b) => {
          if (a.reservation === 'YES' && b.reservation === 'NO') {
            return -1; // 'yes'가 'no'보다 우선순위를 갖도록 설정
          } else if (a.reservation === 'NO' && b.reservation === 'YES') {
            return 1; // 'no'가 'yes'보다 우선순위를 갖도록 설정
          } else {
            return 0; // 예약 가능 여부가 동일하면 순서를 유지 
          }
        });
      } else if (sort === 'personOrOfficial') {
        combinedResults.sort((a, b) => {
          if (a.personOrOfficial === 'OFFICIAL' && b.personOrOfficial === 'PERSON') {
            return -1; // 'OFFICIAL'이 'PERSON'보다 우선순위를 갖도록 설정
          } else if (a.personOrOfficial === 'PERSON' && b.personOrOfficial === 'OFFICIAL') {
            return 1; // 'PERSON'이 'OFFICIAL'보다 우선순위를 갖도록 설정
          } else {
            return 0;
          }
        });
      }

      setTotalPages(Math.ceil(combinedResults.length / ITEMS_PER_PAGE));
      setCurrentPage(1); // 검색 결과를 보여줄 때는 첫 페이지로 설정
      setSearchedPosts(combinedResults); // 검색된 게시글 목록 업데이트
      updateDisplayedAndPagination(combinedResults); // 화면에 표시될 게시글 목록 업데이트
    } catch (error) {
      console.error('Error searching posts:', error);
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
      else if (sort === 'reservation') {
        sortedPosts.sort((a, b) => {
          if (a.reservation === 'YES' && b.reservation === 'NO') {
            return -1; // 'yes'가 'no'보다 우선순위를 갖도록 설정
          } else if (a.reservation === 'NO' && b.reservation === 'YES') {
            return 1; // 'no'가 'yes'보다 우선순위를 갖도록 설정
          } else {
            return 0; // 예약 가능 여부가 동일하면 순서를 유지 
          }
        });
      } else if (sort === 'personOrOfficial') {
        sortedPosts.sort((a, b) => {
          if (a.personOrOfficial === 'OFFICIAL' && b.personOrOfficial === 'PERSON') {
            return -1; // 'OFFICIAL'이 'PERSON'보다 우선순위를 갖도록 설정
          } else if (a.personOrOfficial === 'PERSON' && b.personOrOfficial === 'OFFICIAL') {
            return 1; // 'PERSON'이 'OFFICIAL'보다 우선순위를 갖도록 설정
          } else {
            return 0;
          }
        });
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

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1); // 정렬 방식 변경 시 첫 페이지로 이동
  };

  const handleSearchInputClick = () => {
    searchInputRef.current.focus(); // SearchInput에 포커스
  };

  // 아이템 작성 페이지로 이동
  const goToItemPost = () => {
    navigate('/items');
  };

  // 아이템 상세 페이지로 이동
  // const goToItemDetail = (id) => {
  //   navigate(`/items/${itemId}`);
  // };

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes}`;
  }


  return (
    <>
      <GlobalStyle />
      <SearchSection>
        <SearchText>물건 검색</SearchText>
        <VerticalLine />
        <SearchInput />
        <SearchButton />
      </SearchSection>
      <ItemTitle>000 검색결과 (총 숫자 연동)</ItemTitle>

      <PageContainer>
        <SortButtonsContainer>
          <SortButton onClick={() => handleSortChange('date')} active={sort === 'date'}>
            <ButtonImage src={sort == 'date' ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image" />
            최근 작성순
          </SortButton>
          <SortButton onClick={() => handleSortChange('view-counts')} active={sort === 'view-counts'}>
            <ButtonImage src={sort == 'view-counts' ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image" />
            조회수 순
          </SortButton>
          <SortButton onClick={() => handleSortChange('reservation')} active={sort === 'reservation'}>
            <ButtonImage src={sort == 'reservation' ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image" />
            예약 가능
          </SortButton>
          <SortButton onClick={() => handleSortChange('personOrOfficial')} active={sort === 'personOrOfficial'}>
            <ButtonImage src={sort == 'personOrOfficial' ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image" />
            학교 대여
          </SortButton>
        </SortButtonsContainer>
        <PostList>
          {displayedPosts.map((post) => (
            <PostItem key={post.id}>
              <ImageWrapper>
                <img src={post.imageUrls[0]} alt="Item" />
                {post.reservation === 'NO' && <RentingImage src={"/assets/img/renting.png"} alt="Renting" />} {/* 조건부 렌더링 */}
              </ImageWrapper>
              <div>
                <TitleWrapper>
                  {post.title}
                </TitleWrapper>
                <Cost>
                  비용 {post.pricePerHour}원
                </Cost>
                <RentPlaceWrapper>
                  <RentPlace>대여 장소</RentPlace>
                  {post.personOrOfficial === 'OFFICIAL' ? <RentPlaceColor>{post.borrowPlace}</RentPlaceColor> : <NonColor>{post.borrowPlace}</NonColor>}
                </RentPlaceWrapper>
                <CanBorrowDateTime>
                  대여 가능 시간 {formatTime(post.canBorrowDateTime)} ~ {formatTime(post.returnDateTime)}
                </CanBorrowDateTime>
                <CanBorrowDateTime>
                  {post.reservation === 'YES' ? <ReservationAvailable>예약 가능</ReservationAvailable> : <ReservationUnavailable>예약 불가</ReservationUnavailable>}
                </CanBorrowDateTime>
              </div>
              <Details>
                조회수 {post.viewCount}
              </Details>
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

export default RentMainPage;

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
  margin-top: 2.8rem;
  text-align: left;
  margin-left: 28rem;
  font-family: "Pretendard";
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 700;
`;

const SortButtonsContainer = styled.div`
    display: flex;
    margin-left: 35rem;
    margin-top: -2rem;
`;
const SortButton = styled.button`
    background-color: transparent;
    border: none;
    margin-right: 2rem;
    cursor:pointer;
    color: ${props => props.active ? "#00FFE0" : "#E0E0E0"};
    font-family: "Pretendard";
    font-size: 0.9rem;
    font-style: normal;
    font-weight: 300;
    display: flex;
    align-items: center;
`;

const ButtonImage = styled.img`
  width: ${({ src }) => (src.includes('Check.png') ? '1.2rem' : '0.3rem')};
  height: ${({ src }) => (src.includes('Check.png') ? '1rem' : '0.3rem')};
  margin-right: 0.5rem;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Details = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    margin-left: 5rem;
`;

const PostList = styled.div`
    background-color: black;
    color: #FFF;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    width:53%;
    margin-right: 1rem;
    margin-top: 0.5rem;
`;

const PostItem = styled.div`
    display: flex; /* 요소들을 가로로 나란히 정렬하기 위해 flex 사용 */
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
    margin-left: 2rem;
`;

const CanBorrowDateTime = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    margin-left: 2rem;
`;

const RentPlaceWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: 2rem;
`;

const RentPlace = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    margin-right: 0.5rem; /* 간격 조정 */
`;

const RentPlaceColor = styled.div`
    color: #95F702;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
`;

const NonColor = styled.div`
    color: #fff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
`;

const ReservationAvailable = styled.span`
  color: #B9E0FD; 
`;

const ReservationUnavailable = styled.span`
  color: #DB4455; // 빨간색
`;

const ImageWrapper = styled.div`
  position: relative;
  border: 1px solid #fff;
  width: 100px; /* 원하는 너비 */
  height: 100px; /* 원하는 높이 */
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
