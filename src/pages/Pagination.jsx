import React from 'react';
import styled from 'styled-components';

import prevArrow from "/assets/img//PrevArrow.png";
import nextArrow from "/assets/img//nextArrow.png";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <PaginationContainer>
        <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ArrowImage src={prevArrow} alt="Previous page" />
        </PageButton>
        {Array.from({ length: totalPages }, (_, index) => (
            <PageButton key={index + 1} isSelected={currentPage === index + 1} onClick={() => onPageChange(index + 1)}>
            {index + 1}
            </PageButton>
        ))}
        <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <ArrowImage src={nextArrow} alt="Next page" />
        </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
