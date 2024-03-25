import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const NotificationModal = ({ isOpen, onClose }) => {

    const handleWheel = (e) => {
        e.stopPropagation();
      };
    return (
        <>
        {isOpen && (
            <>
                <Overlay onClick={onClose}>
                    <ModalContainer onClick={(e) => e.stopPropagation()} onWheel={handleWheel}>
                        <ModalHeader>
                            <Title>아차차! 알림 봐야지</Title>
                            <CloseButton onClick={onClose}>X</CloseButton>
                        </ModalHeader>
                        <Divider />
                        <Content>
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message> 
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>   
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>   
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>  
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>  
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>  
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>  
                            <Message>
                                <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                <Text>으라차차의 물건을 대여 완료했습니다.</Text>
                            </Message>  
                        </Content>
                </ModalContainer>
                </Overlay>
            </>
            )}
        </>
        );
};

export default NotificationModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); // 반투명 오버레이
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
    font-family: "Pretendard";
    background: #000;
    padding: 2rem;
    border: 1px solid #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 29.9375rem;
    height: 20rem;
    max-width: 600px; // 모달의 최대 너비
    z-index: 1001; // 이 값을 높게 설정하여 모달이 맨 앞에 나타나도록 합니다.
    position: fixed; // 모달을 페이지 상단에 고정
    top: 7rem;
    right: 12rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; // 제목과 내용 사이의 간격을 추가합니다.
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #fff; // ModalHeader 바로 아래의 흰색 줄입니다.
  margin: 1rem 0;
`;

const Title = styled.div`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
`;

const CloseButton = styled.button`
  position: absolute;
  color: #fff;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Content = styled.div`
    height: 85%;
    overflow-y: auto; // 내용이 많을 경우 스크롤을 허용합니다.
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #00FFE0;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;


const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px; // 메시지 간 간격을 추가합니다.

  &:last-child {
    margin-bottom: 0;
  }
`;

const Icon = styled.img`
  margin-right: 8px;
  width: 35px;
  height: 30px;
`;


const Text = styled.p`
  margin: 0;
  font-size: 1rem;
`;