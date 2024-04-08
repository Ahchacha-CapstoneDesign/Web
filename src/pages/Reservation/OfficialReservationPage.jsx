import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; // 한국어 로케일
import styled, { createGlobalStyle } from 'styled-components';
import {HeaderContainer} from "../Header";
import { differenceInMinutes } from 'date-fns';

const hourOptions = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const minuteOptions = ['00', '30'];

const PersonReservationPage = () => {
    //const [startDate, setStartDate] = useState(new Date()); // 시작 날짜 상태
    const [startTime, setStartTime] = useState(hourOptions[0]); // 시작 시간 상태
    const [startMinutes, setStartMinutes] = useState(minuteOptions[0]); // 시작 분 상태
    //const [endDate, setEndDate] = useState(new Date()); // 종료 날짜 상태
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
            <GlobalStyle />
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
                            locale="ko"
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
  width: 150%; // 달력의 전체 너비를 조절합니다.
  font-size: 1.2rem; // 모든 글자의 기본 크기를 조절합니다.

  // 달력 내부의 날짜 셀(cell)에 대한 스타일을 추가합니다.
  .react-datepicker__day, .react-datepicker__day-name {
    width: 5rem; // 날짜 셀의 너비를 조절합니다.
    height: 5rem; // 날짜 셀의 높이를 조절합니다.
    line-height: 5rem; // 날짜 셀 내부에서 글자의 수직 정렬을 위해 line-height를 조절합니다.
  }

  // 달력 내부의 달(month)에 대한 패딩을 조절하여 크기를 늘립니다.
  .react-datepicker__month {
    padding: 1rem; // 달력 내부의 달(month) 주변 패딩을 추가합니다.
  }

  .react-datepicker__header {
    position: relative; // Set position for the pseudo-element.
    &:before {
      content: ""; // Pseudo-element content should be empty.
      position: absolute; // Position it absolutely within the header.
      top: -10px; // Position it above the header.
      left: 0; // Align to the left edge.
      right: 0; // Align to the right edge.
      height: 4px; // The height of the highlight line.
      background-color: #00FFE0; // Highlight line color.
      border-radius: 1px; // Rounded corners for the highlight line.
    }
  }

  // 추가적인 스타일링...
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
    gap: 10px; // 세로로 묶인 요소들 사이의 간격 설정
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px; // 세로로 묶인 요소들 사이의 간격 설정
`;

const GlobalStyle = createGlobalStyle`
  .react-datepicker {
    font-family: 'Pretendard', sans-serif;
    &__header {
      background-color: #000; // 헤더의 배경색을 검은색으로 변경
      border-bottom: 1px solid #333; // 테두리 색상 조정
      .react-datepicker__current-month,
      .react-datepicker__day-name {
        color: #fff; // 헤더 내부의 글자 색상을 흰색으로 변경
      }
    }
    &__month-container {
      background-color: transparent; // 달력 배경 투명 처리
    }
    &__day {
      color: #fff; // 날짜 글자 색상을 흰색으로 변경
      &:hover {
        background-color: #555; // 날짜에 마우스를 올렸을 때의 배경색 변경
      }
    }
    &__day--selected {
      background-color: #00bfa5; // 선택된 날짜의 배경색 변경
      border-radius: 0.2rem; // 선택된 날짜의 둥근 모서리 처리
    }
    &__day--keyboard-selected {
      border: 1px solid #00bfa5; // 키보드로 선택된 날짜의 테두리 색상 변경
    }
    &__day--outside-month {
      color: #555; // 다른 달의 날짜 색상 변경
    }
    &__navigation {
      top: 10px;
      &--previous,
      &--next {
        color: #fff; // 화살표 색상을 흰색으로 변경
        &:hover {
          color: #00bfa5; // 화살표에 마우스를 올렸을 때의 색상 변경
        }
      }
    }
  }
`;

const TotalTimeDisplay = styled.div`
  color: #fff;
  font-size: 1rem;
  font-weight:bold;
  text-align: center;
  margin: 10px 0;
`;

const PageLayout = styled.div`
  background-color: #000;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
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
    left: 10; // 왼쪽으로부터의 위치
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
  margin-right: 3px;
  font-weight: bold;
  color: #fff;
`;

const TimeSelect = styled.select`
  padding: 10px;
  font-weight: bold;
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
  padding: 12px 30px; // 패딩 설정
  font-size: 1rem; // 폰트 크기
  font-weight: bold; // 글자 두께
  cursor: pointer; // 커서 포인터 모양
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 버튼에 그림자 추가
  transition: background-color 0.3s ease; // 배경색 변경 애니메이션
  display: block; // 블록 레벨 요소
  margin: 2rem auto; // 위아래 마진 설정, 좌우 마진은 자동으로 설정하여 중앙 정렬
  width: 80%; // 버튼의 너비를 80%로 설정
  max-width: 300px; // 최대 너비 설정

  &:hover {
    background-color: #009688; // 호버 시 버튼 배경색 변경
  }
`;

export default PersonReservationPage;
