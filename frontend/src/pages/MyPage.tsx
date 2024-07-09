import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState } from '../recoil/recoilState';
import { fetchReservations, deleteReservation, signOutUser } from '../util/api';

const Title = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: #3a3a3a;
  text-align: center;
  margin-top: 60px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
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
const ReservationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  list-style-type: none;
  padding: 0;
`;
const ReservationItem = styled.li`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  position: relative;
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  padding: 5px;
  cursor: pointer;
`;

const MeetingRoomName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
`;
type MeetingRoomType = {
  id: number;
  name: string;
};
type YourReservationType = {
  id: number;
  startTime: string;
  endTime: string;
  members: number;
  meetingRoom: MeetingRoomType;
};
const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<YourReservationType[]>([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [, setIsLoggedIn] = useRecoilState(isLoggedInState); // Recoil 상태 가져오기

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReservations();
        setReservations(data as YourReservationType[]);
      } catch (error) {
        console.error('예약 정보를 가져오는 중 에러 발생:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      console.log('로그아웃 성공');
      setIsLogoutModalOpen(true);
      setModalContent('로그아웃이 완료 되었습니다.');

      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await deleteReservation(id);
      setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== id));
      console.log('예약 삭제 성공');
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
    <div>
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
            <br />
            <MeetingRoomName>{reservation.meetingRoom.name}</MeetingRoomName>
            <p>시작 시간 : {reservation.startTime.slice(0, -3)}</p>
            <p>종료 시간 : {reservation.endTime.slice(0, -3)}</p>
            <p>사용 인원 : {reservation.members}명</p>

            <DeleteButton onClick={() => handleDeleteReservation(reservation.id)}>취소</DeleteButton>
          </ReservationItem>
        ))}
      </ReservationList>
      <ButtonContainer>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </ButtonContainer>
    </div>
  );
};
export default MyPage;
