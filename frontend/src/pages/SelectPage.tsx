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
  background-color: #f5f5f7;
  color: #000000;
`;

const WhiteBox = styled.div`
  width: 90%;
  max-width: 600px;
  background: #ffffff;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: left;
`;

const TitleText = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: #333333;
  margin-bottom: 10px;
`;

const AdditionalText = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #555555;
  line-height: 1.5;
`;

const ReserveText = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: 300;
  color: #333333;
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
