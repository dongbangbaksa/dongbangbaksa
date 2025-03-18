import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState, accessTokenState, refreshTokenState } from '../recoil/recoilState';
import { fetchReservations, deleteReservation, signOutUser } from '../util/api';
type MeetingRoomType = {
  id: number;
  name: string;
};

type ReservationType = {
  id: number;
  startTime: string;
  endTime: string;
  members: number;
  meetingRoom: MeetingRoomType;
};

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

const MeetingRoomName = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0a84ff;
  margin-bottom: 10px;
`;

const ReservationInfo = styled.p`
  font-size: 1rem;
  color: #b0b0b0;
  margin: 5px 0;
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
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [, setRefreshToken] = useRecoilState(refreshTokenState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReservations();
        setReservations(data as ReservationType[]);
      } catch (error) {
        console.error('예약 정보를 가져오는 중 에러 발생:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await signOutUser(accessToken);
        setModalContent('로그아웃이 완료되었습니다.');
        setIsModalOpen(true);
        setIsLoggedIn(false);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setModalContent('로그아웃 실패. 다시 시도해 주세요.');
      setIsModalOpen(true);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await deleteReservation(id);
      setReservations((prevReservations) => prevReservations.filter((r) => r.id !== id));
      setModalContent('예약이 취소되었습니다.');
      setIsModalOpen(true);
    } catch (error) {
      console.error('예약 삭제 실패', error);
    }
  };

  return (
    <PageContainer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
      <Title>예약 정보</Title>
      <ReservationList>
        {reservations.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <MeetingRoomName>{reservation.meetingRoom.name}</MeetingRoomName>
            <ReservationInfo>시작 시간: {reservation.startTime.slice(0, -3)}</ReservationInfo>
            <ReservationInfo>종료 시간: {reservation.endTime.slice(0, -3)}</ReservationInfo>
            <ReservationInfo>사용 인원: {reservation.members}명</ReservationInfo>
            <DeleteButton onClick={() => handleDeleteReservation(reservation.id)}>취소</DeleteButton>
          </ReservationItem>
        ))}
      </ReservationList>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </PageContainer>
  );
};

export default MyPage;
