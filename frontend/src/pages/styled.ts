import styled from 'styled-components';

export const ReservationPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f7;
  padding: 20px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

export const DateTimeSelectContainer = styled.div`
  flex: 1;
  margin-right: 40px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

export const TimeSelectContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 300px;
  width: 100%;
`;

export const SelectWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const Notice = styled.div`
  margin-bottom: 15px;
  color: #7b7b7b;
  font-size: 14px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;

export const Button = styled.button`
  border: none;
  background-color: #0071e3;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  height: 40px;
  width: 200px;
  border-radius: 20px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #005bb5;
  }
`;
