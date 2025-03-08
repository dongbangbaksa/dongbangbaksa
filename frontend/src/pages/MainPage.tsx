import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  padding: 20px;
`;

const Box = styled.div`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h2,
  h3 {
    margin: 0;
    color: #333;
  }

  h3 {
    font-weight: 400;
    margin-bottom: 10px;
  }

  h2 {
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    color: #666;
  }

  @media (max-width: 48rem) {
    padding: 15px;
  }
`;

const ReservationLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media (max-width: 48rem) {
    margin-bottom: 10px;
  }
`;

const MainPage: React.FC = () => {
  return (
    <Container>
      <ContentWrapper>
        <Box>
          <h1>동아리방 예약 서비스 동방박사</h1>
          <p>예약 취소를 간편하게!</p>
        </Box>

        <ReservationLink to="/select">
          <Box>
            <h3>스마트하게</h3>
            <h2>동아리방 예약</h2>
          </Box>
        </ReservationLink>

        <ReservationLink to="/notice">
          <Box>
            <h3>필독!</h3>
            <h2>공지사항 확인</h2>
          </Box>
        </ReservationLink>
      </ContentWrapper>
    </Container>
  );
};

export default MainPage;
