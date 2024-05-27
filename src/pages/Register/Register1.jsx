import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Pagination, {PaginationContainer} from "../Pagination";
import apiClient from "../../path/apiClient";
import ConfirmOrCancleModal from "../ConfirmOrCancleModal";
import ConfirmModal from "../ConfirmModal";

const LocalPaginationContainer = styled(PaginationContainer)`
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Register1 = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPage, setSelectedPage] = useState('register'); // 새로운 state 추가
    const userstatus = localStorage.getItem('personOrOfficial');
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [registerData, setRegisterData] = useState({ canreserveCount: 0, reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });
    const [currentStatus, setCurrentStatus] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalClose, setModalClose] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const [statusData, setStatusData] = useState({
        ALL: { items: [], totalPages: 0 },
        NONE: { items: [], totalPages: 0 },
        RESERVED: { items: [], totalPages: 0 },
        RENTING: { items: [], totalPages: 0 },
        RETURNED: { items: [], totalPages: 0 }
    });

    useEffect(() => {
        fetchItemsByStatus(currentStatus);
    }, [currentStatus, currentPage]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedItem(null); // 카테고리 변경 시 선택된 아이템 초기화
    };

    const handleUpdateClick = (itemId) => {
        if (userstatus === "PERSON") {
            navigate(`/register/personUpdate/${itemId}`);
        } else if (userstatus === "OFFICIAL") {
            navigate(`/register/officialUpdate/${itemId}`);
        }
    }

    const handleReRegisterClick = (itemId) => {
        if (userstatus === "PERSON") {
            navigate(`/register/personreRegister/${itemId}`);
        } else if (userstatus === "OFFICIAL") {
            navigate(`/register/officialreRegister/${itemId}`);
        }
    }

    const fetchItemsByStatus = async (status) => {
        let url = '/items/myItems'; // 기본 엔드포인트
        if (status !== 'ALL') {
            switch (status) {
                case 'NONE':
                    url = '/items/reservationYES';
                    break;
                case 'RESERVED':
                    url = '/items/rentingStatusRESERVED';
                    break;
                case 'RENTING':
                    url = '/items/rentingStatusRENTING';
                    break;
                case 'RETURNED':
                    url = '/items/rentingStatusRETURNED';
                    break;
            }
        }
        try {
            const { data } = await apiClient.get(url);
            const filteredData = data.content;
            const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

            setStatusData(prev => ({
                ...prev,
                [status]: {
                    items: filteredData,
                    totalPages
                }
            }));

            if (status === 'ALL') {
                setRegisterData({
                    canreserveCount: filteredData.filter(item => item.rentingStatus === 'NONE').length,
                    reservedCount: filteredData.filter(item => item.rentingStatus === 'RESERVED').length,
                    rentingCount: filteredData.filter(item => item.rentingStatus === 'RENTING').length,
                    returnedCount: filteredData.filter(item => item.rentingStatus === 'RETURNED').length,
                    items: filteredData
                });
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const statusColors = {
        NONE: { text: "대여 가능", color: "white" },
        RESERVED: { text: "예약 완료", color: "#00FFF0" },
        RENTING: { text: "대여중", color: "#52FF00" },
        RETURNED: { text: "반납완료", color: "#F00" }
    };

    const handleRegisterClick = () => {
        // 등록하기 버튼 클릭 시 선택한 카테고리와 아이템 데이터를 다음 페이지로 전달
        if (selectedItem) {
            if(userstatus === "PERSON"){
                navigate('/register/personregisterdetails', {
                    state: {item: selectedItem}
                });
            }
            else if(userstatus === "OFFICIAL"){
                navigate('/register/officialregisterdetails', {
                    state: {item: selectedItem}
                });
            }
            else alert("잘못된 사용자 입니다");

        } else {
            setModalMessage("카테고리를 선택하세요.");
            setModalOpen(true);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item === selectedItem ? null : item); // 아이템 선택 토글
    };

    // 새로운 페이지 선택을 처리하는 함수
    const handlePageSelect = (page) => {
        setSelectedPage(page);
    };

    useEffect(() => {
        fetchRegisterData();
    }, [currentPage]);


    const fetchRegisterData = async () => {
        try {
            const response = await apiClient.get('/items/myItems');
            const data = response.data.content;
            setRegisterData({
                canreserveCount: data.filter(item => item.rentingStatus === 'NONE').length,
                reservedCount: data.filter(item => item.rentingStatus === 'RESERVED').length,
                rentingCount: data.filter(item => item.rentingStatus === 'RENTING').length,
                returnedCount: data.filter(item => item.rentingStatus === 'RETURNED').length,
                items: data
            });
            setTotalPages(Math.ceil(data.totalElements / ITEMS_PER_PAGE));  // 전체 페이지 수 계산
        } catch (error) {
            console.error('Failed to fetch register data:', error);
        }
    };


    const handleDelete = (itemId) => {
        setDeleteItemId(itemId);
        setModalOpen(true);
    };

    const handleModalConfirm = async () => {
        if (deleteItemId) {
            try {
                await apiClient.delete(`/items/${deleteItemId}`);
                await fetchItemsByStatus(currentStatus);
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        }
        setModalOpen(false);
        setDeleteItemId(null);
    };



    const getStatusStyle = (status) => ({
        color: statusColors[status]?.color || "white",
    });

    const handlePageChange = newPage => {
        setCurrentPage(newPage); // 페이지 변경 처리
    };

    const handleStatusChange = (status) => {
        setCurrentStatus(status);
        setCurrentPage(1); // Reset to page 1 on status change
    };

    const displayedItems = statusData[currentStatus].items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월
        const day = date.getDate().toString().padStart(2, '0'); // 일
        const hours = date.getHours().toString().padStart(2, '0'); // 시간
        const minutes = date.getMinutes().toString().padStart(2, '0'); // 분
      
        return `${year}/${month}/${day} ${hours}:${minutes}`;
      };

      const handleItemDetailPage = (item) => {
        navigate(`/rent/itemdetail/${item}`);
      };
    

    return (
        <>
            <GlobalStyle />
            {/* 물품 등록과 물품 관리를 선택할 수 있는 버튼들 */}
            <ButtonWrapper>
                <Button onClick={() => handlePageSelect('register')} selected={selectedPage === 'register'}>물품 등록</Button>
                |
                <Button onClick={() => handlePageSelect('manage')} selected={selectedPage === 'manage'}>물품 관리</Button>
            </ButtonWrapper>
            {/* 카테고리 및 아이템 목록 */}
            {selectedPage === 'register' && (
                <>
                <ItemTitle>카테고리<Span>*필수항목</Span></ItemTitle>
                <Container>
                    <CategoryWrapper>
                        <CategoryList>
                            {categories.map(category => (
                                <CategoryItem key={category.id} onClick={() => handleCategoryClick(category)} selected={selectedCategory && category.id === selectedCategory.id} >
                                    {category.name}
                                </CategoryItem>
                            ))}
                        </CategoryList>
                        <ItemList>
                            {selectedCategory && selectedCategory.items.map(item => (
                                <Item
                                    key={item}
                                    onClick={() => handleItemClick(item)} // 클릭 핸들러 추가
                                    selected={selectedItem === item} // 선택된 아이템인 경우에 배경색 변경
                                >
                                    {item}
                                </Item>
                            ))}
                        </ItemList>
                    </CategoryWrapper>
                    {selectedPage === 'register' && (
                        <RegisterButton onClick={handleRegisterClick}>등록하기</RegisterButton>
                    )}
                    <ConfirmModal
                        message={modalMessage}
                        isOpen={modalOpen}
                        setIsOpen={setModalOpen}
                        onConfirm={handleModalConfirm}
                    />
                </ Container>
                </>
            )}

            {selectedPage === 'manage' && (
                <Container>
                    <RentingTitleContainer>
                        <RentingTitle>등록 내역</RentingTitle>
                    </RentingTitleContainer>
                    <ItemLabels>
                        <ImageLabel>사진</ImageLabel>
                        <TitleLabel>제목</TitleLabel>
                        <DetailLabel>대여 및 반납 장소, 시간</DetailLabel>
                        <PriceLabel>가격</PriceLabel>
                        <StatusLabel>상태</StatusLabel>
                    </ItemLabels>

                    {displayedItems.map((item, index) => (
                        <ItemContainer key={item.id} isFirst={index === 0}>
                            <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} onClick={() => handleItemDetailPage(item.itemId)}/>
                            <ItemName onClick={() => handleItemDetailPage(item.id)}>{item.title}</ItemName>
                            <ItemDetails>
                                <DetailsContainer>
                                    <DetailsTitle>대여</DetailsTitle>
                                    <DetailsContext>
                                    <Place>{item.borrowPlace}</Place>
                                    <Time>{formatDate(item.canBorrowDateTime)}</Time>
                                    </DetailsContext>
                                </DetailsContainer>
                                <DetailsContainer>
                                    <DetailsTitle>반납</DetailsTitle>
                                    <DetailsContext>
                                    <Place>{item.returnPlace}</Place>
                                    <Time>{formatDate(item.returnDateTime)}</Time>
                                    </DetailsContext>
                                </DetailsContainer>
                            </ItemDetails>
                            <ItemPrice>{item.pricePerHour}원/시간</ItemPrice>
                            <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                            <UpdateButton
                                onClick={() => {
                                    if (item.rentingStatus === 'NONE') {
                                        handleUpdateClick(item.id);
                                    } else if (item.rentingStatus === 'RETURNED') {
                                        handleReRegisterClick(item.id);
                                    }
                                }}
                                isActive={item.rentingStatus === 'NONE' || item.rentingStatus === 'RETURNED'}
                            >
                                {item.rentingStatus === 'NONE' ? '수정' : item.rentingStatus === 'RETURNED' ? '재등록' : ''}
                            </UpdateButton>
                            <DeleteButton onClick={() => handleDelete(item.id)}>삭제</DeleteButton>
                            {modalOpen && (
                                <ConfirmOrCancleModal
                                    message="물건을 삭제하시겠습니까?"
                                    isOpen={modalOpen}
                                    setIsOpen={setModalOpen}
                                    onConfirm={handleModalConfirm}
                                />
                            )}
                        </ItemContainer>
                    ))}

                    <LocalPaginationContainer>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={statusData[currentStatus].totalPages}
                            onPageChange={handlePageChange}
                        />
                    </LocalPaginationContainer>
                </Container>
            )}
        </>
    );
};
    export default Register1;


const categories = [
    {
        id: 1,
        name: "전자기기",
        items: ["노트북", "마우스", "충전기", "보조배터리", "블루투스스피커", "키보드", "카메라", "케이블", "계산기"]
    },
    {
        id: 2,
        name: "생활",
        items: ["책", "우산", "커피포트", "보드게임", "퍼즐", "카드게임", "돗자리"]
    },
    {
        id: 3,
        name: "헬스",
        items: ["운동기기", "공", "운동화", "덤벨", "매트", "푸쉬업바", "풀업바"]
    },
    {
        id: 4,
        name: "뷰티",
        items: ["고데기", "드라이기", "토너", "에센스", "크림", "로션", "앰플"]
    },
    {
        id: 5,
        name: "예술",
        items: ["악기", "음악", "미술", "조각"]
    },
    {
        id: 6,
        name: "기타",
        items: ["기타"]
    },
];



// 스타일 컴포넌트들
export const GlobalStyle = createGlobalStyle`
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #000;
  background-position: center;
}
`;

const ButtonWrapper = styled.div`
  color:#fff;
  background-color: #000;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 21rem;
  margin-top: 2rem;
`
const Button = styled.button`
  color: ${({ selected }) => selected ? '#00FFE0' : '#fff'};
  background-color: #000;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left:0.5rem;
  margin-right:0.5rem;
  border: none;
  cursor: pointer;
`

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

const Span = styled.div` 
    display: inline-block; 
    margin-left: 0.5rem;
    color: #FF0000;
    font-family: "Pretendard";
    font-size: 1.1rem;
    font-weight: 600;
`;

const CategoryWrapper = styled.div`
  display: flex;
  margin-top: 3rem;
  width: 65rem;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  border: 0.1rem solid #fff;
`;

const CategoryList = styled.div`
  width: 32.15625rem;
  background-color: #000;
  overflow-y: auto; /* 세로 스크롤을 추가 */
  scrollbar-width: thin; /* Firefox에서 스크롤바 크기 조정 */
  scrollbar-color: #888 #555; /* Firefox에서 스크롤바 색상 조정 */
  /* WebKit 기반 브라우저 (Chrome, Safari) 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
    height: 8px; /* 스크롤바 높이 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모양 */
  }
  &::-webkit-scrollbar-track {
    background-color: #888; /* 스크롤바 트랙 색상 */
  }
`;

const CategoryItem = styled.div`
  color: ${({ selected }) => selected ? '#00FFE0' : '#fff'};
  padding: 1rem;
  cursor: pointer;
  margin-left: 1rem;
  margin-top:1rem;
  
`;

const ItemList = styled.div`
  width: 32.15625rem;
  background-color: #000;
  overflow-y: auto; /* 세로 스크롤을 추가 */
  scrollbar-width: thin; /* Firefox에서 스크롤바 크기 조정 */
  scrollbar-color: #888 #555; /* Firefox에서 스크롤바 색상 조정 */
  border-left: 0.1rem solid #fff;
  
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
    height: 8px; /* 스크롤바 높이 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #fff; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모양 */
  }
  &::-webkit-scrollbar-track {
    background-color: #888; /* 스크롤바 트랙 색상 */
  }
`;

const Item = styled.div`
  color: ${({ selected }) => selected ? '#00FFE0' : '#fff'};
  padding: 1rem;
  cursor: pointer;
  margin-left: 1rem;
`;

const RegisterButton = styled.button`
  background: #00FFE0;
  width: 19.125rem;
  height: 3.0625rem;
  border: none;
  border-radius: 2rem;
  color: #000;
  text-align: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 68rem;
  margin-top: 6rem;
`;

const ItemContainer = styled.div`
  display: flex;
  height: 7rem;
  width: 65rem;
  border-bottom: 0.5px solid #FFF;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 20px;
  border: 1px solid white;
  margin-left: 2rem;
  cursor: pointer;
`;

const ItemName = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.2rem;
  font-weight: 500;
  width: 15rem;
  max-width: 15rem;
  margin-left: 2rem;
  overflow: hidden; // 내용이 넘치면 숨김 처리
  text-overflow: ellipsis; // 내용이 넘칠 때 ... 표시
  white-space: nowrap; 
  cursor: pointer;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1rem;
`;

const DetailsTitle = styled.div` 
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 300;
  width: 3rem;
  align-items: center;
`;

const DetailsContext = styled.div`
  display: flex;
  color: white;
  font-family: "Pretendard";
  align-items: center;
`;

const Place = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
  width: 8rem; // 최대 너비 설정
  max-width: 10rem;
  overflow: hidden; // 내용이 넘치면 숨김 처리
  text-overflow: ellipsis; // 내용이 넘칠 때 ... 표시
  white-space: nowrap; // 텍스트를 한 줄로 표시
`;

const Time = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  align-items: center;
  width: 8rem;
`;

const ItemPrice = styled.div`
  margin-left: 1rem;
  width: 7rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
`;

const ItemStatus = styled.div`
  font-family: 'Pretendard';
  margin-left: 2rem;
  margin-right:-2rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  width: 8rem;
  ${(props) => `color: ${props.color}; background-color: ${props.backgroundColor};`}
`;

const RentingTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
  margin-left: -5rem;
`;

const RentingTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  margin-right: 51rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
  width: 100%;
`;

const ItemLabels = styled.div`
  display: flex;
  padding: 0.5rem 2rem;
  color: white;
  font-family: pretendard;
  font-size: 1rem;
  width: 62rem;
  background-color: transparent;  // 라벨 배경색 설정
  border-top: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
`;

const ImageLabel = styled.div`
    text-align: center;
    width: 6.5rem;
`;

const TitleLabel = styled.div`
    text-align: center;
    width: 15rem;
`;

const DetailLabel = styled.div`
    text-align: center;
    width: 18rem;
`;

const PriceLabel = styled.div `
    text-align: center;
    width: 8rem;
`;

const StatusLabel = styled.div`
    text-align: center;
    width: 7rem;
`;

const UpdateButton=styled.button`
  background-color: transparent;
  width:5rem;
  height:2.6rem;
  color:#fff;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.875rem; 
  border-radius: 10px;
  border: ${({ isActive }) => isActive ? "0.1rem solid #fff" : "none"};
  cursor: ${({ isActive }) => isActive ? "pointer" : "default"};
`;

const DeleteButton=styled.button`
  background-color: transparent;
  width:5.3rem;
  height:2.6rem;
  color:#fff;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.875rem; 
  border-radius: 10px;
  border: 0.1rem solid #fff;
  margin-left: 0.5rem;
  cursor: pointer;
`;
