import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Select from 'react-select';
import { useMutation } from 'react-query';

import Modal from '../components/Modal';
import DateTimePicker from '../pages/DateTimePicker';
import { accessTokenState } from '../recoil/recoilState';
import { createReservation } from '../util/api';
import {
  ReservationPageWrapper,
  ContentWrapper,
  HeaderSection,
  Title,
  DateTimeSelectContainer,
  TimeSelectContainer,
  SelectWrapper,
  Notice,
  ButtonContainer,
  Button,
} from './styled';

const ReservationPage: React.FC = () => {
  console.log('렌더링됨');
  const navigate = useNavigate();
  const accessToken = useRecoilValue(accessTokenState);

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

  const mutation = useMutation(createReservation, {
    onSuccess: () => {
      setReservationModalOpen(true); // 예약 성공 시 모달 띄우기
    },
    onError: (error) => {
      console.error('예약 실패:', error);
    },
  });

  const handleReservation = () => {
    if (selectedStartDate && selectedEndDate && selectedMembers?.value !== undefined) {
      if (selectedStartDate >= selectedEndDate) {
        alert('예약 시작 시간은 종료 시간보다 이전이어야 합니다.');
        return;
      }

      const adjustedStartDate = new Date(selectedStartDate);
      adjustedStartDate.setSeconds(1);

      const formattedStartTime = formatDateTime(adjustedStartDate);
      const formattedEndTime = formatDateTime(selectedEndDate);

      const reservationData = {
        reservationStartTime: formattedStartTime,
        reservationEndTime: formattedEndTime,
        members: selectedMembers.value,
        meetingRoomId: 1,
      };

      console.log('예약 데이터:', reservationData);

      mutation.mutate(reservationData); // 예약 요청
    } else {
      console.error('모든 요소를 선택해주세요.');
    }
  };

  useEffect(() => {
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
        <Button onClick={handleReservation} disabled={mutation.isLoading}>
          {mutation.isLoading ? '예약 중...' : '예약하기'}
        </Button>
      </ButtonContainer>
    </ReservationPageWrapper>
  );
};

export default ReservationPage;
