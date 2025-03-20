import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1c1c1e;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0a84ff;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #b0b0b0;
  margin-bottom: 40px;
`;

const Box = styled(Link)`
  display: block;
  width: 100%;
  max-width: 600px;
  background: #2c2c2e;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: #3a3a3c;
    transform: scale(1.05);
    box-shadow: 0px 6px 20px rgba(10, 132, 255, 0.4);
  }
`;

const BoxTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 5px;
  color: #ffffff;
`;

const BoxSubtitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  color: #0a84ff;
  margin: 0;
`;

const MainPage: React.FC = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>동아리방 예약 서비스 동방박사</Title>
        <Subtitle>예약 취소를 간편하게!</Subtitle>

        <Box to="/select">
          <BoxSubtitle>스마트하게</BoxSubtitle>
          <BoxTitle>동아리방 예약</BoxTitle>
        </Box>

        <Box to="/notice">
          <BoxSubtitle>필독!</BoxSubtitle>
          <BoxTitle>공지사항 확인</BoxTitle>
        </Box>
      </ContentWrapper>
    </Container>
  );
};

export default MainPage;
