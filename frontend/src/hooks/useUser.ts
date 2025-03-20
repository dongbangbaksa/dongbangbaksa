import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUserInfo, signInUser, signOutUser } from '../util/api';

// 유저 정보 가져오는 훅
export const useFetchUserInfo = () => {
  return useQuery('userInfo', fetchUserInfo);
};

// 로그인 훅
export const useSignIn = () => {
  return useMutation(
    (variables: { email: string; password: string }) => signInUser(variables.email, variables.password),
    {
      onSuccess: () => {
        // 로그인 성공 시 처리
      },
      onError: (error) => {
        console.error('로그인 실패:', error);
      },
    },
  );
};

// 로그아웃 훅
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation(signOutUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('userInfo');
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
    },
  });
};
