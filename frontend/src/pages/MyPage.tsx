import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState, accessTokenState } from '../recoil/recoilState';
import { fetchReservations, deleteReservation, signOutUser } from '../util/api';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #0071e3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const ReservationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style-type: none;
  padding: 0;
`;

const ReservationItem = styled.li`
  width: 300px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
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
  font-size: 20px;
  font-weight: bold;
  color: #0071e3;
  margin-bottom: 10px;
`;

const ReservationInfo = styled.p`
  font-size: 16px;
  color: #555;
  margin: 5px 0;
`;

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

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const accessToken = useRecoilValue(accessTokenState);

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
      if (!accessToken) {
        throw new Error('로그아웃 중 오류가 발생했습니다.');
      }
      await signOutUser(accessToken);
      setIsLogoutModalOpen(true);
      setModalContent('로그아웃이 완료 되었습니다.');
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: any) {
      console.error('로그아웃 실패:', error.message);
      setModalContent(error.message);
      setIsLogoutModalOpen(true);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await deleteReservation(id);
      setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== id));
      setIsCancelModalOpen(true);
      setModalContent('예약이 취소 되었습니다.');
    } catch (error) {
      console.error('예약 삭제 실패', error);
    }
  };

  const closeModalAndRedirect = () => {
    setIsLogoutModalOpen(false);
    navigate('/main');
  };

  return (
    <PageContainer>
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
        {modalContent}
      </Modal>
      <Modal isOpen={isLogoutModalOpen} onClose={closeModalAndRedirect}>
        <p>로그아웃이 완료 되었습니다.</p>
      </Modal>
      <Title>예약 정보</Title>
      <ReservationList>
        {reservations.map((reservation) => (
          <ReservationItem key={reservation.id}>
            <MeetingRoomName>{reservation.meetingRoom.name}</MeetingRoomName>
            <ReservationInfo>시작 시간 : {reservation.startTime.slice(0, -3)}</ReservationInfo>
            <ReservationInfo>종료 시간 : {reservation.endTime.slice(0, -3)}</ReservationInfo>
            <ReservationInfo>사용 인원 : {reservation.members}명</ReservationInfo>
            <DeleteButton onClick={() => handleDeleteReservation(reservation.id)}>취소</DeleteButton>
          </ReservationItem>
        ))}
      </ReservationList>
      <ButtonContainer>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default MyPage;
