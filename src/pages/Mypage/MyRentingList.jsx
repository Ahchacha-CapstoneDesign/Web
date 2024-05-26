import axios from 'axios';
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../path/apiClient";
import { useNavigate } from 'react-router-dom';
import Pagination, {PaginationContainer} from '../Pagination';
import ConfirmOrCancleModalDetail from '../ConfirmOrCancleModalDetail';
import ReviewModal from '../ReviewModalToOwner';
import ConfirmModal from '../ConfirmModal';

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
  const [showModal, setShowModal] = useState(false);
  const [processingItemId, setProcessingItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

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

  const handleCancelModalOpen = (itemId) => {
    setProcessingItemId(itemId);
    setCancelModalOpen(true);
  };

  const handleCancelReservation = async () => {
    try {
      await apiClient.delete(`/reservation/cancel/renter/${processingItemId}`);
      setCancelModalOpen(false);
      setConfirmModalOpen(true);
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
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

  const handleItemDetailPage = (item) => {
    navigate(`/rent/itemdetail/${item}`);
  };

  const handleRejectModal = () => {
    setCancelModalOpen(false);  // '아니오'를 클릭했을 때 예약 취소 모달을 닫음
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
                  <ItemImage src={item.imageUrls[0] || '/assets/img/ItemDefault.png'}  onClick={() => handleItemDetailPage(item.itemId)}/>
                  <ItemTitle  onClick={() => handleItemDetailPage(item.itemId)}>{item.title}</ItemTitle>
                  <ItemOwnerImage src = {item.itemRegisterDefaultProfile || '/assets/img/Profile.png'} alt="Profile"  onClick={() => handleItemDetailPage(item.itemId)}/>
                  <ItemOwnerNickname>{item.itemUserNickName}</ItemOwnerNickname>
                  <ItemDetails onClick={() => handleItemDetailPage(item.itemId)}>
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
                  <ItemPrice onClick={() => handleItemDetailPage(item.itemId)}>{item.totalPrice}원</ItemPrice>
                  <ItemStatusDetail>
                    <ItemStatus {...getStatusStyle(item.rentingStatus)}>{statusColors[item.rentingStatus].text}</ItemStatus>
                    {item.rentingStatus === 'RESERVED' && (
                      <>
                        <Handlebutton onClick={() => handleCancelModalOpen(item.id)}>예약 취소</Handlebutton>
                        {cancelModalOpen && (
                          <ConfirmOrCancleModalDetail
                            title="예약 취소 확인"
                            message="이 예약을 취소하시겠습니까?"
                            isOpen={cancelModalOpen}
                            setIsOpen={setCancelModalOpen}  // 여기를 수정했습니다.
                            onConfirm={handleCancelReservation}
                          />
                        )}

                        {confirmModalOpen && (
                          <ConfirmModal
                            message="예약이 취소되었습니다."
                            isOpen={confirmModalOpen}
                            setIsOpen={setConfirmModalOpen}
                            onConfirm={() => setConfirmModalOpen(false)}
                          />
                        )}
                      </>
                    )}
                    {item.rentingStatus === 'RETURNED' && (
                      item.toOwnerWrittenStatus === 'NONWRITTEN' || item.toOwnerWrittenStatus === null ? (
                      <>
                        <Handlebutton onClick={() => handleRent(item.id)}>리뷰 쓰기</Handlebutton>
                        {modalOpen && (
                          <ConfirmOrCancleModalDetail
                            title="리뷰를 작성하시겠습니까?"
                            message={<span>제공자에 대한 별점을 주셔야 <br/>다른 물건 대여가 가능합니다<br/><RedText>삭제 및 수정이 불가능합니다.</RedText></span>}                          
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
                    ) : null
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
  
  export default MyRentingList;

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
  cursor: pointer;
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
  width: 11rem; // 최대 너비 설정
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 2rem;
`;

const ItemOwnerImage = styled.img`
  margin-left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
`;

const ItemOwnerNickname = styled.div `
  margin-left: 0.2rem;
  width: 8rem;
  color: white;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 500;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
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
  width: 5rem; // 최대 너비 설정
  max-width: 7rem;
  overflow: hidden; // 내용이 넘치면 숨김 처리
  text-overflow: ellipsis; // 내용이 넘칠 때 ... 표시
  white-space: nowrap; // 텍스트를 한 줄로 표시
`;

const Time = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  align-items: center;
`;

const ItemPrice = styled.div`
margin-left: 2rem;
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

const RedText = styled.span`
  color: red;
`;