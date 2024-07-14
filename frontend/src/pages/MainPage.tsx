import React from 'react';
import BannerSlider from './BannerSlider';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #f5f5f7;
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

const RoundedRectangle = styled.div`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  margin-top: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;

  h3 {
    font-weight: 400;
    margin-bottom: 10px;
    color: #333333;
  }

  h2 {
    margin-top: 0;
    font-weight: 600;
    color: #333333;
  }

  @media (max-width: 48rem) {
    padding: 20px;
  }
`;

const ReservationLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
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
        <BannerSlider />
        <ReservationLink to="/select">
          <RoundedRectangle>
            <h3>스마트하게</h3>
            <h2>동아리방 예약</h2>
          </RoundedRectangle>
        </ReservationLink>
        <ReservationLink to="/notice">
          <RoundedRectangle>
            <h3>필독!</h3>
            <h2>공지사항 확인</h2>
          </RoundedRectangle>
        </ReservationLink>
      </ContentWrapper>
    </Container>
  );
};

export default MainPage;
