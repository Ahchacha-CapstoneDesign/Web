import React, { useState } from 'react';
import styled from 'styled-components';

const PersonReservationDetailsPage = () => {

    const [fee, setFee] = useState('5000원'); // 사용료

    // 체크박스 변경을 다루는 함수
    const [consents, setConsents] = useState({
        personalInfoConsent: false,
        lossOrDamageConsent: false,
        severeDamageConsent: false
    });

    // 체크박스 변경을 다루는 함수
    const handleCheckboxChange = (e) => {
        setConsents({
            ...consents,
            [e.target.name]: e.target.checked
        });
    };

    // 결제하기 버튼 클릭 처리 함수
    const handleSubmit = () => {
        // 모든 체크박스가 체크되었는지 확인
        if (Object.values(consents).every(Boolean)) {
            // 여기에 예약 처리 로직을 구현합니다.
            console.log('예약 처리 로직');
        } else {
            alert('모든 항목의 동의가 필요합니다.');
        }
    };

    const handleGoBack = () => {
        console.log('돌아가기 버튼 클릭');
    };

    return (
        <PageWrapper>
            <TitleBar>
                <BackButton onClick={handleGoBack}>&larr;</BackButton>
                <Title>예약자 확인</Title>
            </TitleBar>
            <FormItem>
                <Label>닉네임</Label>
                <Value>아차차</Value>
            </FormItem>
            <FormItem>
                <Label>전화번호</Label>
                <Value>010-0000-0000</Value>
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
            <CheckboxWrapper>
                <CheckboxLabel>
                    <TextLabel>예약자 본인 정보와 일치하신가요?</TextLabel>
                    <Checkbox
                        type="checkbox"
                        name="personalInfoConsent" // 체크박스 구별을 위한 name 속성 추가
                        checked={consents.personalInfoConsent}
                        onChange={handleCheckboxChange}
                    />
                </CheckboxLabel>
                <CheckboxLabel>
                    <TextLabel>물건을 분실하거나 훼손 상태로 반납 시 보증금을 돌려 받지 못할 수 있습니다. 이에 동의하십니까?</TextLabel>
                    <Checkbox
                        type="checkbox"
                        name="lossOrDamageConsent" // 체크박스 구별을 위한 name 속성 추가
                        checked={consents.lossOrDamageConsent}
                        onChange={handleCheckboxChange}
                    />
                </CheckboxLabel>
                <CheckboxLabel>
                    <TextLabel>훼손 상태가 심각하거나 사용하지 못하는 상태로 반납시 손해 배상이 청구될 수 있습니다. 이에 동의하십니까?</TextLabel>
                    <Checkbox
                        type="checkbox"
                        name="severeDamageConsent" // 체크박스 구별을 위한 name 속성 추가
                        checked={consents.severeDamageConsent}
                        onChange={handleCheckboxChange}
                    />
                </CheckboxLabel>
            </CheckboxWrapper>

            {/* 사용료 및 결제하기 버튼 */}
            <FeeWrapper>
                <FeeLabelValueWrapper>
                    <FeeLabel>결제 금액 </FeeLabel>
                    <FeeValue>{fee}</FeeValue>
                </FeeLabelValueWrapper>
                <ConfirmButton onClick={handleSubmit}>결제하기</ConfirmButton>
            </FeeWrapper>
        </PageWrapper>
    );
};

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

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  color: #00FFE0;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 1rem; // 타이틀과의 간격 조정
`;

// 페이지 제목
const Title = styled.h1`
  color: #fff;
  margin-left: 3.5rem; // 기본 마진 제거
  padding: 0 2rem; // 좌우 패딩
`;

// 폼 아이템을 감싸는 컴포넌트
const FormItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin-left: 18rem;
  width: 60%; // 부모의 전체 너비를 사용하도록 설정
`;

const Label = styled.div`
  color: #fff;
  min-width: 150px; // 레이블 최소 너비 설정
`;

const Value = styled.div`
  color: #00FFE0;
  
  font-weight: bold;
`;

// 체크박스와 관련된 스타일
const CheckboxWrapper = styled.div`
  position: relative; // 가상 요소의 위치 기준점을 설정합니다.
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin: 2rem 0;

  &::before { // 형광색 줄을 위한 가상 요소
    content: ''; // 가상 요소의 내용을 비워둡니다.
    position: absolute; // 페이지 내에서 절대 위치로 설정합니다.
    top: -20px; // 상단에서부터의 거리를 설정합니다.
    left: 0; // 왼쪽 정렬을 위해 0으로 설정합니다.
    width: 100%; // 줄의 너비를 부모 요소의 100%로 설정합니다.
    height: 4px; // 줄의 높이 설정
    background-color: #00FFE0; // 형광색 색상 코드
  }
`;


const CheckboxLabel = styled.label`
  display: flex;
  justify-content: space-between; // 내용을 양 끝으로 분산시킴
  align-items: center;
  width: 100%; // 부모의 전체 너비를 차지하도록 설정
  color: #fff;
  margin-bottom: 0.5rem; // 필요에 따라 조정
  cursor: pointer;
`;

const TextLabel = styled.span`
  flex: 1; // 체크박스와 텍스트 사이의 간격을 유지하기 위해
  font-weight: bold;
  margin-left:9rem;
  text-align: left; // 텍스트를 왼쪽 정렬
`;


const Checkbox = styled.input`
  margin-right: 1rem; // 체크박스와 텍스트 사이 간격
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
  margin-bottom: -1rem; 
`;

const FeeLabel = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1.5rem;
`;

const FeeValue = styled.span`
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
`;


const ConfirmButton = styled.button`
  background-color: #00FFE0;
  color: #000;
  border: none;
  border-radius: 20px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-end; // 버튼을 오른쪽으로 정렬
  width:15%;
  margin-top: 2rem; // 여백 조정
  margin-right: 24rem;
`;

// 이제 모든 스타일 컴포넌트가 왼쪽으로 정렬되어 표시됩니다.


export default PersonReservationDetailsPage;
