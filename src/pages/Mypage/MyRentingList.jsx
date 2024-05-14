import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';
import Pagination, {PaginationContainer} from '../Pagination';

const LocalPaginationContainer = styled(PaginationContainer)`
  justify-content: flex-end;
  padding-left: 13rem;
  margin-top: -1rem;
`;

const MyRentingList = () => {
  const [rentData, setRentData] = useState({ reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('ALL');

  const [statusData, setStatusData] = useState({
    ALL: { items: [], totalPages: 0 },
    RESERVED: { items: [], totalPages: 0 },
    RENTING: { items: [], totalPages: 0 },
    RETURNED: { items: [], totalPages: 0 }
  });

  useEffect(() => {
    fetchItemsByStatus(currentStatus);
  }, [currentStatus, currentPage]);

  const fetchItemsByStatus = async (status) => {
    let url = '/reservation/myItems'; // 기본 엔드포인트
    if (status !== 'ALL') {
      switch (status) {
        case 'RESERVED':
          url = 'reservation/itemsRESERVED';
          break;
        case 'RENTING':
          url = 'reservation/itemsRENTING';
          break;
        case 'RETURNED':
          url = 'reservation/itemsRENTED';
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

      // Update register data only if on 'ALL' status
      if (status === 'ALL') {
        setRentData({
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
    RESERVED: { text: "예약 완료", color: "#00FFF0" },
    RENTING: { text: "대여중", color: "#52FF00" },
    RETURNED: { text: "반납완료", color: "#F00" }
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Reset to page 1 on status change
  };

  const getStatusStyle = (status) => ({
    color: statusColors[status]?.color || "white",
  });

  const handlePageChange = newPage => {
    setCurrentPage(newPage); // 페이지 변경 처리
  };

  const displayedItems = statusData[currentStatus].items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


    return (
        <>
        <GlobalStyle /> 
            <Container>
              <RentingTitleContainer>
                <RentingTitle>대여 내역</RentingTitle>
              </RentingTitleContainer>
                
              <RentingInfoBox>
                <StatusButton onClick={() => handleStatusChange('RESERVED')} isActive={currentStatus === 'RESERVED'}>예약 완료<Break/>{rentData.reservedCount}</StatusButton>
                <StatusButton onClick={() => handleStatusChange('RENTING')} isActive={currentStatus === 'RENTING'}>대여중<Break/>{rentData.rentingCount}</StatusButton>
                <StatusButton onClick={() => handleStatusChange('RETURNED')} isActive={currentStatus === 'RETURNED'}>반납 완료<Break/>{rentData.returnedCount}</StatusButton>
              </RentingInfoBox>
              <Divider />

              {displayedItems.map((item, index) => (
                <ItemContainer key={item.id} isFirst={index === 0}>
                  <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} />
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.totalPrice}원</ItemPrice>
                  <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
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
      </ >
    );
  };
  
  export default MyRentingList;

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
  }
`;

const Divider = styled.div`
  height: 0.5px;
  background-color: #FFF; // 배경색 설정
  width: 59.5rem; // 너비 설정
  margin-left: 15rem; // 좌측 여백 조정
`;


const ItemContainer = styled.div`
  display: flex;
  width: 59.5rem;
  height: 7rem;
  margin-left: 15rem;
  border-bottom: 0.5px solid #FFF;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 20px;
  border: 1px solid white;
  margin-left: 2rem;
`;

const ItemTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.2rem;
  font-weight: 500;
  width: 15.875rem;
  margin-left: 2rem;
`;

const ItemPrice = styled.div`
  width: 6rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
  margin-left: 13rem;
`;

const ItemStatus = styled.div`
  font-family: 'Pretendard';
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
  margin-left: 8rem;
  ${(props) => `color: ${props.color}; background-color: ${props.backgroundColor};`}
`;


const RentingTitleContainer = styled.div`
  display: flex;
  margin-left: -40rem;
  margin-top: 2rem;
`;

const RentingTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
`;

const RentingInfoBox = styled.div`
  background: transparent;
  display: flex;
  justify-content: space-between;
  width: 59.5rem;
  height: 7rem;
  margin-top: 1rem;
  margin-left: 15rem;
  align-items: center;
`;
const StatusButton = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  height: 4.5rem;
  color: ${(props) => (props.isActive ? '#00FFE0' : 'white')};
  border-bottom: ${(props) => (props.isActive ? '2px solid #00FFE0' : 'none')};
  cursor: pointer;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
`;

const Break = styled.div`
  margin-bottom: 0.75rem; /* 원하는 간격 조정 */
`;