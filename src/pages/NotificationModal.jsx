import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import apiClient from '../path/apiClient';

const NotificationModal = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const handleWheel = (e) => {
        e.stopPropagation();
    };

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/notification');
            console.log('Fetched notifications:', response.data); // Fetch 시점에 콘솔 출력
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const getNotificationMessage = (notification) => {
        switch (notification.notificationType) {
            case 'COMMENT':
                return `${notification.writer}님이 ${notification.communityTitle} 게시글에 댓글을 달았습니다.`;
            case 'HEART':
                return `${notification.writer}님이 ${notification.communityTitle} 게시글에 좋아요를 눌렀습니다.`;
            case 'RESERVATION':
                return `${notification.writer}님의 ${notification.itemTitle} 물건을 예약하였습니다.`;
            case 'RETURN_ONE_HOUR':
                return `${notification.itemTitle}의 반납 1시간 전입니다.`;
            case 'RETURN_TWENTY_FOUR_HOURS':
                return `${notification.itemTitle}의 반납 하루 전입니다.`;
            default:
                return '알 수 없는 알림입니다.';
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // 알림을 읽음 상태로 업데이트
            await apiClient.put(`/notification/${notification.id}/read`);

            // 클라이언트 상태를 업데이트
            setNotifications((prevNotifications) => 
                prevNotifications.map((noti) => 
                    noti.id === notification.id ? { ...noti, isRead: true } : noti
                )
            );

            // 페이지 이동 후 모달 닫기
            if (['COMMENT', 'HEART'].includes(notification.notificationType) && notification.communityId) {
                navigate(`/community/${notification.communityId}`);
            } else {
                navigate('/mypage/main');
            }
            onClose(); 
        } catch (error) {
            console.error('Failed to update read status:', error);
        }
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
                                {notifications.map((notification, index) => (
                                    <Message 
                                        key={index} 
                                        onClick={() => handleNotificationClick(notification)}
                                        isRead={notification.read}
                                    >
                                        <Icon src="/assets/img/Ah_logo.png" alt="Ah!" />
                                        <Text isRead={notification.read}>{getNotificationMessage(notification)}</Text>
                                    </Message>
                                ))}
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
    width: 28rem;
    overflow: hidden;
    &:last-child {
        margin-bottom: 0;
    }
    cursor: pointer;
    opacity: ${({ isRead }) => (isRead ? 0.5 : 1)};
`;

const Icon = styled.img`
  margin-right: 8px;
  width: 35px;
  height: 30px;
`;

const Text = styled.p`
  margin: 0;
  font-size: 1rem;
  white-space: nowrap; // 텍스트가 한 줄로 유지되도록 설정합니다.
  overflow: hidden; // 넘치는 텍스트를 숨깁니다.
  text-overflow: ellipsis;
  color: ${({ isRead }) => (isRead ? '#ccc' : '#fff')}; // 읽은 알림은 색이 흐려짐
`;
