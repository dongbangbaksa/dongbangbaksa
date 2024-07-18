import React from 'react';
import styled from 'styled-components';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  padding: 20px;
  background-color: #f5f5f7;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 20px 10px;
    text-align: center;
  }
`;

interface IntroTextProps {
  size?: string;
  color?: string;
}

const IntroText = styled.div<IntroTextProps>`
  font-size: ${(props) => props.size || 'inherit'};
  text-align: center;
  margin: 10px;
  color: ${(props) => props.color || '#333333'};
  font-weight: ${(props) => (props.size === '36px' ? '600' : '400')};
`;

const AboutPage: React.FC = () => {
  return (
    <IntroContainer>
      <IntroText size="36px" color="#333333">
        About this service...
      </IntroText>
      <IntroText size="20px" color="#555555">
        이 서비스에 대하여
      </IntroText>
      <IntroText size="20px" color="#777777">
        이 서비스는 테커 팀루나 프로젝트팀 Achieve에서 만든 테커 동아리방 예약 시스템 입니다.
      </IntroText>
    </IntroContainer>
  );
};

export default AboutPage;
