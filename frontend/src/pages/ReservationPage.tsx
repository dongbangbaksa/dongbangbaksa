import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DateTimePicker from '../pages/DateTimePicker';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../recoil/recoilState';
import { createReservation } from '../util/api';

const ReservationPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f7;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

const DateTimeSelectContainer = styled.div`
  flex: 1;
  margin-right: 40px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const TimeSelectContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 300px;
  width: 100%;
`;

const SelectWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Notice = styled.div`
  margin-bottom: 15px;
  color: #7b7b7b;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
`;

const Button = styled.button`
  border: none;
  background-color: #0071e3;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  height: 40px;
  width: 200px;
  border-radius: 20px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #005bb5;
  }
`;

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useRecoilValue(accessTokenState); // Recoil 상태에서 accessToken을 가져옴

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<{ value: number; label: string } | null>({
    value: 0,
    label: '0명',
  });
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);

  const membersOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1}명` }));

  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
  };

  const handleReservation = async () => {
    if (selectedStartDate && selectedEndDate && selectedMembers?.value !== undefined) {
      // 예약 시간이 올바른지 확인 (시작 시간이 종료 시간보다 이전이어야 함)
      if (selectedStartDate >= selectedEndDate) {
        alert('예약 시작 시간은 종료 시간보다 이전이어야 합니다.');
        return;
      }

      // 예약 시작 시간의 초 값을 1로 설정
      const adjustedStartDate = new Date(selectedStartDate);
      adjustedStartDate.setSeconds(1);

      // 날짜와 시간을 'YYYY-MM-DDTHH:MM:SS' 형식의 문자열로 변환
      const formatDateTime = (date: Date | null): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const formattedStartTime = formatDateTime(adjustedStartDate);
      const formattedEndTime = formatDateTime(selectedEndDate);

      // 예약 데이터 객체 생성
      const reservationData = {
        reservationStartTime: formattedStartTime,
        reservationEndTime: formattedEndTime,
        members: selectedMembers.value,
        meetingRoomId: 1, // 예시로 1번 회의실로 설정
      };

      // 예약 데이터 확인을 위한 콘솔 로그
      console.log('예약 데이터:', reservationData);

      try {
        const response = await createReservation(reservationData);

        if (response.status === 201) {
          console.log('예약에 성공했습니다.');
          setReservationModalOpen(true);
        } else {
          console.error('예약에 실패했습니다.');
        }
      } catch (error) {
        console.error('예약에 실패했습니다:', error);
      }
    } else {
      console.error('모든 요소를 선택해주세요.');
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
        <DateTimeSelectContainer>
          <DateTimePicker
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </DateTimeSelectContainer>
        <TimeSelectContainer>
          <Notice>* 날짜와 시간을 모두 선택해주세요.</Notice>
          <SelectWrapper>
            <label>인원을 선택하세요.</label>
            <Select
              classNamePrefix="react-select"
              options={membersOptions}
              value={selectedMembers}
              onChange={(selectedOption) => setSelectedMembers(selectedOption)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: '40px',
                }),
              }}
            />
          </SelectWrapper>
        </TimeSelectContainer>
      </ContentWrapper>
      <ButtonContainer>
        <Button onClick={handleReservation}>예약하기</Button>
      </ButtonContainer>
    </ReservationPageWrapper>
  );
};

export default ReservationPage;
