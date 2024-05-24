import React, {useState, useEffect, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import axios from 'axios';
import apiClient from "../../path/apiClient";

import './Chat.css';
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Chat = (props) => {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [greetings, setGreetings] = useState([]);
    const [itemId, setItemId] = useState(props.itemId);
    const [studyTitle, setStudyTitle] = useState(props.studyTitle);
    const [progressStatus, setProgressStatus] = useState(props.progressStatus);
    const [pendingEnter, setPendingEnter] = useState(false); 
    const LogNickname = localStorage.getItem("userNickname");

    const stompClient = useRef(null);

    const messageEndRef = useRef(null);

    useEffect(() => {
        stompClient.current = new Client({
            brokerURL: 'ws://localhost:8080/gs-guide-websocket',
            reconnectDelay: 5000,
            onConnect: onConnect,
            onWebSocketError: onWebSocketError,
            onStompError: onStompError
        });

        const connect = async () => {
            try {
                await stompClient.current.activate();
                setConnected(true);
                subscribeToChatRoom(itemId);
                fetchChatHistory();
            } catch (error) {
                console.error('Failed to connect:', error);
            }
        };

        connect();

        return () => {
            sendExitMessage();
        };
    }, [itemId]);

    useEffect(() => {
        scrollChatToBottom();
    }, [greetings]);

    const scrollChatToBottom = () => {
        const chatBox = document.querySelector('.chattingbox');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    const subscribeToChatRoom = (itemId) => {
        if (stompClient.current.connected) {
            stompClient.current.subscribe(`/topic/greetings/${itemId}`, (greeting) => {
                showGreeting(JSON.parse(greeting.body));
            });
        }
    };

    const fetchChatHistory = async () => {
        let url = `/chat/history/${itemId}`;
        try {
            const response = await apiClient.get(url, { withCredentials: true });
            setGreetings(response.data);

            if (stompClient.current.connected) {
                sendEnterMessage();
            } else {
                setPendingEnter(true);
                console.error('STOMP connection not active. Cannot send enter message.');
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const onConnect = (isActive) => {
        setConnected(isActive);
        if (isActive) {
            subscribeToChatRoom(itemId);
            fetchChatHistory();

            if (pendingEnter) {
                sendEnterMessage();
                setPendingEnter(false);
            }
        }
    };

    const onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    const onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    const sendExitMessage = () => {
        if (stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app/exit/${itemId}`,
                body: JSON.stringify({ type: 'GREETING', itemId: itemId }),
            });
        }
        disconnect();
    };

    const disconnect = () => {
        stompClient.current.deactivate();
        setConnected(false);
        console.log('Disconnected');
    };

    const sendEnterMessage = () => {
        stompClient.current.publish({
            destination: `/app/enter/${itemId}`,
            body: JSON.stringify({ type: 'GREETING', itemId: itemId }),
        });
    };

    const sendMessage = () => {
        if (message.length === 0) {
            if (progressStatus === 'DISCONTINUE') {
                alert('중단된 스터디는 채팅이 불가능합니다.');
            } else {
                alert('메시지를 입력하세요.');
            }
        } else {
            stompClient.current.publish({
                destination: `/app/chat/${itemId}`,
                body: JSON.stringify({ type: 'TALK', itemId: itemId, message: `${message}` }),
            });
            scrollChatToBottom();
            setMessage('');
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const showGreeting = (message) => {
        setGreetings((prevGreetings) => [...prevGreetings, message]);
    };

    const formatDatetime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className={"chat_wrap"}>
            <div className={"studyTitle"}>
                <h2>{studyTitle}</h2><br/><br/>
            </div>
            <div className={"chattingbox"}>
                <table className={"chatting"}>
                    <thead id={"message-thead"}>
                    <tr>
                        <th>Messages</th>
                    </tr>
                    </thead>
                    <tbody id={"message"}>
                    {greetings.map((greeting, index) => (
                        <tr key={index}>
                            {greeting.type === 'GREETING' ? (
                                <td className={"message-detail"} id={"greet"}>
                                    <span>{greeting.message}</span>
                                </td>
                            ) : (
                                greeting.member.nickname === LogNickname ? (
                                    <td className={"message-detail"} id={"my-chats"}>
                                        <span>
                                            {greeting.member ? greeting.member.nickname : 'Unknown'}: {greeting.message}
                                            <br/><p id={"entry-time"}>[{formatDatetime(greeting.createdAt)}]</p>
                                        </span>
                                    </td>
                                ) : (
                                    <td className={"message-detail"} id={"other-chats"}>
                                        <span>
                                            {greeting.member ? greeting.member.nickname : 'Unknown'}: {greeting.message} [
                                            <br/><p id={"entry-time"}>{formatDatetime(greeting.createdAt)}]</p>
                                        </span>
                                    </td>
                                )
                            )}
                        </tr>
                    ))}
                    <tr>
                        <td ref={messageEndRef}></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={"input_chat"}>
                <label>채팅 보내기</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="내용을 입력하세요"
                    disabled={progressStatus === 'DISCONTINUE'}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
