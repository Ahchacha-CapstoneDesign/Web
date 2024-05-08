import React, {useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components';
import {useNavigate} from 'react-router-dom';


const PersonReservationDetailsPage = () => {

    const [fee, setFee] = useState('5000원'); // 사용료
    const [imageUrl, setImageUrl] = useState('/assets/img/unChecked.PNG');
    const navigate = useNavigate();


    // 체크박스 변경을 다루는 함수
    const [consents, setConsents] = useState({
        personalInfoConsent: false,
        placeTimeConsent: false
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
    const handleSubmit = () => {
        if (consents.personalInfoConsent && consents.placeTimeConsent) {
            console.log('예약 처리 로직');
        } else {
            alert('모든 항목의 동의가 필요합니다.');
        }
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
                <Label>이름</Label>
                <Value>김동욱</Value>
            </FormItem>
            <FormItem>
                <Label>학번</Label>
                <Value>1971047</Value>
            </FormItem>
            <FormItem>
                <Label>트랙</Label>
                <Value>모바일소프트웨어</Value>
            </FormItem>
            <FormItem>
                <Label>재학 상태</Label>
                <Value>4학년 재학중</Value>
            </FormItem>
            <FormItem>
                <Label>전화번호</Label>
                <Value>010-8814-8935</Value>
            </FormItem>
            <FormItem>
                <Label>대여 시간</Label>
                <Value>2024.02.29 20시 00분</Value>
            </FormItem>
            <FormItem>
                <Label>반납 시간</Label>
                <Value>2024.02.29 20시 00분</Value>
            </FormItem>
            <FormItem>
                <Label>대여 위치</Label>
                <Value>상상관 1층</Value>
            </FormItem>
            <FormItem>
                <Label>반납 위치</Label>
                <Value>상상관 1층</Value>
            </FormItem>
            <Line/>
            <CheckboxLabel>
                <TextLabel>예약자 본인 정보와 일치하신가요?</TextLabel>
                <Image src={consents.personalInfoConsent ? '/assets/img/Check.PNG' : '/assets/img/unChecked.PNG'}
                       alt="Personal Info Consent"
                       onClick={() => handleImageClick('personalInfoConsent')} />
            </CheckboxLabel>
            <CheckboxLabel>
                <TextLabel>대여 및 반납 위치와 시간을 확인하셨나요?</TextLabel>
                <Image src={consents.placeTimeConsent ? '/assets/img/Check.PNG' : '/assets/img/unChecked.PNG'}
                       alt="Place Time Consent"
                       onClick={() => handleImageClick('placeTimeConsent')} />
            </CheckboxLabel>

                <ConfirmButton onClick={handleSubmit} >예약하기</ConfirmButton>

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
  width: 3.0625rem;
  height: 3.0625rem;
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
  margin-top: 0.5rem;
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
