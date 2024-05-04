import React, {useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled, {createGlobalStyle} from 'styled-components';
import {differenceInMinutes} from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const hourOptions = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
const minuteOptions = ['00', '30'];



const OfficialReservationPage = () => {
    const [startTime, setStartTime] = useState(hourOptions[0]); // 시작 시간 상태
    const [startMinutes, setStartMinutes] = useState(minuteOptions[0]); // 시작 분 상태
    const [endTime, setEndTime] = useState(hourOptions[0]); // 종료 시간 상태
    const [endMinutes, setEndMinutes] = useState(minuteOptions[0]); // 종료 분 상태
    const [value, onChange] = useState(new Date());
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;


    const handleDateChange = dates => {
        setDateRange(dates);
    };

    const handleGoBack = () => {
        console.log('돌아가기 버튼 클릭');
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

    return (
        <>
            <GlobalStyle />
            <ContentContainer>
                <BackButton src="/assets/img/BackArrow.png" alt="Back" onClick={handleGoBack} />
                <LeftColumn>
                    <DateSection>날짜 선택</DateSection>
                    <StyledCalendar
                        onChange={handleDateChange}
                        value={dateRange}
                        selectRange={true}
                    />
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
                                </TimeSelect> 시
                                <TimeSelect id="time-start-minute-select" value={startMinutes} onChange={(e) => setStartMinutes(e.target.value)}>
                                    {minuteOptions.map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </TimeSelect> 분
                            </TimeBlockWrapper>
                            <TimeBlockWrapper>
                                <TimeOption>반납 </TimeOption>
                                <TimeSelect id="time-end-hour-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                                    {hourOptions.map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </TimeSelect> 시
                                <TimeSelect id="time-end-minute-select" value={endMinutes} onChange={(e) => setEndMinutes(e.target.value)}>
                                    {minuteOptions.map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </TimeSelect> 분
                            </TimeBlockWrapper>
                        </TimeSelectWrapper>
                    </TimeSectionContainer>
                    <StartDateTimeDisplay>
                        {startDate && <span>{formatDate(startDate, startTime, startMinutes)}</span>}
                        <br/>
                    </StartDateTimeDisplay>
                    <EndDateTimeDisplay>
                        {endDate && <span> ~ {formatDate(endDate, endTime, endMinutes)}</span>}
                    </EndDateTimeDisplay>

                    <ConfirmButton>예약하기</ConfirmButton>
                </RightColumn>
            </ContentContainer>
        </>
    );
};



const BackButton = styled.img`
  width: 3.0625rem;
  height: 3.0625rem;
  margin-right:5.66rem;
  margin-top:-2rem;
`;

const StyledCalendar = styled(Calendar)`
  width: 35.3125rem;
  height: 35.3125rem;
  background-color: #000;
  color:#fff;
  border: none;

  .react-calendar__tile--now {
    background-color: #D6F800; /* 오늘 날짜 */
  }

  .react-calendar__tile--active,
  .react-calendar__tile--rangeStart,
  .react-calendar__tile--rangeEnd {
    background-color: #A900F8; /* 선택된 날짜 및 범위의 시작과 끝 */
  }

  .react-calendar__tile--range {
    background-color: #A900F8; /* 선택 범위 */
  }

  .react-calendar__tile {
    color: #A1A1A1; /* 글씨 색깔 */

    width: 4.5625rem;
    height: 4.9375rem;
    border: 1px solid #A1A1A1; /* 흰색 테두리 추가 */
  }

  .react-calendar__navigation button {
    color: #fff; /* 변경된 글씨 색깔 */
    background: transparent; /* 배경색 없음 */
    border-bottom: 1px solid #fff; /* 네비게이션 버튼 테두리 제거 */
  }

  .react-calendar__navigation {
    color: #fff; /* 변경된 글씨 색깔 */
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    border-bottom: none; /* 네비게이션 바 아래 테두리 제거 */
  }
`;

const StartDateTimeDisplay = styled.div`
  color: #fff;
  width: 24.5rem;
  height: 1.5625rem;
  text-align:left;
  position: relative;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-bottom: 0.5rem;

  &::before {
    content: ''; // 가상 요소에는 content 속성이 필수입니다.
    position: absolute; // 부모 요소에 상대적인 절대 위치
    left: 0; // 왼쪽에서부터의 위치
    right: 0; // 오른쪽으로부터의 위치
    bottom: 2rem; // 아래쪽으로부터의 위치, 줄을 원하는 위치에 맞게 조절
    height: 3px; // 줄의 높이
    background-color: #00FFE0; // 형광색 배경색
    border-radius: 1px; // 줄의 모서리 둥글게
  }

`;
const EndDateTimeDisplay = styled.div`
  color: #fff;
  width: 24.5rem;
  height: 1.5625rem;
  text-align: right;
  margin-bottom:1rem;
  position: relative; // 가상 요소를 위한 상대적 위치 설정
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;

  

\`
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap:1rem;
  margin-top:5rem;
  background-color: #000;
  color: #fff;
`;


const LeftColumn = styled.div`
  display: flex;
  width: 34rem;
  height: 30rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // 자식 요소들을 가로축 중앙에 배치
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

const TotalTimeDisplay = styled.div`
  color: #fff;
  width: 10.25rem;
  height: 3.0625rem;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  margin-top: 0.94rem;
  margin-bottom: 2.81rem;
  line-height: normal;
  text-align: center;
`;



const DateSection = styled.label`
  text-align: left;
  color: #fff;
  margin-right: 25.8rem;
  margin-bottom: 2rem;
  position: relative;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;

  &:after {
    content: ''; // 가상 요소에는 반드시 content가 필요합니다.
    position: absolute; // 부모 요소(DateSection)에 대해 절대 위치
    left: 0; // 왼쪽 끝에서 시작
    right: 0; // 오른쪽 끝까지
    top: 100%; // DateSection의 아래쪽에 위치
    width: 34rem;
    height: 4px; // 줄의 높이
    background-color: #00FFE0; // 형광색으로 배경색 설정
    border-radius: 1px; // 약간 둥근 모서리 효과
  }
`;

const TimeOption = styled.div`
  margin-right:1.8rem;
  color:#fff;
`

const TimeSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top :4rem;
`;

const TimeBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;


const TimeSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34.3125rem;
  height: 2.3125rem;
  position: relative; // 줄을 추가하기 위해 relative 포지셔닝 설정

  &::after {
    content: ''; // 필수 속성, 비워진 상태로 둡니다.
    position: absolute; // 절대 위치
    bottom: -10px; // 줄의 위치를 TimeSection 하단에서 조금 더 아래로 설정

    width: 68%; // TimeSection의 전체 너비
    height: 4px; // 줄의 높이
    background-color: #00FFE0; // 형광색, 줄의 배경색 지정
  }
`;

const TimeLabel = styled.label`
  color: #fff;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

const TimeSelect = styled.select`
  width: 4.25rem;
  height: 3.3125rem;
  padding: 10px;
  margin-right: 1rem;
  margin-left: 1rem;
  color: #fff;
  background-color: #000;
  border-bottom: 0.2rem solid #00FFE0;
  border-right: none;
  border-top: none;
  border-left: none;
  font-family: "Pretendard";
  font-size: 1.3rem; /* 글꼴 크기 설정 */
  font-weight: bold; /* 글꼴 두께 설정 */
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
  appearance: none; /* 기본 브라우저 스타일 제거 */
  cursor: pointer; /* 클릭 가능한 요소임을 나타내는 커서 스타일 */
  background-image: url('/assets/img/timeSelect.png'); /* 화살표 이미지 경로 */
  background-repeat: no-repeat;
  background-position: right bottom 0.35rem; /* 이미지 위치 설정 */
  background-size: 0.8rem; /* 이미지 크기 설정 */
`;

const TimeSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 13rem;
`;

const RentalNotice = styled.span`
  color: #adb5bd;
  margin-top: 8px;
  margin-left:0;
  position: relative; // 상대적 위치 지정
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
`;

const ConfirmButton = styled.button`
  background: #00FFE0;
  width: 19.125rem;
  height: 3.0625rem;
  border: none;
  border-radius: 2rem;
  color: #000;
  text-align: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 6rem;

`;

export default OfficialReservationPage;
