import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Register1 = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const userstatus = localStorage.getItem('personOrOfficial')

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedItem(null); // 카테고리 변경 시 선택된 아이템 초기화
    };

    const handleRegisterClick = () => {
        // 등록하기 버튼 클릭 시 선택한 카테고리와 아이템 데이터를 다음 페이지로 전달
        if (selectedItem) {
            if(userstatus == "PERSON"){
                navigate('/register/personregisterdetails', {
                    state: {item: selectedItem}
                });
            }
            else if(userstatus == "OFFICIAL"){
                navigate('/register/officialregisterdetails', {
                    state: {item: selectedItem}
                });

            }
            else alert("잘못된 사용자 입니다");

        } else {
            alert("카테고리를 선택하세요.");
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item === selectedItem ? null : item); // 아이템 선택 토글
    };

    return (
        <>
            <GlobalStyle />
            <ItemTitle>카테고리<Span>*필수항목</Span></ItemTitle>

            <CategoryWrapper>
                <CategoryList>
                    {categories.map(category => (
                        <CategoryItem key={category.id} onClick={() => handleCategoryClick(category)}>
                            {category.name}
                        </CategoryItem>
                    ))}
                </CategoryList>
                <ItemList>
                    {selectedCategory && selectedCategory.items.map(item => (
                        <Item
                            key={item}
                            onClick={() => handleItemClick(item)} // 클릭 핸들러 추가
                            selected={selectedItem === item} // 선택된 아이템인 경우에 배경색 변경
                        >
                            {item}
                        </Item>
                    ))}
                </ItemList>
            </CategoryWrapper>

            <RegisterButton onClick={handleRegisterClick}>등록하기</RegisterButton>
        </>
    );
};

const categories = [
    {
        id: 1,
        name: "전자기기",
        items: ["노트북", "마우스", "충전기", "보조배터리", "블루투스스피커", "키보드", "카메라", "케이블", "계산기"]
    },
    {
        id: 2,
        name: "생활",
        items: ["책", "우산", "커피포트", "보드게임", "퍼즐", "카드게임", "돗자리"]
    },
    {
        id: 3,
        name: "헬스",
        items: ["운동기기", "공", "운동화", "덤벨", "매트", "푸쉬업바", "풀업바"]
    },
    {
        id: 4,
        name: "뷰티",
        items: ["고데기", "드라이기", "토너", "에센스", "크림", "로션", "앰플"]
    },
    {
        id: 5,
        name: "예술",
        items: ["악기", "음악", "미술", "조각"]
    },
    {
        id: 6,
        name: "기타",
        items: ["기타"]
    },
    {
        id: 7,
        name: "기타",
        items: ["기타"]
    },
    {
        id: 8,
        name: "기타",
        items: ["기타"]
    },
    {
        id: 9,
        name: "기타",
        items: ["기타"]
    }
];

export default Register1;

// 스타일 컴포넌트들
export const GlobalStyle = createGlobalStyle`
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #000; 
  overflow: hidden;
  background-position: center;
}
`;

const ItemTitle = styled.div` 
  color: #FFF;
  margin-top: 4rem;
  text-align: left;
  margin-left: 28rem;
  font-family: "Pretendard";
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 700;
`;

const Span = styled.div` 
    display: inline-block; 
    margin-left: 0.5rem;
    color: #FF0000;
    font-family: "Pretendard";
    font-size: 1.1rem;
    font-weight: 600;
`;

const CategoryWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  width: 53.8%;
  height: 450px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
`;

const CategoryList = styled.div`
  width: 50%;
  background-color: #333;
  overflow-y: auto; /* 세로 스크롤을 추가 */
  scrollbar-width: thin; /* Firefox에서 스크롤바 크기 조정 */
  scrollbar-color: #888 #555; /* Firefox에서 스크롤바 색상 조정 */
  /* WebKit 기반 브라우저 (Chrome, Safari) 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
    height: 8px; /* 스크롤바 높이 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모양 */
  }
  &::-webkit-scrollbar-track {
    background-color: #888; /* 스크롤바 트랙 색상 */
  }
`;

const CategoryItem = styled.div`
  color: #FFF;
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const ItemList = styled.div`
  width: 50%;
  background-color: #666;
  overflow-y: auto; /* 세로 스크롤을 추가 */
  scrollbar-width: thin; /* Firefox에서 스크롤바 크기 조정 */
  scrollbar-color: #888 #555; /* Firefox에서 스크롤바 색상 조정 */
  /* WebKit 기반 브라우저 (Chrome, Safari) 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
    height: 8px; /* 스크롤바 높이 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모양 */
  }
  &::-webkit-scrollbar-track {
    background-color: #888; /* 스크롤바 트랙 색상 */
  }
`;

const Item = styled.div`
  color: #FFF;
  padding: 1rem;
  cursor: pointer;

  background-color: ${({ selected }) => selected ? '#444' : 'transparent'};

  &:hover {
    background-color: #444;
  }
`;

const RegisterButton = styled.button`
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
  margin-left: 73.5rem;
  margin-top: 6rem;
`;