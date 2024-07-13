import React from 'react';
import styled from 'styled-components';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  justify-content: center; /* 중앙 정렬 */
  height: 80vh;
  padding: 20px;
  background-color: #f5f5f7; /* 애플 웹사이트 배경 색상 */
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* 폰트 설정 */

  @media (max-width: 768px) {
    padding: 20px 10px; /* 모바일 패딩 조정 */
    text-align: center; /* 모바일 텍스트 중앙 정렬 */
  }
`;

interface IntroTextProps {
  size?: string;
  color?: string;
}

const IntroText = styled.div<IntroTextProps>`
  font-size: ${(props) => props.size || 'inherit'};
  text-align: center; /* 텍스트 중앙 정렬 */
  margin: 10px;
  color: ${(props) => props.color || '#333333'}; /* 기본 색상 설정 */
  font-weight: ${(props) => (props.size === '36px' ? '600' : '400')}; /* 헤딩과 본문 폰트 웨이트 설정 */
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
