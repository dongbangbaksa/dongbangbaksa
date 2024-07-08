import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { checkLoginStatus } from '../util/api';

const StyledSlider = styled(Slider)`
  height: 100%;
  .slick-list {
    height: 100%;
  }
  .slick-slide {
    margin-left: 40px;
    margin-right: 20px;
    height: 100%;
  }
`;

const Banner = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
  position: relative;
  margin-top: 50px;
`;

const Background = styled.div`
  background-color: #ececec;
  width: 100%;
  height: 100%;
  color: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  margin-left: 0px;
`;

const Heading = styled.h1`
  margin: 0;
  margin-top: 60px;
  margin-bottom: 5px;
  margin-left: 34px;
`;

const Heading2 = styled.h1`
  margin: 0;
  margin-top: 0px;
  margin-bottom: 5px;
  margin-left: 34px;
`;

const Text = styled.p`
  margin-bottom: 30px;
  margin-left: 34px;
`;

const StudyLabel = styled.span`
  position: absolute;
  top: 34px;
  left: 16px;
  background-color: black;
  color: white;
  padding: 4px 8px;
  border-radius: 5px;
  margin-left: 34px;
`;

const RoundedRectangle = styled.div`
  position: absolute;
  width: 700px;
  height: 194px;
  left: 20px;
  top: 300px;
  background: #ffffff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  margin-bottom: 20px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  h3 {
    font-weight: 300;
    text-align: left;
    margin-bottom: 5px;
    margin-left: 60px;
    margin-top: 10px;
  }
  h2 {
    margin-top: 0px;
    font-weight: 600;
    text-align: left;
    margin-left: 60px;
  }
`;

const RoundedRectangle2 = styled.div`
  position: absolute;
  width: 700px;
  height: 194px;
  left: 740px;
  top: 300px;
  background: #ffffff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  margin-bottom: 20px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  h3 {
    font-weight: 300;
    text-align: left;
    margin-bottom: 5px;
    margin-left: 60px;
    margin-top: 10px;
  }
  h2 {
    margin-top: 0px;
    font-weight: 600;
    text-align: left;
    margin-left: 60px;
  }
`;

const ReservationLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
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

  const handleReservationClick = async () => {
    try {
      const data = await checkLoginStatus();
      const isLoggedIn = data.loggedIn;

      if (!isLoggedIn) {
        window.location.href = '/login';
      } else {
        window.location.href = '/select';
      }
    } catch (error) {
      console.error('로그인 상태 확인 중 에러:', error);
      window.location.href = '/login';
    }
  };

  return (
    <Banner>
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
      <ReservationLink to="/select" onClick={handleReservationClick}>
        <RoundedRectangle>
          <h3>스마트하게</h3>
          <h2>동아리방 예약</h2>
        </RoundedRectangle>
      </ReservationLink>
      <RoundedRectangle2>
        <h3>필독!</h3>
        <h2>공지사항 확인</h2>
      </RoundedRectangle2>
    </Banner>
  );
};

export default BannerSlider;
