import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchReservations, createReservation, deleteReservation } from '../util/api';

// 예약 목록 가져오는 훅
export const useFetchReservations = () => {
  return useQuery('reservations', fetchReservations);
};

// 예약 생성 훅
export const useCreateReservation = () => {
  const queryClient = useQueryClient(); // 서버 상태 변경 후 캐시를 갱신하기 위해 사용
  return useMutation(createReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations'); // 예약 목록을 다시 가져와 갱신
    },
    onError: (error) => {
      console.error('예약 생성 실패:', error);
    },
  });
};

// 예약 삭제 훅
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
    },
    onError: (error) => {
      console.error('예약 삭제 실패:', error);
    },
  });
};
