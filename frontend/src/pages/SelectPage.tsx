import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledReservationPage = styled.div`
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  overflow: hidden;
`;

const WhiteBox = styled.div`
  position: relative;
  width: 280px;
  height: 360px;
  background: #ffffff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  padding: 20px;
`;

const TitleText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  color: #000000;
  margin-top: 20px;
  margin-left: 20px;
`;

const AdditionalText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #000000;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

const ReserveText = styled.div`
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 40px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
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
