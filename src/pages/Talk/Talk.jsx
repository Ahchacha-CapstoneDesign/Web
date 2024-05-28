import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../path/apiClient'; // 적절한 API 클라이언트 경로를 설정하세요.

const Talk = () => {
    const { itemId } = useParams(); // 채팅방과 관련된 아이템 ID를 URL에서 가져옵니다.
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]); // 초기 상태를 빈 배열로 설정
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatRoomInfo, setChatRoomInfo] = useState({});

    // 채팅방 목록을 가져오는 함수
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await apiClient.get(`/chat/room/${itemId}`);
                console.log("API Response:", response.data); // 응답 구조를 로깅
                if (Array.isArray(response.data)) { // 응답이 배열인지 확인
                    setChatRooms(response.data);
                } else {
                    console.error('Response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
            }
        };
        fetchChatRooms();
    }, [itemId]);

    // 선택된 채팅방의 메시지를 가져오는 함수
    const fetchMessages = async (roomId) => {
        try {
            console.log("Fetching messages for roomId:", roomId);
            const response = await apiClient.get(`/chat/history/${roomId}`);
            console.log("Messages Response:", response.data);
            setMessages(response.data);
            // 채팅방 정보를 가져오는 API가 있다면 사용
            const roomInfoResponse = await apiClient.get(`/chat/room/info/${roomId}`);
            console.log("Room Info Response:", roomInfoResponse.data);
            setChatRoomInfo(roomInfoResponse.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        if (selectedRoomId) {
            fetchMessages(selectedRoomId);
        }
    }, [selectedRoomId]);

    const handleSelectChatRoom = (roomId) => {
        setSelectedRoomId(roomId);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await apiClient.post(`/chat/send`, {
                roomId: selectedRoomId,
                message: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <Container>
            <ChatRoomList>
                {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                        <RoomItem
                            key={room.id}
                            selected={room.id === selectedRoomId}
                            onClick={() => handleSelectChatRoom(room.id)}
                        >
                            <RoomName>{room.ownerNickName}</RoomName>
                            <MessageCount>{room.chatMessages ? room.chatMessages.length : 0}</MessageCount>
                        </RoomItem>
                    ))
                ) : (
                    <NoRoomsMessage>채팅방이 없습니다.</NoRoomsMessage>
                )}
            </ChatRoomList>
            <ChatContainer>
                <ChatHeader>
                    <ChatRoomTitle>{chatRoomInfo.itemName}</ChatRoomTitle>
                    <ChatUserName>{chatRoomInfo.userNickName}</ChatUserName>
                </ChatHeader>
                <MessagesContainer>
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <Message key={index}>{message.message}</Message>
                        ))
                    ) : (
                        <NoMessagesMessage>메시지가 없습니다.</NoMessagesMessage>
                    )}
                </MessagesContainer>
                <InputContainer>
                    <ChatInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                    />
                    <SendButton onClick={handleSendMessage}>보내기</SendButton>
                </InputContainer>
            </ChatContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const ChatRoomList = styled.div`
    width: 300px;
    background-color: #1a1a1a;
    color: white;
    height: 100vh;
    overflow-y: auto;
`;

const RoomItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #333;
    background-color: ${({ selected }) => selected ? "#333" : "transparent"};
    cursor: pointer;

    &:hover {
        background-color: #252525;
    }
`;

const RoomName = styled.h4`
    margin: 0;
    font-size: 16px;
`;

const MessageCount = styled.span`
    background-color: #555;
    color: #fff;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #2c2c2c;
    color: white;
`;

const ChatHeader = styled.div`
    padding: 20px;
    border-bottom: 1px solid #333;
`;

const ChatRoomTitle = styled.h3`
    margin: 0;
`;

const ChatUserName = styled.h5`
    margin: 0;
    color: #999;
`;

const MessagesContainer = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
`;

const Message = styled.div`
    margin-bottom: 10px;
    padding: 10px;
    background-color: #e0e0e0;
    border-radius: 10px;
    color: #000;
`;

const NoRoomsMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: #c1c1c1;
`;

const NoMessagesMessage = styled.div`
    padding: 20px;
    text-align: center;
    color: #c1c1c1;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 20px;
    border-top: 1px solid #333;
`;

const ChatInput = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
`;

const SendButton = styled.button`
    padding: 10px 20px;
    background-color: #00affe;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #007bbd;
    }
`;

export default Talk;