import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { fetchReservations, deleteReservation, signOutUser } from '../util/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background-color: #1c1c1e;
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #0a84ff;
  margin-bottom: 40px;
`;

const ReservationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style-type: none;
  padding: 0;
`;

const ReservationItem = styled.li`
  width: 320px;
  background-color: #2c2c2e;
  border-radius: 15px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff3b30;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e02b20;
  }
`;

const LogoutButton = styled.button`
  padding: 12px 24px;
  background-color: #0a84ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0071e3;
  }
`;

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const queryClient = useQueryClient();

  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setModalContent('예약이 취소되었습니다.');
      setIsModalOpen(true);
    },
  });

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await signOutUser(accessToken);
        setModalContent('로그아웃이 완료되었습니다.');
        setIsModalOpen(true);
        logout();
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setModalContent('로그아웃 실패. 다시 시도해 주세요.');
      setIsModalOpen(true);
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류 발생</p>;

  return (
    <PageContainer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
      <Title>예약 정보</Title>
      <ReservationList>
        {reservations.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <p>{reservation.meetingRoom.name}</p>
            <p>시작 시간: {reservation.startTime.slice(0, -3)}</p>
            <p>종료 시간: {reservation.endTime.slice(0, -3)}</p>
            <p>사용 인원: {reservation.members}명</p>
            <DeleteButton onClick={() => deleteMutation.mutate(reservation.id)}>취소</DeleteButton>
          </ReservationItem>
        ))}
      </ReservationList>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </PageContainer>
  );
};

export default MyPage;
