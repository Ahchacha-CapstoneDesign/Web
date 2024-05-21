import React, { useState } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Calendar from "react-calendar";
import apiClient from "../../path/apiClient";
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmOrCancleModal from '../ConfirmOrCancleModal';
import ConfirmModal from '../ConfirmModal';

const OfficialRegisterDetails = (props) => {
    const location = useLocation(); // location 객체를 통해 현재 위치의 정보를 얻음
    const selectedItem = location.state?.item; // Register1에서 전달된 selectedItem 값을 가져옴
    const [startTime, setStartTime] = useState('0');
    const [startMinutes, setStartMinutes] = useState('0');
    const [endTime, setEndTime] = useState('0');
    const [endMinutes, setEndMinutes] = useState('0');
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState([]);
    const minuteOptions = [0, 30];
    const [modalOpen, setModalOpen] = useState(false);
    const [modalClose, setModalClose] = useState(false);
    const [modalMessage, setModalMessage] = useState(''); 



    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '0',
        returnPlace:'',
        borrowPlace:'',
    });
    const [selectedDays, setSelectedDays] = useState([]);

    const validateForm = () => {
      if (!formData.title) return '상품명을 확인해주세요.';
      if (!formData.price) return '가격을 확인해주세요.';
      if (!formData.status) return '상품상태를 확인해주세요.';
      if (!formData.description) return '설명을 확인해주세요.';
      if (dateRange.length !== 2) return '대여 가능 일을 체크해주세요.';
      if (!formData.borrowPlace) return '대여 위치를 확인해주세요.';
      if (!formData.returnPlace) return '반납 위치를 확인해주세요.';
      return '';
    };

    const handleStatusChange = (status, e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            status: status
        });
    };

    const tileDisabled = ({ date, view }) => {
        // 현재 날짜
        const currentDate = new Date();
        // 현재 날짜보다 이전인 경우만 비활성화
        return date < currentDate;
    };

    const handleImageDelete = (e, index) => {
        e.preventDefault();
        // 이미지 파일 배열에서 해당 인덱스의 이미지를 제거
        const newImageFiles = imageFiles.filter((_, i) => i !== index);
        // 새로운 배열로 이미지 파일 상태 업데이트
        setImageFiles(newImageFiles);
    };


    const handleImageChange = (e) => {
        e.preventDefault()
        const files = Array.from(e.target.files);
        setImageFiles(files);
    };



    const handleInputChange = (e, fieldName) => {
        e.preventDefault();
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, [fieldName]: value }));
    };

    const formatDate = (date, hour, minute) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${hour}시 ${minute}분`;
    };

    const openModal = (e) => {
      e.preventDefault();
  
      const validationMessage = validateForm();
      if (validationMessage) {
          // 입력값이 유효하지 않을 경우, ConfirmModal을 통해 경고 메시지를 띄웁니다.
          setModalMessage(validationMessage); // 오류 메시지 설정
          setModalOpen(true); // 오류 메시지를 표시하는 모달 열기
      } else {
          // 입력값이 모두 유효할 경우, 사용자에게 등록을 진행할 것인지 최종 확인을 요청합니다.
          setModalMessage("물건을 등록하시겠습니까?"); // 등록 확인 메시지 설정
          setModalOpen(true); // 확인 모달 열기
      }
    };

    // 모달 닫기
    const closeModal = () => {
        setModalOpen(false);
    };

    const handleModalConfirm = async () => {
      if (!validateForm()) {
          setModalOpen(false);
          await handleSubmit();
      }
    };



    const handleSubmit = async (e) => {
        if (e) e.preventDefault();  // 폼의 기본 제출 동작을 막음

        // 입력 검증 로직 추가
        const error = validateForm();
        if (error) {
            setModalMessage(error);
            setModalOpen(true);
            return;
        }

        const formDataToSend = new FormData();

        const borrowDateTime = startDate.toISOString().split('T')[0] + "T" + startTime.padStart(2,'0') + ":" + startMinutes.padStart(2, '0') + ":00";
        const returnDateTime = endDate.toISOString().split('T')[0] + "T" + endTime.padStart(2, '0') + ":" + endMinutes.padStart(2, '0') + ":00";

        formDataToSend.append('title', formData.title);
        formDataToSend.append('pricePerHour', formData.price);
        formDataToSend.append('canBorrowDateTime', borrowDateTime);
        formDataToSend.append('returnDateTime', returnDateTime);
        formDataToSend.append('borrowPlace', formData.borrowPlace);
        formDataToSend.append('returnPlace', formData.returnPlace);
        formDataToSend.append('introduction', formData.description);
        formDataToSend.append('itemStatus', formData.status);
        formDataToSend.append('category', selectedItem);

        for (let i = 0; i < imageFiles.length; i++) {
            formDataToSend.append('file', imageFiles[i], imageFiles[i].name); // 파일 이름을 지정하여 추가
        }


        try {
            // 백엔드로 데이터 전송
            const response = await apiClient.post('/items', formDataToSend);
            // 응답 확인

            console.log('상품 등록 성공');
            navigate('/mypage/registerlist');
        } catch (error) {
            // 에러 처리
            console.error('상품 등록 에러:', error.message);
        }
    };
    // Here you would typically handle the submission, e.g., posting to an API

    // 시간 선택 핸들러 함수
    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleStartMinutesChange = (e) => {
        setStartMinutes(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleEndMinutesChange = (e) => {
        setEndMinutes(e.target.value);
    };

    const handleDateChange = dates => {
        setDateRange(dates);
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Form onSubmit={handleSubmit}>
                    <h2>기본 정보
                        <RequiredIndicator1>*필수 항목</RequiredIndicator1>
                    </h2>

                    <Line/>
                    <FormGroup>
                        <Label>상품 이미지</Label>
                        <ImageInput id="image" type="file" accept="image/*" multiple onChange={handleImageChange}  />
                        {/* 이미지 미리보기 */}
                        {imageFiles.length > 0 && imageFiles.map((image, index) => (
                            <ImageContainer key={index}>
                                <ImagePreview src={URL.createObjectURL(image)} alt={`상품 이미지 ${index + 1}`} />
                                {/* 삭제 버튼 추가 */}
                                <DeleteButton onClick={(e) => handleImageDelete(e, index)}>X</DeleteButton>
                            </ImageContainer>
                        ))}
                    </FormGroup>
                    <FormGroup>
                        <Label>상품명
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <ItemInput
                            value={formData.title}
                            onChange={(e) => handleInputChange(e, 'title')}
                            placeholder="상품명을 입력해주세요" />
                    </FormGroup>
                    <FormGroup>
                        <Label>상품 상태
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <StatusContainer>
                            <StatusLabel>
                                <CircleButton
                                    checked={formData.status === 'NEW'}
                                    onClick={(e) => handleStatusChange('NEW', e)}
                                />
                                <StatusText>새 상품(미사용)</StatusText>
                                <StatusDescription>사용하지 않은 새 상품</StatusDescription>
                            </StatusLabel>
                            <StatusLabel>
                                <CircleButton
                                    checked={formData.status === 'LITTLEUSE'}
                                    onClick={(e) => handleStatusChange("LITTLEUSE", e)}
                                />
                                <StatusText>사용감 없음</StatusText>
                                <StatusDescription>사용은 했지만 눈에 띄는 흔적이나 얼룩이 없음</StatusDescription>
                            </StatusLabel>
                            <StatusLabel>
                                <CircleButton
                                    checked={formData.status === 'LESSUSE'}
                                    onClick={(e) => handleStatusChange('LESSUSE', e)}
                                />
                                <StatusText>사용감 적음</StatusText>
                                <StatusDescription>눈에 띄는 흔적이나 얼룩이 약간 있음</StatusDescription>
                            </StatusLabel>
                            <StatusLabel>
                                <CircleButton
                                    checked={formData.status === 'MOREUSE'}
                                    onClick={(e) => handleStatusChange('MOREUSE', e)}
                                />
                                <StatusText>사용감 많음</StatusText>
                                <StatusDescription>눈에 띄는 흔적이나 얼룩이 많이 있음</StatusDescription>
                            </StatusLabel>
                            <StatusLabel>
                                <CircleButton
                                    checked={formData.status === 'BREAK'}
                                    onClick={(e) => handleStatusChange('BREAK', e)}
                                />
                                <StatusText>파손/고장상품</StatusText>
                                <StatusDescription>기능 이상이나 외관 손상 등으로 수리/수선 필요</StatusDescription>
                            </StatusLabel>
                        </StatusContainer>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">설명
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <FormGroup2>
                            <DescriptionText>
                                구매시기, 브랜드/모델명, 제품의 상태(사용감, 하자 유무) 등을 입력해주세요
                            </DescriptionText>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange(e, 'description')}

                            />
                        </FormGroup2>

                    </FormGroup>
                    <FormGroup>
                        <Label>대여 가능 일
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <StyledCalendar
                            onChange={handleDateChange}
                            value={dateRange}
                            selectRange={true}
                            tileDisabled={tileDisabled}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>대여 및 반납 <br/> 가능 시간
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <TimeSelectWrapper>
                            <TimeBlockWrapper>
                                <TimeSelect id="time-start-hour-select" value={startTime} onChange={handleStartTimeChange}>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </TimeSelect> 시
                                <TimeSelect id="time-start-minute-select" value={startMinutes} onChange={handleStartMinutesChange}>
                                    {/* 0부터 59까지의 분을 표시 */}
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </TimeSelect> 분 ~

                                <TimeSelect id="time-end-hour-select" value={endTime} onChange={handleEndTimeChange}>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </TimeSelect> 시
                                <TimeSelect id="time-end-minute-select" value={endMinutes} onChange={handleEndMinutesChange}>
                                    {/* 0부터 59까지의 분을 표시 */}
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </TimeSelect> 분
                            </TimeBlockWrapper>
                        </TimeSelectWrapper>
                    </FormGroup>
                    <FormGroup>
                        <Label>선택 시간 확인</Label>
                        <DateTimeDisplay>
                            {startDate && <span>{formatDate(startDate, startTime, startMinutes)}</span>}
                            {endDate && <span> ~ {formatDate(endDate, endTime, endMinutes)}</span>}
                            <br/>
                        </DateTimeDisplay>
                    </FormGroup>
                    <FormGroup>
                        <Label>대여 위치
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <BorrowPlaceInput
                            value={formData.borrowPlace}
                            onChange={(e) => handleInputChange(e, 'borrowPlace')}
                            placeholder="대여위치를 입력해주세요(ex.상상관 1층)"/>
                    </FormGroup>
                    <FormGroup>
                        <Label>반납 위치
                            <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <ReturnPlaceInput
                            value={formData.returnPlace}
                            onChange={(e) => handleInputChange(e, 'returnPlace')}
                            placeholder="반납위치를 입력해주세요(ex.상상관 1층)"/>
                    </FormGroup>
                    <Button onClick={openModal}>등록하기</Button>
                    {modalOpen && modalMessage !== "물건을 등록하시겠습니까?" && (
                      <ConfirmModal
                        message={modalMessage}
                        isOpen={modalOpen}
                        setIsOpen={setModalOpen}
                        onConfirm={() => setModalOpen(false)} 
                      />
                    )}
                    {modalOpen && modalMessage === "물건을 등록하시겠습니까?" && (
                      <ConfirmOrCancleModal
                        message={modalMessage}
                        isOpen={modalOpen}
                        setIsOpen={setModalOpen}
                        onConfirm={handleModalConfirm}
                      />
                    )}
                </Form>
            </Container>
        </>
    );
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #000;
    color: white;
    font-family: 'Pretendard';
    margin: 0;
    padding: 0;
  }

  input, select, button {
    font-family: 'Pretendard';
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteButton = styled.button`
  position: absolute; /* 추가: 절대적으로 위치 지정 */
  top: 0; /* 추가: 부모 요소 상단에 배치 */
  right: 0; /* 추가: 부모 요소 오른쪽에 배치 */
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
`;

const DescriptionText = styled.p`
  color:#fff;
  font-size:1rem;
  font-weight:600;
`;

const Form = styled.form`
  width: 80rem;
  background-color: #000;
  padding: 20px;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 4rem;
  display: flex;
  align-items: center;
  font-family: 'Arial', sans-serif;
  font-size:1.25rem;
  font-style:normal;
  font-weight:600;
  line-height:normal;

`;
const FormGroup2 = styled.div`
  display:flex;
  flex-direction: column;

`

const Line = styled.span`
  display: block;
  width: 75.375rem;
  height: 0.2rem;
  margin-bottom: 2.94rem;
  background-color: #808080;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  margin-right: 10px;
  position: relative; /* 추가: 자식 요소에 대해 상대적 위치 설정 */
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Label = styled.label`
  display: block;
  width:9.19rem;
  height:3rem;
  font-size:1.25rem;
  font-style:normal;
  font-weight:600;
  line-height:normal;
  margin-right: 2rem;
`;

const RequiredIndicator = styled.span`
  color: red;
  font-size: 1.25rem;
  margin-left: 0.5rem;
  vertical-align: top;
`;

const DateTimeDisplay = styled.div`
  color: #fff;
  width: 40.5rem;
  height: 1.5625rem;
  text-align:left;
  position: relative;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-bottom: 0.5rem;

`;

const RequiredIndicator1 = styled.span`
  color: red;
  font-size: 1rem;
  margin-left: 1.5rem;
  vertical-align: top;
`;

const ImageInput = styled.input`
  width: 8.75rem;
  height: 4rem;
  //border: solid #00FFE0;
  background-color: #000;
  border-radius: 0.5rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: transparent;
  cursor: pointer;
  outline: none;
`;

const ImageInputButton = styled.label`
  background-color: #00FFE0;
  color: #000;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-right: 10px;
`;

const ItemInput = styled.input`
  width:45.625rem;
  height:2.25rem;
  border-color: #00FFE0;
  background-color: #000;

  color: white;
`;

const BorrowPlaceInput = styled.input`
  width:45.625rem;
  height:2.25rem;
  border-color: #00FFE0;
  background-color: #000;

  color: white;
`;

const ReturnPlaceInput = styled.input`
  width:45.625rem;
  height:2.25rem;
  border-color: #00FFE0;
  background-color: #000;

  color: white;
`;

const FeeInput = styled.input`
  width:11.1875rem;
  height:2.25rem;
  border-color: #00FFE0;
  background-color: #000;
  color: white;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
`;

const StatusText = styled.span`
  font-size:1rem;
  font-weight:600;
  margin-left: 0.5rem;
`;

const StatusDescription = styled.span`
  font-size:0.75rem;
  font-weight:600;
  margin-left:1rem;
`

const CircleButton = styled.button`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid #00FFE0;
  background-color: ${props => props.checked ? '#00FFE0' : 'transparent'};
  cursor: pointer;
  margin-right:1rem;
  appearance: none;
`;

const Textarea = styled.textarea`
  width: 42.625rem;
  height: 15.4375rem;
  border-color: #00FFE0;
  background-color: #000;
  font-size:1rem;
  color:#D8CDCD;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
`;

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
  font-size: 1.25rem;
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
  text-align:center;
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

const StyledCalendar = styled(Calendar)`
  width: 25.3125rem;
  height: 25.3125rem;
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

const Button = styled.button`
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
  margin-left: 50rem;
  margin-top: 2rem;
`;

// 모달 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  display: flex;
  width:20rem;
  height: 10rem;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  background-color: #000;
  
`;



const ModalTitle = styled.h3`
  font-size:1.25rem;
  font-style:normal;
  font-weight:600;
  line-height:normal;
  margin-right: 2rem;
  color:#fff;
`;

const ModalButton = styled.button`
  width: 8rem;
  height:2rem;
  background: #00FFE0;
  border-color: #fff;
  border-radius: 2rem;
`;




export default OfficialRegisterDetails;