import React from 'react';

// ConfirmModal 컴포넌트 정의
function ConfirmModal({ message, isOpen, setIsOpen, onConfirm }) {
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
          zIndex: '999', // zIndex를 통해 오버레이를 모달 뒤에 위치
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
      }} onClick={closeModal}>
        <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            width: '18rem',
            height: '13rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
          <div style={{
                width: '100%',
                height: '10rem',
                fontSize: '1.3rem',
                fontWeight: '500',
                color: '#000',
                borderBottom: '1px solid #ccc',
                alignContent: 'center'
          }}>
            {message}
          </div>
          <button onClick={() => { onConfirm(); closeModal(); }} style={{
              width: '100%',
              height: '3rem',
              backgroundColor: 'transparent',
              color: '#66D1FF',
              fontSize: '1rem',
              fontWeight: '300',
              border: 'none',
              cursor: 'pointer',
              alignContent: 'center'
          }}>
            확인
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
