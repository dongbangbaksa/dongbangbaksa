import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledReservationPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #1c1c1e;
  color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const WhiteBox = styled.div`
  width: 90%;
  max-width: 600px;
  background: #2c2c2e;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: left;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #3a3a3c;
    transform: scale(1.05);
    box-shadow: 0px 6px 20px rgba(10, 132, 255, 0.4);
  }
`;

const TitleText = styled.div`
  font-weight: 600;
  font-size: 24px;
  color: #0a84ff;
  margin-bottom: 10px;
`;

const AdditionalText = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #d1d1d6;
  line-height: 1.5;
`;

const ReserveText = styled.div`
  font-size: 28px;
  font-weight: 300;
  color: #f5f5f7;
  margin-bottom: 40px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SelectPage: React.FC = () => {
  return (
    <StyledReservationPage>
      <ReserveText>예약</ReserveText>
      <StyledLink to="/reservation">
        <WhiteBox>
          <TitleText>Palo Alto</TitleText>
          <AdditionalText>
            실리콘밸리의 탄생지(Birthplace of Silicon Valley)로 불리는 미국 캘리포니아주 산타클라라 군에 속한 실리콘밸리
            북부의 도시의 이름에서 따온 방입니다.
          </AdditionalText>
        </WhiteBox>
      </StyledLink>
    </StyledReservationPage>
  );
};

export default SelectPage;
