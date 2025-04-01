import React, { useEffect, ReactNode } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';

const StyledModal = styled(ReactModal)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1e1e1e;
  padding: 20px;
  border: 1px solid #444;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
  color: #f1f1f1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;

  * {
    color: #f1f1f1 !important;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    color: #f1f1f1;
    cursor: pointer;
    &:hover {
      color: #e6e6e6;
    }
  }

  /* 오버레이 스타일 */
  .ReactModal__Overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .ReactModal__Content {
    max-height: 80%;
    overflow-y: auto;
  }
`;

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    ReactModal.setAppElement('#root');
  }, []);

  return (
    <StyledModal isOpen={isOpen} onRequestClose={onClose} shouldCloseOnOverlayClick shouldCloseOnEsc>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      {children}
    </StyledModal>
  );
};

export default Modal;
