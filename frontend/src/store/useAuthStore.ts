import { create } from 'zustand';

const getAccessTokenFromLocalStorage = () => localStorage.getItem('accessToken');
const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refreshToken');

// 상태를 정의하는 인터페이스
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean; // 로그인 여부
  userInfo: any; // 사용자 정보
  setAccessToken: (token: string | null) => void; // 액세스 토큰 설정 함수
  setRefreshToken: (token: string | null) => void; // 리프레시 토큰 설정 함수
  setUserInfo: (user: any) => void; // 사용자 정보 설정 함수
  setLogin: (accessToken: string | null, refreshToken: string | null) => void; // 로그인 상태 설정 함수
  logout: () => void; // 로그아웃 함수
}

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getAccessTokenFromLocalStorage(), // 초기 액세스 토큰을 로컬 스토리지에서 가져옴
  refreshToken: getRefreshTokenFromLocalStorage(), // 초기 리프레시 토큰을 로컬 스토리지에서 가져옴
  isLoggedIn: Boolean(getAccessTokenFromLocalStorage() && getRefreshTokenFromLocalStorage()), // 로그인 상태 체크
  userInfo: null, // 사용자 정보 초기화

  // 액세스 토큰을 설정하고 로컬 스토리지에 저장
  setAccessToken: (token) =>
    set(() => {
      if (token) {
        localStorage.setItem('accessToken', token); // 로컬 스토리지에 액세스 토큰 저장
      } else {
        localStorage.removeItem('accessToken'); // 액세스 토큰이 없으면 로컬 스토리지에서 삭제
      }
      return { accessToken: token, isLoggedIn: !!token }; // 상태 업데이트
    }),

  // 리프레시 토큰을 설정하고 로컬 스토리지에 저장
  setRefreshToken: (token) =>
    set(() => {
      if (token) {
        localStorage.setItem('refreshToken', token); // 로컬 스토리지에 리프레시 토큰 저장
      } else {
        localStorage.removeItem('refreshToken'); // 리프레시 토큰이 없으면 로컬 스토리지에서 삭제
      }
      return { refreshToken: token }; // 상태 업데이트
    }),

  // 사용자 정보를 설정
  setUserInfo: (user) => set(() => ({ userInfo: user })),

  // 로그인 시 토큰을 로컬 스토리지에 저장
  setLogin: (accessToken, refreshToken) =>
    set(() => {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('accessToken'); // 액세스 토큰 없으면 로컬 스토리지에서 삭제
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken'); // 리프레시 토큰 없으면 로컬 스토리지에서 삭제
      }

      return {
        accessToken,
        refreshToken,
        isLoggedIn: !!accessToken && !!refreshToken, // 로그인 상태 업데이트
      };
    }),

  // 로그아웃 시 로컬 스토리지에서 토큰을 삭제 및 상태 초기화
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null, isLoggedIn: false, userInfo: null });
  },
}));
