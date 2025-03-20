import styled from 'styled-components';

// 전체 페이지 스타일
export const ReservationPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #1d1d1f; // 다크 배경
  padding: 20px;
  color: #f5f5f7; // Apple 기본 텍스트 색상
  font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Arial, sans-serif;
`;

// 컨텐츠 정렬을 위한 박스
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  background: rgba(28, 28, 30, 0.8);
  backdrop-filter: blur(10px); // 유리 효과
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

// 헤더 스타일
export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #f5f5f7;
  margin: 0;
  letter-spacing: -0.5px;
`;

// 버튼 컨테이너
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
`;

// Apple 스타일 버튼
export const Button = styled.button`
  background: #0a84ff;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);

  &:hover {
    background: #0071e3;
  }

  &:active {
    background: #0060d3;
    box-shadow: 0 2px 8px rgba(10, 132, 255, 0.5);
  }

  &:disabled {
    background: rgba(10, 132, 255, 0.4);
    cursor: not-allowed;
  }
`;

// 날짜 선택 컨테이너
export const DateTimeSelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 커스텀 DatePicker 스타일
export const CustomDatePicker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  label {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #f5f5f7;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    color: #f5f5f7;
    font-size: 16px;
    outline: none;
    transition: 0.3s ease-in-out;

    &:focus {
      border-color: #0a84ff;
      box-shadow: 0 0 6px rgba(10, 132, 255, 0.5);
    }
  }
`;

// Select 스타일
export const CustomSelectWrapper = styled.div`
  width: 100%;

  .react-select__control {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #f5f5f7;
    font-size: 16px;
    transition: 0.3s;

    &:hover {
      border-color: #0a84ff;
    }
  }

  .react-select__single-value {
    color: #f5f5f7;
  }

  .react-select__menu {
    background: rgba(28, 28, 30, 0.9);
    border-radius: 10px;
  }

  .react-select__option {
    color: #f5f5f7;
    transition: 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &:active {
      background: #0a84ff;
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;

  label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .date-picker,
  .react-select__control {
    width: 100%;
    height: 50px;
    font-size: 18px;
    padding: 10px;
    border-radius: 10px;
    background-color: #2c2c2e;
    color: #ffffff;
    border: 1px solid #3a3a3c;
  }

  .react-select__menu {
    background-color: #2c2c2e;
    border-radius: 10px;
  }

  .react-select__option {
    font-size: 18px;
    color: #ffffff;
    padding: 12px;
  }

  .react-select__option:hover {
    background-color: #0071e3;
  }
`;
