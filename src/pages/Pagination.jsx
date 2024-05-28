import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const PageButton = styled.button`
  background-color: ${props => props.isSelected ? '#878787' : 'transparent'};
  color: ${props => props.isSelected ? '#00ffe0' : '#c1c1c1'};
  border: none;
  cursor: pointer;
  margin: 0 5px;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-family: "Pretendard";
  font-weight: 500;

  &:hover {
    background-color: ${props => props.isSelected ? 'black' : '#f0f0f0'};
  }
`;

const ArrowImage = styled.img`
  width: 20px;
  height: 20px;
`;

// 아이템 리스트 1,2,3,4,5 페이지 이동 코드
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 페이지 번호를 계산하는 로직
  const maxPageNumberLimit = 5;
  const pageNumberLimit = Math.min(5, totalPages);
  let startPage = Math.max(currentPage - Math.floor(pageNumberLimit / 2), 1);
  let endPage = startPage + pageNumberLimit - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(totalPages - pageNumberLimit + 1, 1);
  }

  return (
    <PaginationContainer>
        <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ArrowImage src="/assets/img/PrevArrow.png" alt="Previous page" />
        </PageButton>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <PageButton 
              key={startPage + index} 
              isSelected={currentPage === startPage + index} 
              onClick={() => onPageChange(startPage + index)}>
              {startPage + index}
            </PageButton>
        ))}
        <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <ArrowImage src="/assets/img/NextArrow.png" alt="Next page" />
        </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;

export { Pagination, PaginationContainer };
