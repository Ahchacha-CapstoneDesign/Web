import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';
import Pagination, {PaginationContainer} from '../Pagination';
import ConfirmOrCancleModal from '../ConfirmOrCancleModal';
import ConfirmOrCancleModalDetail from '../ConfirmOrCancleModalDetail';
import ReviewModal from '../ReviewModalToRetner'

const LocalPaginationContainer = styled(PaginationContainer)`
  justify-content: flex-end;
  padding-left: 13rem;
  margin-top: -1rem;
`;

const MyRegisterList = () => {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [registerData, setRegisterData] = useState({ canreserveCount: 0, reservedCount: 0, rentingCount: 0, returnedCount: 0, items: []  });
  const [currentStatus, setCurrentStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [processingItemId, setProcessingItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);


  const [statusData, setStatusData] = useState({
    ALL: { items: [], totalPages: 0 },
    NONE: { items: [], totalPages: 0 },
    RESERVED: { items: [], totalPages: 0 },
    RENTING: { items: [], totalPages: 0 },
    RETURNED: { items: [], totalPages: 0 }
  });

  useEffect(() => {
    fetchItemsByStatus('ALL').then(() => {
      fetchItemsByStatus('NONE').then(() => {
        // 모든 데이터 로딩 후, NONE 상태로 UI 설정
        handleStatusChange('NONE');
      });
    });
    fetchNoneCount();
  }, []);

  const fetchNoneCount = async () => {
    try {
      const { data } = await apiClient.get('/items/reservationYES');
      setRegisterData(prev => ({
        ...prev,
        canreserveCount: data.content.length
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchItemsByStatus = async (status) => {
    let url = '/reservation/myAllItemsRentedByOther'; // 'ALL' 상태의 기본 엔드포인트
    switch (status) {
      case 'NONE':
        url = '/items/reservationYES'; // 'NONE' 상태의 아이템을 가져오는 엔드포인트
        break;
      case 'RESERVED':
        url = '/reservation/myItemsReservedByOther';
        break;
      case 'RENTING':
        url = '/reservation/myItemsRentingByOther';
        break;
      case 'RETURNED':
        url = '/reservation/myItemsReturnedByOther';
        break;
      default:
        // 'ALL' 상태에서는 모든 아이템을 포함해야 하므로 특별한 경우가 아닌 경우 기본 URL 사용
        break;
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
  
      // 'ALL' 상태에서는 전체 등록 데이터를 업데이트
      if (status === 'ALL') {
        setRegisterData(prev => ({
          ...prev,
          items: filteredData,
          canreserveCount: prev.canreserveCount,  // 이미 업데이트된 canreserveCount를 유지
          reservedCount: filteredData.filter(item => item.rentingStatus === 'RESERVED').length,
          rentingCount: filteredData.filter(item => item.rentingStatus === 'RENTING').length,
          returnedCount: filteredData.filter(item => item.rentingStatus === 'RETURNED').length,
        }));
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
  
  const getStatusStyle = (status) => ({
    color: statusColors[status]?.color || "white",
  });

  const handleStatusChange = (status) => {
    if (currentStatus !== status) {
      setCurrentStatus(status);
      setCurrentPage(1); // 페이지 1로 리셋
      fetchItemsByStatus(status).then(() => {
        // 상태 변경 후 데이터를 성공적으로 불러온 후 UI 업데이트
      });
    }
  };

  const handlePageChange = newPage => {
    setCurrentPage(newPage); // 페이지 변경 처리
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

  const handleRent = (itemId) => {
    setProcessingItemId(itemId);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);  // 기존 모달을 닫고
    setReviewModalOpen(true);  // 리뷰 모달을 엽니다.
  };

  const goBackToConfirm = () => {
    setReviewModalOpen(false); // 리뷰 모달 닫기
    setModalOpen(true); // 이전 모달 열기
  };

  const handleCloseAllModals = () => {
    setModalOpen(false);
    setReviewModalOpen(false);
  };

  const confirmRent = async () => {
    if (!processingItemId) return;
  
    try {
      const response = await apiClient.patch(`/reservation/${processingItemId}/updateReservedToRenting`);
      if (response.status === 200) {
        setModalOpen(false); // 모달 닫기

        // 데이터 새로고침
        await fetchItemsByStatus('RESERVED');
        await fetchItemsByStatus('RENTING');

        setRegisterData(prev => ({
          ...prev,
          reservedCount: prev.items.filter(item => item.rentingStatus === 'RESERVED').length,
          rentingCount: prev.items.filter(item => item.rentingStatus === 'RENTING').length,
        }));
        navigate('/mypage/registerlist');
      }
    } catch (error) {
      console.error('대여 처리 중 오류가 발생했습니다:', error);
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const confirmReturn = async () => {
    if (!processingItemId) return;
  
    try {
      const response = await apiClient.patch(`/reservation/${processingItemId}/updateRentingToReturned`);
      if (response.status === 200) {
        setModalOpen(false); // 모달 닫기
        
        await fetchItemsByStatus('RENTING'); // 상태 업데이트 후 예약 완료 목록을 새로고침
        await fetchItemsByStatus('RETURNED'); // 대여 중 상태도 업데이트

        setRegisterData(prev => ({
          ...prev,
          reservedCount: prev.items.filter(item => item.rentingStatus === 'RENTING').length,
          rentingCount: prev.items.filter(item => item.rentingStatus === 'RETURNED').length,
        }));
        navigate('/mypage/registerlist');
      }
    } catch (error) {
      console.error('대여 처리 중 오류가 발생했습니다:', error);
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

    return (
        <>
        <GlobalStyle /> 
          <Container>
            <RentingTitleContainer>
              <RentingTitle>등록 내역</RentingTitle>
            </RentingTitleContainer>
                
            <RentingInfoBox>
              <StatusButton onClick={() => handleStatusChange('NONE')} isActive={currentStatus === 'NONE'}>대여 가능<Break/>{registerData.canreserveCount}</StatusButton>
              <StatusButton onClick={() => handleStatusChange('RESERVED')} isActive={currentStatus === 'RESERVED'}>예약 완료<Break/>{registerData.reservedCount}</StatusButton>
              <StatusButton onClick={() => handleStatusChange('RENTING')} isActive={currentStatus === 'RENTING'}>대여중<Break/>{registerData.rentingCount}</StatusButton>
              <StatusButton onClick={() => handleStatusChange('RETURNED')} isActive={currentStatus === 'RETURNED'}>반납 완료<Break/>{registerData.returnedCount}</StatusButton>
            </RentingInfoBox>
            <Divider />

            {displayedItems.map((item, index) => (
              <ItemContainer key={item.id} isFirst={index === 0}>
                <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'} />
                <ItemTitle>{item.title}</ItemTitle>
                {currentStatus === 'NONE' ? (
                  <Item>
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
                    <ItemPrice2>{item.pricePerHour}원/시간</ItemPrice2>
                  </Item>
                ) : (
                  <Item>
                    <ItemOwnerImage src = {item.userDefaultProfile || '/assets/img/Profile.png'} alt="Profile" />
                    <ItemOwnerNickname>{item.userNickname}</ItemOwnerNickname>
                    <ItemDetails>
                      <DetailsContainer>
                        <DetailsTitle>대여</DetailsTitle>
                        <DetailsContext>
                          <Place>{item.itemBorrowPlace}</Place>
                          <Time>{formatDate(item.borrowTime)}</Time>
                        </DetailsContext>
                      </DetailsContainer>
                      <DetailsContainer>
                        <DetailsTitle>반납</DetailsTitle>
                        <DetailsContext>
                          <Place>{item.itemReturnPlace}</Place>
                          <Time>{formatDate(item.returnTime)}</Time>
                        </DetailsContext>
                      </DetailsContainer>
                    </ItemDetails>
                    <ItemPrice>{item.totalPrice}원</ItemPrice>
                  </Item>
                )}
                <ItemStatusDetail>
                  <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                  {item.rentingStatus === 'RESERVED' && (
                    <>
                      <Handlebutton onClick={() => handleRent(item.id)}>대여 처리</Handlebutton>
                      {modalOpen && (
                        <ConfirmOrCancleModalDetail
                          title="대여 처리를 하시겠습니까?"
                          message={<span>대여자한테 물건을 전달하였다면<br/>대여 처리를 해주세요</span>}                          isOpen={modalOpen}
                          setIsOpen={setModalOpen}
                          onConfirm={confirmRent}
                        />
                      )}
                    </>
                  )}
                  {item.rentingStatus === 'RENTING' && (
                    <>
                      <Handlebutton onClick={() => handleRent(item.id)}>반납 처리</Handlebutton>
                      {modalOpen && (
                        <ConfirmOrCancleModalDetail
                          title="반납 처리를 하시겠습니까?"
                          message={<span>대여자한테 물건을 반납 받았다면 <br/>반납 처리를 해주세요</span>}                          
                          isOpen={modalOpen}
                          setIsOpen={setModalOpen}
                          onConfirm={confirmReturn}
                        />
                      )}
                    </>
                  )}
                  {item.rentingStatus === 'RETURNED' && (
                      <>
                        <Handlebutton onClick={() => handleRent(item.id)}>리뷰 쓰기</Handlebutton>
                        {modalOpen && (
                          <ConfirmOrCancleModalDetail
                            title="리뷰를 작성하시겠습니까?"
                            message={<span>대여자에 대한 별점을 주셔야 <br/>다른 물건 등록이 가능합니다</span>}                          
                            isOpen={modalOpen}
                            setIsOpen={setModalOpen}
                            onConfirm={handleConfirm}
                          />
                        )}
                        {reviewModalOpen && (
                          <ReviewModal
                            onBack={goBackToConfirm}
                            isOpen={reviewModalOpen}
                            setIsOpen={setReviewModalOpen}
                            reservationId={processingItemId}
                            handleCloseAllModals={handleCloseAllModals}
                            // 여기에 리뷰 모달에 필요한 추가적인 props를 전달할 수 있습니다.
                          />
                        )}
                      </>
                    )}
                </ItemStatusDetail>
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
  
  export default MyRegisterList;

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
      overflow: hidden;
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
  width: 13rem;
  margin-left: 2rem;
`;

const ItemOwnerImage = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-left: -2rem;
`;

const ItemOwnerNickname = styled.div `
  width: 8rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
`;

const Item = styled.div `
  display: flex;
  align-items: center;
  flex-direction: row;
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
`;

const DetailsTitle = styled.div` 
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 300;
  width:2rem;
  align-items: center;

`;

const DetailsContext = styled.div`
  display: flex;
  color: white;
  font-family: "Pretendard";
  align-items: center;
`;

const Place = styled.div`
  width: 5rem;
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
`;

const Time = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  align-items: center;
  margin-left: 1rem;
`;

const ItemPrice = styled.div`
  margin-left: 2rem;
  width: 6rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
`;

const ItemPrice2 = styled.div`
  margin-left: 8rem;
  margin-right: 2rem;
  width: 6rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
`;
const ItemStatus = styled.div`
  font-family: 'Pretendard';
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem;
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

const ItemStatusDetail = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const Handlebutton = styled.button`
  width: 5rem;
  border-radius: 0.625rem;
  border: 1px solid #D9D9D9;
  font-family 'Pretendard';
  background-color: transparent;
  color: #D0CDCD;
  font-size: 0.8rem;
  font-weight: 400;
  cursor: pointer;
`;

const Break = styled.div`
  margin-bottom: 0.75rem; /* 원하는 간격 조정 */
`;