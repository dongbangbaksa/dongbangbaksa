import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchReservations, createReservation, deleteReservation } from '../util/api';

// 예약 목록 가져오는 훅
export const useFetchReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  });
};

// 예약 생성 훅
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error) => {
      console.error('예약 생성 실패:', error);
    },
  });
};

// 예약 삭제 훅
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error) => {
      console.error('예약 삭제 실패:', error);
    },
  });
};
