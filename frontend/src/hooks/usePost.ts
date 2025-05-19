import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchNoticeBoards, fetchPostById, createPost, deletePostById } from '../util/api';

// 게시물 목록 가져오는 훅
export const useFetchNoticeBoards = (category: string, cursor: string | null) => {
  return useQuery({
    queryKey: ['noticeBoards', category, cursor],
    queryFn: () => fetchNoticeBoards(category, cursor),
  });
};

// 게시물 조회 훅
export const useFetchPostById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id, // id가 있을 때만 fetch
  });
};

// 게시물 작성 훅
export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {},
    onError: (error) => {
      console.error('게시물 작성 실패:', error);
    },
  });
};

// 게시물 삭제 훅
export const useDeletePostById = () => {
  return useMutation({
    mutationFn: deletePostById,
    onSuccess: () => {},
    onError: (error) => {
      console.error('게시물 삭제 실패:', error);
    },
  });
};
