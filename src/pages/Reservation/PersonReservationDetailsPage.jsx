import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';
import apiClient from '../../path/apiClient';


const PersonReservationDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userNickname, setUserNickname] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [reservationDetails, setReservationDetails] = useState(location.state || {});

    useEffect(() => {
      const nickname = localStorage.getItem('userNickname');
      setUserNickname(nickname);
      const phonenum = localStorage.getItem('userPhoneNumber');
      setUserPhoneNumber(phonenum);
    });

    useEffect(() => {
      const reservationData = location.state;
      if (reservationData) {
          setReservationDetails(reservationData);
      }
  }, [location.state]);


    // 체크박스 변경을 다루는 함수
    const [consents, setConsents] = useState({
        personalInfoConsent: false,
        severeDamageConsent: false
    });


    const handleImageClick = (consentName) => {
        const newConsentValue = !consents[consentName];
        setConsents({
            ...consents,
            [consentName]: newConsentValue
        });
    };

    const handleGoBack = () => {
      console.log('돌아가기 버튼 클릭');
      navigate(-1);
    };
    

    // 결제하기 버튼 클릭 처리 함수
    const handleSubmit = async () => {
      if (!consents.personalInfoConsent || !consents.severeDamageConsent) {
          alert('모든 동의 항목에 체크해야 예약이 가능합니다.');
          return;
      }

      try {
          await apiClient.post('/reservation/person', {
              ...reservationDetails,
              consents
          });
          alert('예약이 성공적으로 완료되었습니다.');
          console.log(reservationDetails);
          navigate('/mypage/rentinglist'); 
      } catch (error) {
          console.error('예약 실패:', error);
          alert('예약에 실패했습니다. 다시 시도해주세요.');
      }
    };

    const formatPhoneNumber = (phoneNumber) => {
      // 전화번호가 11자리인 경우 010-0000-0000 형식으로 변환
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    const formatDate = (date, hour, minute) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${hour}시 ${minute}분`;
    };
    const formatServerDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
    };

    return (
        <>
            <GlobalStyle/>
        <PageWrapper>
            <TitleBar>
                <BackButton src="/assets/img/BackArrow.png" alt="Back" onClick={handleGoBack} />
                <Title>예약자 확인</Title>
            </TitleBar>
            <FormItem>
                <Label>닉네임</Label>
                <Value>{userNickname}</Value>
            </FormItem>
            <FormItem>
                <Label>전화번호</Label>
                <Value>{formatPhoneNumber(userPhoneNumber)}</Value>
            </FormItem>
            <FormItem>
                <Label>대여 시간</Label>
                <Value>{formatDate(reservationDetails.startDate, reservationDetails.startTime, reservationDetails.startMinutes)}</Value>
            </FormItem>
            <FormItem>
                <Label>반납 시간</Label>
                <Value>{formatDate(reservationDetails.endDate, reservationDetails.endTime, reservationDetails.endMinutes)}</Value>
            </FormItem>
            <FormItem>
                <Label>대여 위치</Label>
                <Value>{reservationDetails.borrowPlace}</Value>
            </FormItem>
            <FormItem>
                <Label>반납 위치</Label>
                <Value>{reservationDetails.returnPlace}</Value>
            </FormItem>
            <Line/>
                <CheckboxLabel>
                    <TextLabel>예약자 본인 정보와 일치하신가요?</TextLabel>
                    <Image src={consents.personalInfoConsent ? '/assets/img/Check.PNG' : '/assets/img/unChecked.PNG'}
                           alt="Personal Info Consent"
                           onClick={() => handleImageClick('personalInfoConsent')} />
                </CheckboxLabel>
                <CheckboxLabel>
                    <TextLabel>훼손 상태가 심각하거나 사용하지 못하는 상태로 반납시 손해 배상이 청구될 수 있습니다. 이에 동의하십니까?</TextLabel>
                    <Image src={consents.severeDamageConsent ? '/assets/img/Check.PNG' : '/assets/img/unChecked.PNG'}
                           alt="Severe Damage Consent"
                           onClick={() => handleImageClick('severeDamageConsent')} />
                </CheckboxLabel>


            {/* 사용료 및 결제하기 버튼 */}
            <FeeWrapper>
                <FeeLabelValueWrapper>
                    <FeeLabel>결제 금액 </FeeLabel>
                    <Value>{reservationDetails.totalFee}</Value>
                </FeeLabelValueWrapper>
                <ConfirmButton onClick={handleSubmit} >결제하기</ConfirmButton>
            </FeeWrapper>
        </PageWrapper>
            </>
    );
};

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%; 
    margin: 0;
    padding: 0;
    justify-content: center;
    color: #fff;
    background-color: #000; // body 전체의 배경색을 검은색으로 설정
    font-family: "Pretendard";
  }

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

// 전체 페이지를 감싸는 컴포넌트
const PageWrapper = styled.div`
  background-color: #000;
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column; 
  align-items: center; 
  height: 100vh;
  font-family: 'Pretendard', sans-serif;
  
`;

// 제목을 감싸는 컴포넌트, 여기에 돌아가기 버튼도 포함
const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  width: 60%; // 전체 너비 사용
`;

const BackButton = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin-right:5.66rem;
`;

// 페이지 제목
const Title = styled.h1`
  color: #fff;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

const Line = styled.span`
  display: block; // span은 기본적으로 inline 요소이므로, 너비와 높이를 적용하기 위해 block으로 변경
  width: 70.125rem; // 줄의 너비
  height: 0.2rem; // 줄의 높이
  margin-left:2rem;
  margin-top: 2.81rem;
  margin-bottom: 1.87rem;
  background-color: #00FFE0; // 형광색 배경색 설정
`;
// 폼 아이템을 감싸는 컴포넌트
const FormItem = styled.div`
  display: flex;
  width: 34.125rem;
  height: 2.875rem;
  margin-top: 1.12rem;
  margin-right: 25rem;
 
`;

const Label = styled.div`
  color: #fff;
  width: 8rem;
  height: 1.875rem;
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right:4.13rem;
`;

const Value = styled.div`
  color: #00FFE0;
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const CheckboxLabel = styled.label`
  width: 100%;
  height: 1.875rem;
  display: flex;
  margin-bottom: 1.44rem;
`;

const TextLabel = styled.span`
  width: 65.0625rem;
  height: 1.875rem;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 26rem;
  text-align: left; // 텍스트를 왼쪽 정렬
`;

const Image = styled.img`
  width: 1.875rem;
  height: 1.875rem;
`;


// 사용료 및 결제하기 버튼을 감싸는 컴포넌트
const FeeWrapper = styled.div`
  display: flex;
  flex-direction: column; // 요소들을 수직으로 쌓음
  align-items: flex-end; // 요소들을 오른쪽으로 정렬
  width: 100%; // 전체 너비 사용
  margin-top: 2rem; // 상단 여백 조정
`;

const FeeLabelValueWrapper = styled.div`
  display: flex;
  justify-content: center; // 금액 레이블과 값을 오른쪽으로 정렬
  width: 60%; // 전체 너비 사용
  margin-top:5rem;
  margin-bottom: -1rem;
  margin-right:-2rem;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  
`;

const FeeLabel = styled.span`
  color: #fff;
  margin-right: 1.5rem;
`;

const FeeValue = styled.span`
  color: #fff;
  font-weight: bold;
`;


const ConfirmButton = styled.button`
  background-color: #00FFE0;
  color: #000;
  border: none;
  border-radius: 20px;
  text-align: center;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  cursor: pointer;
  align-self: flex-end; // 버튼을 오른쪽으로 정렬
  width: 19.125rem;
  height: 3.0625rem;
  margin-top: 2rem; // 여백 조정
  margin-right: 21.5rem;
`;

// 이제 모든 스타일 컴포넌트가 왼쪽으로 정렬되어 표시됩니다.


export default PersonReservationDetailsPage;