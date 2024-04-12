import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled, { createGlobalStyle } from 'styled-components';
import {HeaderContainer} from "../Header";
import { differenceInMinutes } from 'date-fns';

const hourOptions = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const minuteOptions = ['00', '30'];

const OfficialReservationPage = () => {
    const [startTime, setStartTime] = useState(hourOptions[0]); // 시작 시간 상태
    const [startMinutes, setStartMinutes] = useState(minuteOptions[0]); // 시작 분 상태
    const [endTime, setEndTime] = useState(hourOptions[0]); // 종료 시간 상태
    const [endMinutes, setEndMinutes] = useState(minuteOptions[0]); // 종료 분 상태
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6; // 0 = 일요일, 6 = 토요일
    };

    const handleDateChange = (dates) => {
        setDateRange(dates)
    };

    const calculateTotalTime = () => {
        if (!endDate) return null;
        const start = new Date(startDate.setHours(parseInt(startTime, 10), parseInt(startMinutes, 10)));
        const end = new Date(endDate.setHours(parseInt(endTime, 10), parseInt(endMinutes, 10)));
        const diffMinutes = differenceInMinutes(end, start);

        // 음수인 경우 (대여 시간이 반납 시간보다 늦은 경우) 처리
        if (diffMinutes < 0) {
            return null; // 혹은 '시간 선택이 잘못되었습니다.'와 같은 메시지를 반환할 수 있습니다.
        }

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}`;
    };

    const totalTime = calculateTotalTime();

    const formatDate = (date, hour, minute) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${hour}시 ${minute}분`;
    };
    const CustomHeader = ({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
        return (
            <HeaderContainer>
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
                {/* 연도와 월을 나타내는 부분 */}
                <CurrentDate>{`${date.getFullYear()}.${('0' + (date.getMonth() + 1)).slice(-2)}`}</CurrentDate>
                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>{">"}</button>
            </HeaderContainer>
        );
    };
    return (
        <>
            <GlobalStyle/>
            <PageLayout>
                <ContentContainer>
                    <LeftColumn>
                        <DateSection>
                            <DateLabel>날짜 선택</DateLabel>
                            <RentalNotice>(주말불가능)</RentalNotice>
                        </DateSection>
                        <StyledDatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            inline
                            locale= "ko"
                            filterDate={isWeekday}
                            renderCustomHeader={({
                                                     date,
                                                     changeYear,
                                                     changeMonth,
                                                     decreaseMonth,
                                                     increaseMonth,
                                                     prevMonthButtonDisabled,
                                                     nextMonthButtonDisabled,
                                                 }) => (
                                <CustomHeader
                                    date={date}
                                    changeYear={changeYear}
                                    changeMonth={changeMonth}
                                    decreaseMonth={decreaseMonth}
                                    increaseMonth={increaseMonth}
                                    prevMonthButtonDisabled={prevMonthButtonDisabled}
                                    nextMonthButtonDisabled={nextMonthButtonDisabled}
                                />
                            )}/>
                    </LeftColumn>
                    <RightColumn>
                        <TimeSectionContainer>
                            <TimeSection>
                                <TimeLabel htmlFor="time-select">시간 선택</TimeLabel>
                                <RentalNotice>(09:00 ~ 17:30)</RentalNotice>
                            </TimeSection>
                            <TimeSelectWrapper>
                                <TimeBlockWrapper>
                                    <TimeOption>대여 </TimeOption>
                                    <TimeSelect id="time-start-hour-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                                        {hourOptions.map(hour => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </TimeSelect><TimeOption> 시 </TimeOption>
                                    <TimeSelect id="time-start-minute-select" value={startMinutes} onChange={(e) => setStartMinutes(e.target.value)}>
                                        {minuteOptions.map(minute => (
                                            <option key={minute} value={minute}>{minute}</option>
                                        ))}
                                    </TimeSelect> <TimeOption> 분</TimeOption>
                                </TimeBlockWrapper>
                                <TimeBlockWrapper>
                                    <TimeOption>반납 </TimeOption>
                                    <TimeSelect id="time-end-hour-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                                        {hourOptions.map(hour => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </TimeSelect><TimeOption> 시 </TimeOption>
                                    <TimeSelect id="time-end-minute-select" value={endMinutes} onChange={(e) => setEndMinutes(e.target.value)}>
                                        {minuteOptions.map(minute => (
                                            <option key={minute} value={minute}>{minute}</option>
                                        ))}
                                    </TimeSelect> <TimeOption> 분 </TimeOption>
                                </TimeBlockWrapper>
                            </TimeSelectWrapper>
                        </TimeSectionContainer>
                        <StartDateTimeDisplay>
                            {startDate && <span>대여 {formatDate(startDate, startTime, startMinutes)}</span>}
                            <br/>
                        </StartDateTimeDisplay>
                        <EndDateTimeDisplay>
                            {endDate && <span> ~ 반납 {formatDate(endDate, endTime, endMinutes)}</span>}
                        </EndDateTimeDisplay>

                        <ConfirmButton>예약하기</ConfirmButton>
                    </RightColumn>
                </ContentContainer>
            </PageLayout>
        </>
    );
};

const StyledDatePicker = styled(DatePicker)`
  .react-datepicker {
    border: none;

    // 달력 컨테이너의 배경색을 검은색으로 설정합니다.
    &__month-container {
      background-color: #000;
    }

    // 달력의 헤더 부분의 배경색과 글자색을 설정합니다.
    &__header {
      background-color: #000;
      color: #fff;
      border-bottom: 1px solid #333;
    }

    // 날짜 부분의 글자색을 설정합니다.
    &__day, &__day-name {
      color: #fff;
    }

    // 오늘 날짜를 표시하는 스타일을 설정합니다.
    &__day--today {
      background-color: #555;
    }

    // 선택된 날짜의 스타일을 설정합니다.
    &__day--selected {
      background-color: #6f42c1; // 선택된 날짜의 배경색을 보라색으로 설정
      border-radius: 0.3rem;
    }

    // 날짜에 마우스 호버 시의 배경색을 설정합니다.
    &__day:hover {
      background-color: #555;
    }

    // 네비게이션(이전/다음 월로 이동) 아이콘의 색상을 설정합니다.
    &__navigation {
      &--previous, &--next {
        color: #fff;
        &:hover {
          color: #ddd;
        }
      }
    }

    // 활성화되지 않은 범위의 날짜 스타일을 설정합니다.
    &__day--disabled {
      color: #555;
    }

    // 다른 달의 날짜 스타일을 설정합니다.
    &__day--outside-month {
      color: #555;
    }

    // 추가적으로 필요한 스타일을 여기에 작성합니다.
  }
`;

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

const StartDateTimeDisplay = styled.div`
  color: #fff;
  font-size: 0.8rem;
  text-align:left;
  margin-bottom: 0;
  font-weight:bold;
  position: relative; // 가상 요소를 위한 상대적 위치 설정

  &::before {
    content: ''; // 가상 요소에는 content 속성이 필수입니다.
    position: absolute; // 부모 요소에 상대적인 절대 위치
    left: 0; // 왼쪽에서부터의 위치
    right: 0; // 오른쪽으로부터의 위치
    top: -5px; // 아래쪽으로부터의 위치, 줄을 원하는 위치에 맞게 조절
    height: 3px; // 줄의 높이
    background-color: #00FFE0; // 형광색 배경색
    border-radius: 1px; // 줄의 모서리 둥글게
  }
`;
const EndDateTimeDisplay = styled.div`
  color: #fff;
  text-align: right;
  font-size: 0.8rem;
  font-weight:bold;
  margin-top:0;
  position: relative; // 가상 요소를 위한 상대적 위치 설정
\`
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px; // 좌우 컨테이너 사이의 간격 설정
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4rem;
  gap: 10px; // 세로로 묶인 요소들 사이의 간격 설정
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  gap: 10px; // 세로로 묶인 요소들 사이의 간격 설정
`;


const PageLayout = styled.div`
  background-color: #000;
  color: #fff;
  font-family: 'Pretendard';
  padding: 2rem;
  height: 100vh;
`;

const DateSection = styled.section`
  text-align: left;
  font-weight: bold;
  color: #fff;
  margin-bottom: 3px;
  position: relative;

  &:after {
    content: ''; // 가상 요소에는 반드시 content가 필요합니다.
    position: absolute; // 부모 요소(DateSection)에 대해 절대 위치
    left: 0; // 왼쪽 끝에서 시작
    right: 0; // 오른쪽 끝까지
    top: 100%; // DateSection의 아래쪽에 위치
    height: 4px; // 줄의 높이
    background-color: #00FFE0; // 형광색으로 배경색 설정
    border-radius: 1px; // 약간 둥근 모서리 효과
  }
`;

const TimeOption = styled.div`
  font-weight: bold;
  margin-left:5px;
  margin-right:5px;
  color:#fff;
`

const TimeSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const TimeBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px; // 원하는 간격을 설정
`;

const CurrentDate = styled.span`
  margin: 0 10px; // 날짜와 버튼 사이의 공간
  color: #fff; // 날짜 색상
`;

const TimeSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  position: relative; // 줄을 추가하기 위해 relative 포지셔닝 설정

  &::after {
    content: ''; // 필수 속성, 비워진 상태로 둡니다.
    position: absolute; // 절대 위치
    bottom: -10px; // 줄의 위치를 TimeSection 하단에서 조금 더 아래로 설정
    //left: 10; // 왼쪽으로부터의 위치
    width: 150%; // TimeSection의 전체 너비
    height: 4px; // 줄의 높이
    background-color: #00FFE0; // 형광색, 줄의 배경색 지정
  }
`;

const TimeLabel = styled.label`
  margin-right: 3px;
  font-weight: bold;
  color: #fff;
`;

const DateLabel = styled.label`
  font-size:1.4rem;
  margin-right: 3px;
  font-weight: bold;
  color: #fff;
`;

const TimeSelect = styled.select`
  padding: 15px;
  font-weight: bold;
  font-size:1.2rem;
  border-radius: 5px;
  border: 1px solid #333;
  color: #000;
  background-color: #fff;
`;

const TimeSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const RentalNotice = styled.span`
  color: #adb5bd;
  margin-top: 8px;
  margin-left:0;
  font-size: 0.7rem;
  position: relative; // 상대적 위치 지정
`;

const ConfirmButton = styled.button`
  background-color: #00FFE0; // 버튼 배경색
  color: #000; // 글자색
  border: none; // 테두리 없음
  border-radius: 20px; // 둥근 모서리
  font-weight: bold; // 글자 두께
  cursor: pointer; // 커서 포인터 모양
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 버튼에 그림자 추가
  transition: background-color 0.3s ease; // 배경색 변경 애니메이션
  display: block; // 블록 레벨 요소
  margin: 2rem auto; // 위아래 마진 설정, 좌우 마진은 자동으로 설정하여 중앙 정렬
  width: 80%; // 버튼의 너비를 80%로 설정
  max-width: 300px; // 최대 너비 설정
  padding: 15px 40px; // 버튼 내부 패딩 증가
  font-size: 1.2rem; // 폰트 크기 증가

  &:hover {
    background-color: #009688; // 호버 시 버튼 배경색 변경
  }
`;

export default OfficialReservationPage;
