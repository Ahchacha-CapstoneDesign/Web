import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactQuill, { Quill } from 'react-quill'; //npm install react-quill 필수
import 'react-quill/dist/quill.snow.css'; // Quill 에디터의 스타일시트
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { createGlobalStyle } from 'styled-components';
import { useLocation } from 'react-router-dom';
import apiClient from '../../path/apiClient';

 const TEMP_DATA_KEY = "temporaryData";


 const PostCreationPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { communityId } = useParams(); 
  const [titleLength, setTitleLength] = useState(0);
  const maxTitleLength = 30;
  const [contentLength, setContentLength] = useState(0);
  const maxContentLength = 500;
  const quillRef = useRef(null);
  const [hasDeferredModal, setHasDeferredModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [tempSavedPostId, setTempSavedPostId] = useState(null);


  useEffect(() => {
    // 게시글 데이터를 불러오는 함수
    const fetchPostData = async () => {
      try {
        const response = await apiClient.get(`/community/${communityId}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('게시글 데이터를 불러오는 중 에러가 발생했습니다:', error);
      }
    };

    if (communityId) {
      fetchPostData();
    }
  }, [communityId]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 hasDeferredModal 상태를 불러옴
    const storedHasDeferredModal = localStorage.getItem('hasDeferredModal');
    if (storedHasDeferredModal) {
      setHasDeferredModal(storedHasDeferredModal === 'true');
    }
  }, []);


  const handleGoBack = () => {
    navigate(-1); // 뒤로가기 기능 실행
  };
  
  //제목글자수
  useEffect(() => {
    setTitleLength(title.length);
  }, [title]);
  
  //내용글자수
  useEffect(() => {
    const text = content.replace(/<[^>]*>?/gm, '');
    setContentLength(text.length);
  }, [content]);

  //이미지
  useEffect(() => {
    const quill = quillRef.current;
    if (quill) {
      quill.getEditor().getModule('toolbar').addHandler('image', () => {
        handleImageUpload();
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    e.stopPropagation(); 
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const MAX_WIDTH = 400;
          let width = img.width;
          let height = img.height;
  
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          const resizedImgDataUrl = canvas.toDataURL('image/jpeg');
  
          // 에디터에 이미지 삽입
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', resizedImgDataUrl);
          quill.setSelection(range.index + 1);
  
          // 이미지 Data URL을 상태에 저장
          handleImageUploadSuccess(resizedImgDataUrl);
        };
      };
    };
  };

  const handleImageUploadSuccess = (dataUrl) => {
    setImageUrls((prevUrls) => [...prevUrls, dataUrl]);
  };
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleLength(e.target.value.length);
  };

  const handleContentChange = (value) => {
    setContent(value);
    const text = value.replace(/<[^>]*>?/gm, '');
    setContentLength(text.length);
  };

   const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    try {
      // 게시글을 업데이트하는 API 엔드포인트로 수정하세요
      const response = await apiClient.post(`/community/update/${communityId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('게시글이 성공적으로 수정되었습니다.');
        navigate(`/community/${communityId}`); // 수정된 게시글 보기 페이지로 리다이렉트
      }
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
      alert('게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
    
  // Data URL을 Blob으로 변환하는 함수
  function dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }
  
const location = useLocation();

useEffect(() => {
  if (location.pathname === '/posting') {
    const params = new URLSearchParams(window.location.search);
    const fromTalkTalk = params.get('from') === 'talktalk';

    if (fromTalkTalk) {
      const savedData = localStorage.getItem(TEMP_DATA_KEY);
      if (savedData) {
        const shouldLoadData = window.confirm("임시저장된 글이 있습니다. 불러오시겠습니까?");
        if (shouldLoadData) {
          const { id: tempSavedPostId, title: savedTitle, content: savedContent } = JSON.parse(savedData);
          setTempSavedPostId(tempSavedPostId);
          setTitle(savedTitle);
          setContent(savedContent);
        }
      }
    }
  }
}, [location.pathname]);

    
  return (
    <>
    <GlobalStyle /> 
    <PageContainer>
      <BackButtonContainer>
        <BackButton onClick={handleGoBack}>&lt; 뒤로가기</BackButton> 
      </BackButtonContainer>
      <Form onSubmit={handleSubmit}>
      <InputContainer>
        <Input 
          type="text" 
          placeholder="제목을 입력하세요" 
          value={title} 
          onChange={handleTitleChange} 
          />
          <TitleCounter>({titleLength}/{maxTitleLength}자)</TitleCounter>
          </InputContainer>

          <ContentContainer>
              <StyledReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleContentChange}
              />
              <ImageButton  type="button" onClick={handleImageUpload}>
                <img src="/assets/img/ImgSelect.png" alt="이미지 아이콘" /> 
                이미지 첨부하기
              </ImageButton>
              <ContentCounter>
              ({contentLength}/{maxContentLength}자)
              </ContentCounter>
            </ContentContainer>
            <ButtonContainer>
              <SubmitButton type="submit">수정 완료</SubmitButton>
            </ButtonContainer>
          </Form>
      </PageContainer>
      </>
    );
  };
export default PostCreationPage;

// Styled Components

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      background-color: #000; // body 전체의 배경색을 검은색으로 설정
      font-family: "Pretendard";
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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; 
`;
const BackButtonContainer = styled.div`
max-width: 75.125rem;`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%; // 폼의 너비를 전체로 설정
  max-width: 75.125rem; // 최대 너비 제한
  padding: 1rem; // 폼 내부의 여백
  margin-top: 4rem;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom:4rem;
`;

const TitleCounter = styled.div`
  position: absolute;
  width: 6.375rem;
  height: 1.5625rem;
  text-align: right;
  margin-top: 1.12rem;
  margin-left: 71rem;
  font-family: 'Pretendard';
  font-size: 1.0625rem;
  font-weight: 700;
  color: #636363;
`;
const Input = styled.input`
  display: flex;
  align-items: center; 
  width: 75.125rem;   
  height: 3.75rem;
  border-width: 0.2rem;;
  background-color: transparent;
  border-style: solid;
  border-color: #00FFE0;
  border-radius: 0.8rem;
  padding-left: 2.56rem; 
  font-family: 'Pretendard';
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
    
  &:focus {
    outline: none;
    }

  &::placeholder {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 700;
    font-family: 'Pretendard';
    color: #A1A1A1;
  }
`;

const ContentContainer = styled.div`
  width: 78.125rem;
  height: 41.6875rem;
  border: 3px solid #A1A1A1;
  border-radius: 0.8rem;
  margin-top: 3rem;;
  position: relative;   
  color: white;
`;
const StyledReactQuill = styled(ReactQuill)`
.ql-container {
  height: 100%;
  border: none !important; 
  
}
    .ql-editor {
      position: relative; 
    top: -1.56rem;      
    height: 36rem;
    font-size: 1.25rem;
    font-weight: 300;
    font-family: 'Pretendard';
    line-height: 2.34375rem;
    margin-left:1.58rem;
    margin-right:1.58rem;
    border-bottom: 2px solid #E2E2E2;
    
  }

  .ql-toolbar {
    position: relative;
    top: -4rem;
    left: 0;
    display: flex;
    justify-content: center; 
    align-items: center; 
    width: 23.9375rem;
    height: 3rem;
    font-family: 'Pretendard';
    background: #EFF0F4;
    font-color: #636363;
    border: none;
    button {
      font-size: 1.25rem;
    }

    .ql-picker-label, .ql-picker-item {
      display: flex;
      align-items: center; 
      font-size: 1rem; 
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled.button`
  background-color: #00FFE0;
  color: black;
  border: none;
  cursor: pointer;
  width: 12.5rem;
  height: 4rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 2rem;
  border-radius: 0.625rem;
  &:active {
    transform: scale(0.95); 
  }
`;

// ImageButton을 styled.button에서 컴포넌트로 변경
const ImageButton = styled.button`
  position: absolute;
  bottom: 1rem; 
  right: 10rem; 
  z-index: 1000;
  background-color: transparent;
  color: #A1A1A1;
  border-radius: 5px; 
  cursor: pointer; 
  border: none; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  font-size: 1.0625rem;
  font-weight: 700;
  font-family: 'Pretendard';
  transition: transform 0.1s, background-color 0.1s; 

  img {
    margin-right: 0.56rem; 
    width: 1.875rem;
    height: 1.875rem;
  }
  &:active {
    transform: scale(0.95); 
  }
`;

const ContentCounter = styled.div`
  display: flex;
  margin-left: 70rem;
  width: 6.375rem;
  color: #636363;
  font-size: 1.0625rem;
  font-weight: 700;
`;

const BackButton = styled.div`
  display: flex;
  cursor: pointer;
  background-color: transparent;
  color: #d9d9d9;
  border: none;
  border-radius: 5px;
  margin-top: 2rem;
  margin-right: 68rem;
  margin-bottom: -10rem;  
  align-self: flex-start;  
  font-family: 'Pretendard';
  font-size: 1.2rem;
`;