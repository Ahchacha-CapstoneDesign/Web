import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination from "../Pagination";
import apiClient from "../../path/apiClient";

const CommunityMain = () => {
    const navigate = useNavigate();
    const [displayedPosts, setDisplayedPosts] = useState([]); // 현재 페이지에 표시될 포스트
    const [posts, setPosts] = useState([]);
    const [searchedPosts, setSearchedPosts] = useState([]); // 검색된 게시글 목록
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState('date'); 
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [profileImage, setProfileImage] = useState('');
    const searchInputRef = useRef(null);

    const ITEMS_PER_PAGE = 4;

    const fetchPosts = async () => {
        // 모든 게시글을 불러오는 URL. 페이지나 사이즈 매개변수 없음
        let url = `/community/list`;
    
        if (sort === 'like-counts') {
            url = `/community/list/like-counts`;
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
        const searchTitleUrl = `/community/list/search-title?title=${encodeURIComponent(searchTerm)}&page=1`;
        // 내용으로 검색
        const searchContentUrl = `/community/list/search-content?content=${encodeURIComponent(searchTerm)}&page=1`;
    
        try {
          const [titleResponse, contentResponse] = await Promise.all([
            apiClient.get(searchTitleUrl),
            apiClient.get(searchContentUrl)
          ]);
    
          let combinedResults = [...titleResponse.data.content, ...contentResponse.data.content];

        // 중복 제거
        combinedResults = Array.from(new Map(combinedResults.map(post => [post.id, post])).values());

        // '좋아요순' 선택 시 결과를 좋아요 수에 따라 정렬
        if (sort === 'like-counts') {
            combinedResults.sort((a, b) => b.likeCount - a.likeCount);
        }else if (sort === 'date') {
            // '최근 작성순' 선택 시 결과를 생성 날짜에 따라 내림차순 정렬
            combinedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.created_at));
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

            if (sort === 'like-counts') {
                sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
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

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setCurrentPage(1); // 정렬 방식 변경 시 첫 페이지로 이동
    };

    const handleSearchInputClick = () => {
        searchInputRef.current.focus(); // SearchInput에 포커스
    };

    useEffect(() => {
        const storedProfileImage = localStorage.getItem('profileImageUrl');
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        } else {
          // 저장된 이미지가 없을 경우 기본 이미지 경로 설정
          setProfileImage('/assets/img/Profile.png');
        }
    });

    // 글 작성 페이지로 이동
    const goToWritePost = () => {
        navigate('/community/posting');
    };

    // 글 상세 페이지로 이동
    const goToPostDetail = (id) => {
        navigate(`/post/${id}`);
    };

  const WritingArea = () => {
      return (
        <WritingContainer onClick={goToWritePost}>
        <img src={profileImage || "/assets/img/Profile.png"} alt="Profile"
            style={{ marginRight: '1.5rem', width: '70px', height: '70px', borderRadius: '50%'}} />
          <WritingBox>
            질문을 남겨 보세요.
          </WritingBox>
        </WritingContainer>
      );
  };

  return (
    <>
        <GlobalStyle /> 
        <PageContainer>
            <WritingArea />
            <MainContainer>
                <SearchInputContainer onSubmit={(e) => {
                    e.preventDefault(); // 폼 제출 기본 동작 방지
                    executeSearch(); // 검색 실행
                    }}
                    onClick={handleSearchInputClick}
                    >
                    <img src="/assets/img/Search.png" alt="Search Icon" 
                        style={{ margin: '2rem', width: '1.8rem', height: '1.6rem', cursor: "pointer"}}
                        onClick={() => executeSearch()}
                    />
                    <SearchInput
                        ref={searchInputRef}
                        type="text"
                        placeholder="원하는 글을 검색해 보세요."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // 폼 제출을 방지합니다.
                                executeSearch(); // 검색을 실행합니다.
                            }
                        }}
                    />
                    <button type="submit" style={{ display: 'none' }}>검색</button> {/* 숨겨진 제출 버튼 */}
                </SearchInputContainer>

                <SortButtonsContainer>
                    <SortButton onClick={() => handleSortChange('date')} active={sort === 'date'}>
                    <ButtonImage src={sort == 'date'  ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image"/>
                    최근 작성순
                    </SortButton>
                    <SortButton onClick={() => handleSortChange('like-counts')} active={sort === 'like-counts'}>
                    <ButtonImage src={sort == 'like-counts'  ? "/assets/img/Check.png" : "/assets/img/Ellipse.png"} alt="button image"/>
                    좋아요순
                    </SortButton>
                </SortButtonsContainer>

                <PostList>
                    {displayedPosts.map((post) => (
                        <PostItem key={post.id}>
                            <TitleWrapper>
                                {post.title}
                            </TitleWrapper>
                            <Content>
                                {(post.content && post.content.replace(/<img[^>]*>/g, "").replace(/<[^>]*>?/gm, "")) || "내용이 없습니다."}
                            </Content>
                            <Details>
                                좋아요: {post.likeCount} | 댓글: {post.replyCount} | 조회수: {post.viewCount}
                            </Details>
                        </PostItem>
                    ))}
                </PostList>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </MainContainer>
        </PageContainer>
    </>
  );
};

export default CommunityMain;

// 다음은 styled-components를 사용한 스타일 정의입니다.

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
      font-family: "Pretendard";
  }

  /* 스크롤바 전체 스타일 */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  /* 스크롤바 트랙(바탕) 스타일 */
  ::-webkit-scrollbar-track {
    background: transparent; /* 트랙의 배경색 */
  }

  /* 스크롤바 핸들(움직이는 부분) 스타일 */
  ::-webkit-scrollbar-thumb {
    background: #00FFE0; /* 핸들의 배경색 */
    border-radius: 5px;
  }
`;

const WritingContainer = styled.div`
    align-items: center;
    background-color: #1F1F1F;
    border-radius: 1.25rem;
    display: flex;
    height: 8rem;
    justify-content: center;
    margin-top: 3rem;
    width: 70rem;  
    cursor: pointer;
`;

const WritingBox = styled.div`
    align-items: center;
    background-color: #343434;
    border-radius: 1.3rem;
    box-sizing: border-box;
    color: #A1A1A1;
    display: flex;
    font-size: 1.3rem;
    font-weight: 800;
    height: 5rem;
    justify-content: left;
    margin-left: 1.5rem;
    padding-left: 2.69rem;
    width: 50rem;
`;

const MainContainer = styled.div`
    background: #1F1F1F;
    border-radius: 1.25rem;
    display: flex;
    flex-direction: column;
    min-height: 55rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
    width: 70rem;;
`;

const SortButtonsContainer = styled.div`
    display: flex;
    margin-left: 32rem;
    margin-top: -2rem;
`;

const SortButton = styled.button`
    background-color: transparent;
    border: none;
    margin-right: 1.5rem;
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
  margin-right: 1rem;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchInputContainer = styled.div`
    align-items: center;
    border-radius: 0.625rem;
    display: flex;
    width: 25.75rem;
    height: 2.9375rem;
    margin-left: 3.94rem;
    margin-top: 2rem;
    background-color: #343434;
`;


const SearchInput = styled.input`
    border: none;
    margin-left: -1rem; 
    font-size: 1.2rem;
    width: 19rem;
    height: 2.9375rem;
    outline: none;
    background-color: transparent;
    color: white;
`;

const PostList = styled.div`
    color: #FFF;
    display: flex;
    flex-direction: column;
    width:88%;
    margin-left: 3.94rem;
    margin-top: 2rem;
`;

const PostItem = styled.div`
    padding: 2rem;
    border-bottom: 1px solid #343434;
    cursor: pointer;
`;

const TitleWrapper = styled.div`
    font-family: "Pretendard";
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 0.3rem;
`;

const Content = styled.div`
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.875rem; // 한 줄의 높이
    margin-bottom: 0.5rem;
    overflow: hidden; // 내용이 박스를 초과할 경우 숨깁니다.
    text-overflow: ellipsis; // 텍스트가 오버플로우될 때 "..."으로 표시합니다.
    display: -webkit-box;
    -webkit-line-clamp: 2; // 보여줄 줄의 수를 2줄로 제한합니다.
    -webkit-box-orient: vertical;
    height: 3.75rem; // line-height의 두 배 값
`;

const Details = styled.div`
    color: #D6D6D6;
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 400;
`;
