import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import apiClient from "../../path/apiClient";
import { createGlobalStyle } from 'styled-components';
import PhotoModal from "../PhotoModal";
import ConfirmModal from "../ConfirmModal";

const ManageOfficialAccount = () => {
    const [submissions, setSubmissions] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await apiClient.get('/authentication/allAuthentication');
            if (response.status === 200) {
                setSubmissions(response.data.content); // 페이지 객체 내부의 content 필드 사용
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleApproval = async (userId, approve) => {
        const authenticationValue = approve ? 'CANOFFICIAL' : 'NONE';  // 서버의 AuthenticationValue 열거형 값 사용
        try {
            const response = await apiClient.post(`/authentication/updateAuthenticationValue/${userId}`, null, {
                params: {
                    authenticationValue
                }
            });
            if (response.status === 200) {
                fetchSubmissions();
                setConfirmMessage('승인 처리되었습니다.');
                setShowConfirmModal(true);
            }
        } catch (error) {
            console.error('상태 업데이트 실패:', error);
            alert('상태 업데이트에 실패했습니다.');
        }
    };

    const viewImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    return (
        <>
            <GlobalStyle />
            <Container>
            <Title>
                학생회 / 과사무실 근로장학생 인증 신청내역
            </Title>
                <ItemLabels>
                    <NameLabel>이름</NameLabel>
                    <OfficialLabel>소속</OfficialLabel>
                    <TrackLabel>1트랙</TrackLabel>
                    <GradeLabel>학년</GradeLabel>
                    <StatusLabel>재학여부</StatusLabel>
                </ItemLabels>
                <SubmissionList>
                    {submissions.map(submission => (
                        <Submission key={submission.id}>
                            <Name onClick={() => viewImage(submission.authenticationImageUrls[0])}>
                                {submission.name}(이미지 확인)
                            </Name>    
                            <OfficialName>{submission.officialName}</OfficialName>
                            <Track1>{submission.track1}</Track1>
                            <Grade>{submission.grade}</Grade>
                            <Status>{submission.status}</Status>
                            <ApproveButton onClick={() => handleApproval(submission.userId, true)} disabled={submission.isCheck}>
                                {submission.isCheck ? '완료' : '승인'}
                            </ApproveButton>                       
                         </Submission>
                    ))}
                </SubmissionList>
                {showModal && (
                    <PhotoModal
                        image={selectedImage}
                        onClose={() => setShowModal(false)}
                    />
                )}
                {showConfirmModal && (
                    <ConfirmModal
                        message={confirmMessage}
                        isOpen={showConfirmModal}
                        setIsOpen={setShowConfirmModal}
                        onConfirm={() => setShowConfirmModal(false)}
                    />
                )}
            </Container>
        </>
    );
};

export default ManageOfficialAccount;

export const GlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
  }

  /* 스크롤바 전체 스타일 */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  /* 스크롤바 트랙(바탕) 스타일 */
  ::-webkit-scrollbar-track {
    background: transparent; /* 트랙의 배경색 */
  }

  /* 스크롤바 핸들(움직이는 부분) 스타일 */
  ::-webkit-scrollbar-thumb {
    background: #00FFE0; /* 핸들의 배경색 */
    border-radius: 5px;
  }
`;

const Title = styled.div`
    font-family: "Pretendard";
    color: white;
    font-weight: 500;
    font-size: 1.5rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 35rem;
    padding: 20px;
    font-family: "Pretendard";
`;

const SubmissionList = styled.div`
    margin-top: 20px;
`;

const Submission = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const Name = styled.div`
    color: #00ffe0;
    width: 10rem;
    cursor: pointer;
    font-weight:400;
`;

const OfficialName = styled.div`
    color: white;
    margin-left:1rem;
    width: 8rem;
`;

const Track1 = styled.div`
    color: white;
    margin-left:1rem;
    width: 12rem;
`;
const Grade = styled.div`
    color: white;
    margin-left:1rem;
    width: 3rem;
`;

const Status = styled.div`
    color: white;
    margin-left:1rem;
    width: 3rem;
`;

const ApproveButton = styled.button`
  margin-left: 1.5rem;
  cursor: pointer;
  background-color: transparent;
  color: #00ffe0;
  border: 1px solid #00ffe0;
  border-radius: 5px;
`;

const ItemLabels = styled.div`
  display: flex;
  padding: 0.5rem 2rem;
  color: white;
  font-family: pretendard;
  font-size: 1rem;
  width: 40rem;
  background-color: transparent;  // 라벨 배경색 설정
  border-top: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
  margin-top: 2rem;
  margin-bottoM: 1rem;
`;

const NameLabel = styled.div`
    width: 5rem;
    margin-left: 1rem;
`;

const OfficialLabel = styled.div`
    width: 10rem;
    margin-left: 6rem;
`;

const TrackLabel = styled.div`
    width: 9rem;
    margin-left: 2rem;
`;

const GradeLabel = styled.div`
    margin-left: 0.5rem;
    width: 3rem;
`;

const StatusLabel = styled.div`
    width: 6.5rem;
`;

