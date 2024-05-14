import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';

const MyRentingList = () => {
  const [rentData, setRentData] = useState({ reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    fetchRentData();
  }, [currentPage]);


  const fetchRentData = async () => {
    try {
      const response = await apiClient.get('/reservation/myItems');
      const data = response.data.content;
      setRentData({
        reservedCount: data.filter(item => item.rentingStatus === 'RESERVED').length,
        rentingCount: data.filter(item => item.rentingStatus === 'RENTING').length,
        returnedCount: data.filter(item => item.rentingStatus === 'RETURNED').length,
        items: data
      });
      setTotalPages(Math.ceil(data.totalElements / ITEMS_PER_PAGE));  // 전체 페이지 수 계산
    } catch (error) {
      console.error('Failed to fetch rent data:', error);
    }
  };

  const statusColors = {
    NONE: { text: "대여 가능", color: "white" },
    RESERVED: { text: "예약 완료", color: "#00FFF0" },
    RENTING: { text: "대여중", color: "#52FF00" },
    RETURNED: { text: "반납완료", color: "#F00" }
  };

  const getStatusStyle = (status) => ({
    color: statusColors[status]?.color || "white",
  });

  const handlePageChange = (path) => {
    navigate(path);
  };

    return (
        <>
        <GlobalStyle /> 
            <Container>
              <RentingTitleContainer>
                <RentingTitle>대여 내역</RentingTitle>
              </RentingTitleContainer>
                
              <RentingInfoBox>
                <Reserved>예약 완료<Break/>{rentData.reservedCount}</Reserved>
                <Renting>대여중<Break/>{rentData.rentingCount}</Renting>
                <Returned>반납 완료<Break/>{rentData.returnedCount}</Returned>
              </RentingInfoBox>

              {rentData.items.map(item => (
                <ItemContainer key={item.id}>
                  <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} />
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.totalPrice}원</ItemPrice>
                  <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                </ItemContainer>
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={newPage => setCurrentPage(newPage)}
              />
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

const ItemContainer = styled.div`
  display: flex;
  width: 59.5rem;
  height: 7rem;
  margin-top: 1rem;
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
  align-items: center;
  margin-top: 2rem;
  margin-left: 14rem;
`;

const RentingTitle = styled.div`
  color: white;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
`;

const RentingInfoBox = styled.div`
  background: #343434;
  display: flex;
  justify-content: space-between;
  width: 59.5rem;
  height: 7rem;
  margin-top: 1rem;
  margin-left: 15rem;
  align-items: center;
  border-radius: 12px;
`;

const Reserved = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
  border-right: 1px solid #FFF;
`;

const Renting = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
  border-right: 1px solid #FFF;
`;

const Returned = styled.div`
  flex-grow: 1; /* 자식 요소들의 너비를 동일하게 설정 */
  color: white;
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