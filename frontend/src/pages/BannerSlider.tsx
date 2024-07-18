import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #f5f5f7;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  max-width: 800px;

  .slick-list {
    height: 100%;
  }

  .slick-slide {
    display: flex;
    justify-content: center;
  }
`;

const Background = styled.div`
  background-color: #ffffff;
  width: 100%;
  max-width: 600px;
  height: auto;
  color: #000000;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const Heading = styled.h1`
  margin: 0;
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 600;
  color: #333333;
`;

const Heading2 = styled.h1`
  margin: 0;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 500;
  color: #555555;
`;

const Text = styled.p`
  margin-bottom: 30px;
  font-size: 16px;
  color: #777777;
`;

const StudyLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #000000;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
`;

const BannerSlider: React.FC = () => {
  const settings = {
    centerMode: true,
    centerPadding: '60px',
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container>
      <StyledSlider {...settings}>
        <Background>
          <StudyLabel>project</StudyLabel>
          <Heading>테커 동아리방 예약 시스템</Heading>
          <Heading2>예약과 취소를 간편하게!</Heading2>
          <Text>Achieve</Text>
        </Background>
        <Background>
          <StudyLabel>study</StudyLabel>
          <Heading>프론트엔드 스터디</Heading>
          <Heading2>드림코딩 Next.js 강의 수강중</Heading2>
          <Text>SF5</Text>
        </Background>
      </StyledSlider>
    </Container>
  );
};

export default BannerSlider;
