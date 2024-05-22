import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import apiClient from "../../../path/apiClient";
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "../../ConfirmModal";


// 가정: 사용자 정보는 서버에서 가져온 후 state에 저장합니다.
const AccountSettings = () => {
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [profileImage, setProfileImage] = useState('/assets/img/Profile.png');
    const [userTrack, setUserTrack] = useState('');
    const [userTrack2, setUserTrack2] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userGrade, setUserGrade] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const [userID, setUserID] = useState('');
    const [newNickname, setNewNickname] = useState(userNickname);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successModalMessage, setSuccessModalMessage] = useState('');
    const [officialName, setOfficialName] = useState('');
    const [officialFile, setOfficialFile] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const DEFAULT_IMAGE_URL = '/assets/img/Profile.png';

    const [isCheck, setIsCheck] = useState(null);  // 인증 상태를 null로 초기화
    const [authenticationChecked, setAuthenticationChecked] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem('userName');
        setUserName(name);
        const nickname = localStorage.getItem('userNickname');
        setUserNickname(nickname);
        const phonenum = localStorage.getItem('userPhoneNumber');
        setUserPhoneNumber(phonenum);
        const track1 = localStorage.getItem('userTrack');
        setUserTrack(track1);
        const track2 = localStorage.getItem('userTrack2');
        setUserTrack2(track2);
        const grade = localStorage.getItem('userGrade');
        setUserGrade(grade);
        const status = localStorage.getItem('userStatus');
        setUserStatus(status);
        const id = localStorage.getItem('userID');
        setUserID(id);
        const savedImageUrl = localStorage.getItem('profileImageUrl');
        if (savedImageUrl) {
            setProfileImage(savedImageUrl); // 저장된 이미지 URL로 상태 업데이트
        }

        setNewNickname(localStorage.getItem('userNickname') || '');

        checkAuthenticationStatus();

      }, [userNickname]);

      const handleNicknameChange = (e) => {
        const input = e.target.value;
        const containsSpecialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\s]/.test(input);
        // 닉네임 길이와 특수문자를 검사하는 조건
        if (!containsSpecialChars && input.length <= 8) {
            setNewNickname(input);
            setErrorMessage('');
          } else if (input.length > 8) {
            setSuccessMessage('');
            setErrorMessage('아차! 8글자를 넘어버렸습니다.');
          } else {
            setSuccessMessage('');
            setErrorMessage('아차! 특수 문자와 띄어쓰기는 사용할 수 없습니다.');
          }
      };
    
      // 닉네임을 서버에 저장하는 함수
      const handleSetNickname = async () => {
        if (!newNickname.trim()) {
            setSuccessMessage('');
            setErrorMessage('아차! 닉네임을 입력해주세요!');
            return;
        }
    
        try {
          const response = await apiClient.post('/users/nickname', { nickname: newNickname }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          if (response.status === 200) {
            localStorage.setItem('userNickname', newNickname);
            setUserNickname(newNickname); // State 업데이트
            setErrorMessage('');
            setSuccessMessage('성공적으로 변경되었습니다!');
            navigate('/mypage/accountsettings'); // 사용자를 프로필 페이지로 리다이렉트
          }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // 서버에서 반환한 에러 메시지를 사용자에게 표시
                setSuccessMessage('');
                setErrorMessage("아차! 사용 중인 닉네임입니다.");
              } else {
                // 그 외 오류에 대한 일반적인 에러 메시지
                setSuccessMessage('');
                setErrorMessage("닉네임 설정 중 에러가 발생했습니다.");
              }
              console.error("닉네임 설정 실패:", error);
            }
      };

    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/users/default-profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const imageUrl = response.data; // 서버로부터 받은 이미지 URL
        localStorage.setItem('profileImageUrl', imageUrl); // localStorage에 이미지 URL 저장
        setProfileImage(imageUrl); // 상태 업데이트로 UI에 반영
        setShowSuccessModal(true); 
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    const resetToDefaultImage = async () => {
      try {
        // 서버로 POST 요청을 보냅니다.
        await apiClient.post('/users/reset-profile');
        localStorage.removeItem('profileImageUrl'); // 로컬 스토리지에서 이미지 URL 삭제
        setProfileImage(DEFAULT_IMAGE_URL); // 상태 업데이트로 기본 이미지 사용
        setShowSuccessModal(true); // 성공 모달을 표시
      } catch (error) {
        console.error('기본 이미지로 재설정 실패:', error);
        alert('기본 이미지로 재설정하는 동안 오류가 발생했습니다.');
      }
    };

    const formatPhoneNumber = (phoneNumber) => {
      // 전화번호가 11자리인 경우 010-0000-0000 형식으로 변환
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    const handleModalClose = () => {
      setShowSuccessModal(false);
    }

    const handleOfficialNameChange = (e) => {
      setOfficialName(e.target.value);
    };

    // 파일 선택 처리
    const handleFileChange = (e) => {
      setOfficialFile(e.target.files[0]);
    };

    // 인증 정보 제출
    const handleSubmitOfficialInfo = async () => {
      const formData = new FormData();
      formData.append('officialName', officialName);
      if (officialFile) {
        formData.append('file', officialFile);
      }

      try {
        const response = await apiClient.post('/authentication', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          alert('인증 정보가 성공적으로 제출되었습니다.');
        }
      } catch (error) {
        console.error('인증 정보 제출 실패:', error);
        alert('인증 정보 제출에 실패했습니다.');
      }
    };

    const checkAuthenticationStatus = async () => {
      try {
          const response = await apiClient.get('/authentication/status');
          setIsCheck(response.data);
          setAuthenticationChecked(true);  // 인증 상태가 확인되었음
      } catch (error) {
          console.error('인증 상태 확인 실패:', error);
      }
    };

    return (
        <>
        <GlobalStyle /> 
            <AccountContainer>
            <ProfileSection>
              <ProfilePicture src={profileImage} alt="Profile" />
              <input
                type="file"
                onChange={(e) => uploadImage(e.target.files[0])}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <NameAndButton>
                  <NameAndNickname>
                      <UserName>{userName}</UserName>
                      <UserNickname>{userNickname}</UserNickname>
                  </NameAndNickname>
                  <EditButton onClick={() => fileInputRef.current.click()}>이미지 변경</EditButton>
                  <BasicEditButton onClick={resetToDefaultImage}>기본이미지 변경</BasicEditButton>
              </NameAndButton>
            </ProfileSection>
            <Divider />
            <DetailsSection>
                <Title>프로필 정보</Title>
                <DetailItem>
                    <Label>이름</Label>
                    <Value>{userName}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>닉네임</Label>
                    <NicknameButtonContainer>
                        <NicknameInput
                            value={newNickname}
                            onChange={handleNicknameChange}
                        />
                        <NicknameEditButton onClick={handleSetNickname}>변경</NicknameEditButton>
                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                    </NicknameButtonContainer>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>전화번호</Label>
                    <Value>{formatPhoneNumber(userPhoneNumber)}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>학번</Label>
                    <Value>{userID}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>학년</Label>
                    <Value>{userGrade}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>트랙</Label>
                    <Value>{userTrack}  /  {userTrack2}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>재학여부</Label>
                    <Value>{userStatus}</Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>소속 학생회 혹은 과사무실 근로장학생</Label>
                    <Value>
                      <NicknameInput type="text" value={officialName} onChange={handleOfficialNameChange} placeholder="소속 이름 입력" />
                    </Value>
                </DetailItem>
                <DetailDivider />
                <DetailItem>
                    <Label>소속학생회 혹은 학생회 인증 사진 제출</Label>
                    <SubmitValue>
                      <input type="file" onChange={handleFileChange} />
                      <NicknameEditButton onClick={handleSubmitOfficialInfo}>제출</NicknameEditButton>
                      {authenticationChecked && isCheck === false && (
                        <Message>승인 대기중입니다.</Message>
                      )}
                      {authenticationChecked && isCheck === true && (
                          <Message>승인 완료되었습니다! 로그인이 가능합니다.</Message>
                      )}
                    </SubmitValue>
                </DetailItem>
                
                <DetailDivider />
            </DetailsSection>
          </AccountContainer>
          {showSuccessModal && (
                <ConfirmModal
                    message="이미지 변경이 완료되었습니다!"
                    isOpen={showSuccessModal}
                    setIsOpen={setShowSuccessModal}
                    onConfirm={handleModalClose}
                />
          )}
        </>
    );
};

export default AccountSettings;

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

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 35rem;
  padding: 20px;
  font-family: "Pretendard";
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  margin-right: 20px;
  border-radius: 50%;
`;

const NameAndButton = styled.div` 
  margin-left: 1rem;
  flex-direction:column;
`;

const NameAndNickname = styled.div`
    display: flex;
    align-items: flex-end;
`;

const UserName = styled.div`
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    color: #fff;
`;

const UserNickname = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #E0E0E0;
  margin-left: 1rem;
  margin-bottom: 0.1rem;
`;

const EditButton = styled.button`
    width: 5.25rem;
    height: 2.0625rem;
    background-color: #000;
    color: #DEDEDE;
    border-radius: 0.625rem;
    border: 0.5px solid #DEDEDE;
    cursor: pointer;
    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 500;
    color: #DEDEDE;
    font-family: "Pretendard";
    margin-top: 0.8rem;
    margin-right: 1rem;
`;

const BasicEditButton = styled.button`
    width: 7rem;
    height: 2.0625rem;
    background-color: #000;
    color: #DEDEDE;
    border-radius: 0.625rem;
    border: 0.5px solid #DEDEDE;
    cursor: pointer;
    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 500;
    color: #DEDEDE;
    font-family: "Pretendard";
    margin-top: 0.8rem;
    margin-right: 1rem;
`;

const DetailsSection = styled.section`
  justify-content: center;
`;

const Title = styled.div` 
    color: #fff;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    margin-bottom: 2rem;
    margin-top: 2.44rem;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: column;
`;

const Label = styled.div`
    color: #939393;
    margin-bottom: 0.62rem;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
`;

const Value = styled.div`
    color: #fff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 0.5rem;
`;


const SubmitValue = styled.div`
    color: #fff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const NicknameInput= styled.input`
    color: #fff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 0.5rem;
    background-color: transparent;
    border: 1px solid #00ffe0;
    border-radius: 5px;
    outline: none;
 `;

const Divider = styled.hr`
  border: none;
  height: 0.0625rem;
  background-color: #333; // 테마에 맞게 구분선 색상 조정
  width: 80%;
  margin-left: 0;
`;

const DetailDivider = styled.hr`
  border: none;
  height: 0.0625rem;
  background-color: #333; // 테마에 맞게 구분선 색상 조정
  width: 40%;
  margin-left: 0;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const NicknameEditButton = styled.button`
    width: 3rem;
    height: 2.0625rem;
    background-color: #000;
    color: #DEDEDE;
    border-radius: 0.625rem;
    border: 0.5px solid #DEDEDE;
    cursor: pointer;
    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 500;
    color: #DEDEDE;
    font-family: "Pretendard";
    margin-left: 14rem;
`;

const NicknameButtonContainer = styled.div`
    display: flex;
    align-items: flex-end;
`;

const ErrorMessage = styled.div`
  color: #F00;
  font-family: "Pretendard";
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 800;
  position: absolute; 
  margin-left: 28.5rem;
`;  

const SuccessMessage = styled.div`
  color: #00FF00;;
  font-family: "Pretendard";
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 800;
  position: absolute; 
  margin-left: 28.5rem;
`;  

const Message = styled.div`
  color: #00FF00;;
  font-family: "Pretendard";
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 800;
  margin-left: 2rem;
`;  