import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: relative;
  padding: 20px;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
`;

const PhotoModal = ({ image, onClose }) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Image src={image} alt="Submitted" />
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default PhotoModal;
