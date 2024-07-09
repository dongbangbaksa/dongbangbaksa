import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import TimeSelect from '../components/TimeSelect';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../recoil/recoilState';
import { createReservation } from '../util/api';

const ReservationPageWrapper = styled.div``;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderSection = styled.div``;

const Title = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: #3a3a3a;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 0;
`;

const CalendarSelectContainer = styled.div`
  margin-top: 50px;
`;

const MemberSelect = styled.div`
  margin-top: 10px;
`;

const Notice = styled.div`
  margin-top: 15px;
  color: #7b7b7b;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const TimeSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 20%;
  margin-top: 40px;
`;

const Button = styled.button`
  border: none;
  background-color: #c0c0c0;
  color: #ffffff;
  font-size: 20px;
  height: 40px;
  width: 10%;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #000000;
  }
`;

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useRecoilValue(accessTokenState); // Recoil 상태에서 accessToken을 가져옴

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<{ value: number; label: string } | null>({
    value: 0,
    label: '0명',
  });
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);

  const membersOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1}명` }));

  const handleDateChange = (date: Date | Date[] | null) => {
    setSelectedDate(date as Date | null);
  };

  const handleReservation = async () => {
    if (selectedDate && startTime && endTime && selectedMembers?.value !== undefined) {
      const reservationStartTime = new Date(selectedDate);
      reservationStartTime.setHours(Number(startTime.split(':')[0]), Number(startTime.split(':')[1]), 1);
      const reservationEndTime = new Date(selectedDate);
      reservationEndTime.setHours(Number(endTime.split(':')[0]), Number(endTime.split(':')[1]));

      // 한국 시간으로 변환
      const koreanTimeZoneOffset = 9 * 60;
      reservationStartTime.setMinutes(reservationStartTime.getMinutes() + koreanTimeZoneOffset);
      reservationEndTime.setMinutes(reservationEndTime.getMinutes() + koreanTimeZoneOffset);

      // ISO 문자열 생성 후 .000Z 제거
      const isoStartTime = reservationStartTime.toISOString().replace(/\.000Z$/, '');
      const isoEndTime = reservationEndTime.toISOString().replace(/\.000Z$/, '');
      try {
        const response = await createReservation({
          reservationStartTime: isoStartTime,
          reservationEndTime: isoEndTime,
          members: selectedMembers.value,
          meetingRoomId: 1,
        });

        if (response.status === 201) {
          console.log('예약에 성공 했습니다.');
          setReservationModalOpen(true);
        } else {
          console.error('예약에 실패 했습니다.');
        }
      } catch (error) {
        console.error('예약에 실패 했습니다.:', error);
      }
    } else {
      console.error('모든 요소를 선택 해주세요.');
    }
  };

  useEffect(() => {
    // 로그인 상태 확인 및 리디렉션
    if (!accessToken) {
      navigate('/Login');
    }
  }, [accessToken, navigate]);

  return (
    <ReservationPageWrapper>
      <Modal isOpen={isReservationModalOpen} onClose={() => setReservationModalOpen(false)}>
        <div>
          <p>예약이 완료 되었습니다.</p>
        </div>
      </Modal>
      <HeaderSection>
        <Title>Palo Alto 예약하기</Title>
      </HeaderSection>
      <ContentWrapper>
        <CalendarSelectContainer>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            formatDay={(_, date) => (date instanceof Date ? date.getDate().toString() : '')}
          />
        </CalendarSelectContainer>
        <TimeSelectContainer>
          <Notice>* 캘린더에서 날짜를 먼저 선택해주세요.</Notice>
          <TimeSelect
            value={startTime}
            onChange={(selectedTime: string) => setStartTime(selectedTime)}
            label="예약 시작 시간을 선택하세요."
          />
          <TimeSelect
            value={endTime}
            onChange={(selectedTime: string) => setEndTime(selectedTime)}
            label="예약 종료 시간을 선택하세요."
          />
          <MemberSelect>
            <label>인원을 선택하세요.</label>
            <Select
              options={membersOptions}
              value={selectedMembers}
              onChange={(selectedOption) => setSelectedMembers(selectedOption)}
            />
          </MemberSelect>
        </TimeSelectContainer>
      </ContentWrapper>
      <ButtonContainer>
        <Button onClick={handleReservation}>예약하기</Button>
      </ButtonContainer>
    </ReservationPageWrapper>
  );
};

export default ReservationPage;
