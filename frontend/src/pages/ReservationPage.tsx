import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useFetchReservations, useCreateReservation } from '../hooks/useReservation';

import {
  ReservationPageWrapper,
  ContentWrapper,
  HeaderSection,
  Title,
  DateTimeSelectContainer,
  ButtonContainer,
  Button,
} from '../styles/reservationStyled';

const MAX_RESERVATION_HOURS = 3;

const Modal = lazy(() => import('../components/Modal'));
const DateTimePicker = lazy(() => import('../pages/DateTimePicker'));

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { isLoading, isError } = useFetchReservations(); // 예약 정보 가져오기
  const { mutate: createReservation, isPending: isCreatingReservation } = useCreateReservation(); // 예약 생성 훅

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<{ value: number; label: string } | null>(null);

  const [isReservationModalOpen, setReservationModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('예약에 실패했습니다. 다시 시도해주세요.');

  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
  };

  const handleMembersChange = (selectedOption: any) => {
    setSelectedMembers(selectedOption);
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

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  // 제출 직전 최종 검증: 필수값 누락 · 시간 역전 · 지난 시간 · 최대 이용 시간
  const validateReservation = (): string | null => {
    if (!selectedStartDate) return '예약 날짜와 시작 시간을 선택해주세요.';
    if (!selectedEndDate) return '종료 시간을 선택해주세요.';
    if (!selectedMembers) return '인원을 선택해주세요.';
    if (selectedStartDate >= selectedEndDate) return '예약 시작 시간은 종료 시간보다 이전이어야 합니다.';

    const now = new Date();
    if (selectedStartDate.toDateString() === now.toDateString() && selectedStartDate.getHours() < now.getHours()) {
      return '이미 지난 시간은 예약할 수 없습니다.';
    }

    const durationHours = (selectedEndDate.getTime() - selectedStartDate.getTime()) / (60 * 60 * 1000);
    if (durationHours > MAX_RESERVATION_HOURS) return `최대 ${MAX_RESERVATION_HOURS}시간까지만 예약할 수 있습니다.`;

    return null;
  };

  const handleReservation = () => {
    const validationError = validateReservation();
    if (validationError) {
      showError(validationError);
      return;
    }

    if (selectedStartDate && selectedEndDate && selectedMembers) {
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

      createReservation(reservationData, {
        onSuccess: () => {
          // 예약 성공 시 모달 열기
          setReservationModalOpen(true);
        },
        onError: (error: any) => {
          // 서버가 내려준 에러 메시지가 있으면 그대로 노출
          const serverMessage = error?.response?.data?.errorMessage;
          showError(serverMessage || '예약에 실패했습니다. 다시 시도해주세요.');
        },
      }); // 예약 요청
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/Login');
    }
  }, [accessToken, navigate]);

  if (isLoading) {
    return <div>Loading reservations...</div>;
  }

  if (isError) {
    return <div>Error loading reservations</div>;
  }

  return (
    <ReservationPageWrapper>
      <Suspense fallback={<div>Loading Modal...</div>}>
        <Modal isOpen={isReservationModalOpen} onClose={() => setReservationModalOpen(false)}>
          <div>
            <p>예약이 완료 되었습니다.</p>
          </div>
        </Modal>
        <Modal isOpen={isErrorModalOpen} onClose={() => setErrorModalOpen(false)}>
          <div>
            <p>{errorMessage}</p>
          </div>
        </Modal>
      </Suspense>

      <HeaderSection>
        <Title>Palo Alto 예약하기</Title>
      </HeaderSection>
      <ContentWrapper>
        <DateTimeSelectContainer>
          <Suspense fallback={<div>Loading DateTimePicker...</div>}>
            <DateTimePicker
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              selectedMembers={selectedMembers}
              onMembersChange={handleMembersChange}
            />
          </Suspense>
        </DateTimeSelectContainer>
      </ContentWrapper>
      <ButtonContainer>
        <Button onClick={handleReservation} disabled={isCreatingReservation}>
          {isCreatingReservation ? '예약 중...' : '예약하기'}
        </Button>
      </ButtonContainer>
    </ReservationPageWrapper>
  );
};

export default ReservationPage;
