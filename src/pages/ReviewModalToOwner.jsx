import React, { useState } from 'react';
import styled from 'styled-components';
import apiClient from '../path/apiClient';
import ConfirmModal from './ConfirmModal';


const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
    font-family: 'Pretendard';
    background-color: white;
    width: 35rem;
    height: 25rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.div`
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 2rem;
    margin-top: 2rem;
`;

const TextArea = styled.textarea`
    box-sizing: border-box;
    font-family: 'Pretendard';
    width: 30rem;
    height: 20rem;
    resize: none;
    background-color: #F5F5F5;
    margin-left: auto; // 가운데 정렬을 위한 설정
    margin-right: auto; // 가운데 정렬을 위한 설정
    border: none;
    padding: 10px;
    font-size: 1rem;
    font-weight: 400;
`;

const StarRatingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  align-items: center;
`;

const Star = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const StarRatingText = styled.span`
    font-size: 1rem;
    font-family: 'Pretendard';
    margin-left: 10px; // 별점과 텍스트 사이의 간격
`;

const ErrorMessage = styled.span`
    font-size: 1rem;
    color: red;
    margin-left: 10px;
`;


const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center; 
    border-top: 1px solid #D9D9D9;
    margin-top: 1.5rem;
`;

const BackButton = styled.button`
    display: flex;
    flex-grow: 1;
    border: none;
    background-color: transparent;
    justify-content: center;
    height: 4rem;
    width: 100%;
    align-items: center;    
    color: #D9D9D9;
    font-size: 1rem;
    cursor: pointer;
    border-right: 1px solid #D9D9D9;
`;

const Button = styled.button`
    display: flex;
    flex-grow: 1;
    border: none;
    background-color: transparent;
    justify-content: center;
    height: 4rem;
    width: 100%;
    align-items: center;    
    color: #66D1FF;
    font-size: 1rem;
    cursor: pointer;
`;

function Review({ isOpen, setIsOpen, onBack, reservationId, handleCloseAllModals }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);


    const submitReview = async () => {
        if (rating === 0) {
            setShowError(true);
            return;
        }
        setShowError(false);
        const payload = {
            reservationId: reservationId,  // 필요한 ID를 제공해야 합니다
            reviewComment: review,
            reviewScore: rating
        };
        try {
            const response = await apiClient.post('/review/toOwner', payload);
            if (response.status === 201) {
                setMessage('리뷰 등록이 완료되었습니다!');
                setConfirmOpen(true);
            } else {
                setMessage('이미 리뷰를 작성하셨습니다!');
                setConfirmOpen(true);
            }
        } catch (error) {
            setMessage('리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            setConfirmOpen(true);
        }
    };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };


  const handleCloseModal = () => {
    handleCloseAllModals();  // 모든 관련 모달을 닫는 상위 컴포넌트의 함수 호출
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      src={rating > index ? '/assets/img/YellowStar.png' : '/assets/img/GrayStar.png'}
      onClick={() => handleStarClick(index)}
    />
  ));

  return (
    <ModalBackground>
      <ModalContainer>
        <Title>별점 및 리뷰</Title>
        <StarRatingContainer>
          {stars}
          <StarRatingText>({rating}/5)</StarRatingText>
          {showError && <ErrorMessage>체크해주세요!</ErrorMessage>}
        </StarRatingContainer>
        <TextArea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="다른 분들에게 도움이 될 수 있도록 리뷰를 작성해주세요(선택)"
        />
        <ButtonContainer>
            <BackButton onClick={onBack}>이전</BackButton>
            <Button onClick={submitReview}>제출하기</Button>
        </ButtonContainer>
        {confirmOpen && <ConfirmModal message={message} isOpen={confirmOpen} setIsOpen={setConfirmOpen} onConfirm={handleCloseModal} />}
      </ModalContainer>
    </ModalBackground>
  );
  
}


export default Review;
