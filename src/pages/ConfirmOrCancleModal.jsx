import React from 'react';

// ConfirmModal 컴포넌트 정의
function ConfirmOrCancleModal({ message, isOpen, setIsOpen, onConfirm }) {
  // 모달을 닫는 함수
  const closeModal = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <>
      <div style={{
          position: 'fixed', 
          top: '0', 
          left: '0', 
          width: '100%', 
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 오버레이
          zIndex: '999',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
      }} onClick={closeModal}>
        <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
          <div style={{
                width: '100%',
                height: '10rem',
                fontSize: '1.3rem',
                fontWeight: '500',
                color: '#000',
                borderBottom: '1px solid #ccc',
                textAlign: 'center',
                alignContent: 'center'
          }}>
            {message}
          </div>
          <div style={{
              display: 'flex',
              justifyContent: 'space-around',
          }}>
            <button onClick={closeModal} style={{
              flex: 1,
              height: '3rem',
              backgroundColor: 'transparent',
              color: '#D9D9D9',
              fontSize: '1rem',
              fontWeight: '300',
              border: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              textAlign: 'center',
            }}>
              아니오
            </button>
            <button onClick={() => { onConfirm(); closeModal(); }} style={{
              flex: 1,
              height: '3rem',
              backgroundColor: 'transparent',
              color: '#66D1FF',
              fontSize: '1rem',
              fontWeight: '300',
              border: 'none',
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: '1px solid #ccc', // 왼쪽에 선 추가
              cursor: 'pointer',
              textAlign: 'center',
            }}>
              예
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default ConfirmOrCancleModal;
