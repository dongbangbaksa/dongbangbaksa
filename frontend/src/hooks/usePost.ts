import { useQuery, useMutation } from 'react-query';
import { fetchNoticeBoards, fetchPostById, createPost, deletePostById } from '../util/api';

// 게시물 목록 가져오는 훅
export const useFetchNoticeBoards = (category: string, cursor: string | null) => {
  return useQuery(['noticeBoards', category, cursor], () => fetchNoticeBoards(category, cursor));
};

// 게시물 조회 훅
export const useFetchPostById = (id: string | undefined) => {
  return useQuery(['post', id], () => fetchPostById(id));
};

// 게시물 작성 훅
export const useCreatePost = () => {
  return useMutation(createPost, {
    onSuccess: () => {
      // 게시물 작성 성공 시 처리
    },
    onError: (error) => {
      console.error('게시물 작성 실패:', error);
    },
  });
};

// 게시물 삭제 훅
export const useDeletePostById = () => {
  return useMutation(deletePostById, {
    onSuccess: () => {
      // 게시물 삭제 후 처리
    },
    onError: (error) => {
      console.error('게시물 삭제 실패:', error);
    },
  });
};
