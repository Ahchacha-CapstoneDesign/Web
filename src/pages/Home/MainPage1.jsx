import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components
import { EffectCoverflow, Pagination,Navigation } from "swiper"; // Swiper에서 가져올 모듈들
import apiClient from "../../path/apiClient";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const MainPage1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // 아이템을 저장할 상태
  const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치를 저장할 상태
  const scrollThreshold = 100; // 스크롤 임계값 설정

  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiClient.get('/items/top-reservations');
        console.log(response); // 전체 응답 로그로 확인
        if(response.data) {
          setItems(response.data); // 응답 데이터를 직접 사용
        } else {
          setItems([]); // 응답 데이터가 없는 경우 빈 배열로 설정
        }
      } catch (error) {
        console.error('아이템을 가져오는데 실패했습니다:', error);
        setItems([]); // 오류가 발생한 경우 빈 배열로 설정
      }
    };
  
    fetchItems();
  }, []);
  

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

useEffect(() => {
  const handleWheel = (e) => {
    setScrollPosition(prev => {
      const newScrollPosition = prev + e.deltaY;
      if (newScrollPosition >= scrollThreshold) {
        navigate('/mainpage/2');
        return 0; // 페이지가 변경되면 스크롤 위치를 초기화
      } else if (newScrollPosition <= -scrollThreshold) {
        navigate('/mainpage/1');
        return 0; // 페이지가 변경되면 스크롤 위치를 초기화
      }
      return newScrollPosition;
    });
  };

  window.addEventListener('wheel', handleWheel);

  return () => window.removeEventListener('wheel', handleWheel);
}, [navigate]);

  function getTime(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간제를 사용하려면 false로 설정합니다.
    });
    return formatter.format(date);
}

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
      <ItemTitle>많이 찾는 아차! 물건 🥇</ItemTitle>
      <ScrollIndicators>
        <Circle active={!isScrolled} onClick={() => navigate('/mainpage/1')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/2')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/3')} />
        <Circle active={isScrolled} onClick={() => navigate('/mainpage/4')} />
        <Scroll />
      </ScrollIndicators>
      <SwiperContainer>
      {items.length > 0 && (
        <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            effect="coverflow"
            loop={true}
            coverflowEffect={{
              rotate: 20, // 회전 각도를 증가시켜 더 돋보이게 합니다.
              stretch: 60, // 슬라이드 간의 거리를 기본 값으로 설정합니다.
              depth: 100, // 깊이를 적당히 설정하여 입체감을 줍니다.
              modifier: 1, // 영향력을 조절합니다.  
              slideShadows: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="mySwiper"
            >
            {items.map((item, index) => (
            <SwiperSlide key={index} onClick={() => navigate(`/rent/itemdetail/${item.id}`)}>
              <SlideBox>

                {item.imageUrls && item.imageUrls.length > 0 ? (
                    <ItemImage src={item.imageUrls[0]} alt="Item" />
                ) : (
                    // 기본 이미지를 불러오는 경우
                    <ItemImage src="/assets/img/ItemDefault.png" alt="Item" />
                )}
                <ItemDetail>
                  <ItemDetailTitle>{item.title}</ItemDetailTitle>
                  <ItemPrice>비용: {item.pricePerHour}원 / 시간</ItemPrice>
                  <ItemTime>
                    대여 가능 시간: 
                    <br />
                    {getTime(item.canBorrowDateTime)} ~ {getTime(item.returnDateTime)}
                  </ItemTime>
                </ItemDetail>
              </SlideBox>
            </SwiperSlide>
          ))}
          </Swiper>
      )}
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

const SwiperContainer = styled.div`
width: 80rem;
margin: auto; 
margin-top: 2rem;

.swiper {
  width: 80%;
  height: 100%;
  perspective: 1200px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 27rem;
  border-radius: 10px;
}

.swiper-button-next, .swiper-button-prev {
  color: #00FFE0;
  cursor: pointer;
}
`;

const SlideBox = styled.div`
  height: 29rem; // 슬라이드 높이 설정
  background-color: transparent; // 슬라이드 배경색 설정
  display: flex;
  flex-direction: column; // 요소들을 세로로 배열
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-size: 1.5rem;
  border-radius: 20px; // 슬라이드 모서리 둥글게 설정
  color: white; // 슬라이드 텍스트 색상 설정
  transform: scale(0.8); // 초기 크기를 줄여서 중앙 슬라이드가 활성화될 때 더 크게 보이게 합니다.
  border: 1px solid #00FFE0;
`;

const ScrollIndicators = styled.div`
  position: fixed;
  margin-left: 15rem;
  top: 60%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
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

const ItemImage = styled.img`
  width: 14rem;
  height: 15rem;
  border: 1px solid #00FFE0;
  border-radius: 10%;
`;

const ItemDetail = styled.div`
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
  margin-left: -2rem;
`;

const ItemDetailTitle = styled.div`
  color: #FFF;
  text-align: flex-start;
  margin-top: 1.44rem;
`;

const ItemPrice = styled.div`

`;

const ItemTime = styled.div`

`;