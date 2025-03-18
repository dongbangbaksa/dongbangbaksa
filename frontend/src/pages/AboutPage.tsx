import React from 'react';
import styled from 'styled-components';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  padding: 20px;
  background-color: #1c1c1e;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

interface IntroTextProps {
  size?: string;
  color?: string;
}

const IntroText = styled.div<IntroTextProps>`
  font-size: ${(props) => props.size || 'inherit'};
  margin: 10px;
  color: ${(props) => props.color || '#f5f5f7'};
  font-weight: ${(props) => (props.size === '36px' ? '600' : '400')};
`;

const AboutPage: React.FC = () => {
  return (
    <IntroContainer>
      <IntroText size="36px" color="#0a84ff">
        About this service...
      </IntroText>
      <IntroText size="20px" color="#b0b0b0">
        동방박사에 대하여
      </IntroText>
      <IntroText size="20px" color="#777777">
        동방박사는 동아리방 시간 예약 서비스 입니다.
      </IntroText>
    </IntroContainer>
  );
};

export default AboutPage;
