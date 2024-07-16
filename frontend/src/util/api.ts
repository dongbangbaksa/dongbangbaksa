import axiosInstance from './axiosConfig';

// 로그인 상태 확인 API 호출 함수
export const checkLoginStatus = async (): Promise<{ loggedIn: boolean }> => {
  try {
    const response = await axiosInstance.get('/api/users/login-confirm');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 인증 요청 함수
export const requestEmailVerification = async (email: string): Promise<void> => {
  try {
    await axiosInstance.post('/api/email/verification/request', { email });
  } catch (error) {
    throw error;
  }
};

// 인증 코드 확인 함수
export const confirmEmailVerification = async (email: string, code: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post('/api/email/verification/confirm', { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 회원 가입 함수
export const signUpUser = async (affiliation: string, name: string, email: string, password: string): Promise<void> => {
  try {
    await axiosInstance.post('/api/user/sign-up', { affiliation, name, email, password });
  } catch (error) {
    throw error;
  }
};

// 로그인 API 호출 함수
export const signInUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/user/sign-in', { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

// 예약 정보 조회 API 호출 함수
export const fetchReservations = async () => {
  try {
    const response = await axiosInstance.get('/api/reservation/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 예약 삭제 API 호출 함수
export const deleteReservation = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/reservation/${id}`);
  } catch (error) {
    throw error;
  }
};

// 로그아웃 API 호출 함수
export const signOutUser = async () => {
  try {
    await axiosInstance.post('/api/users/sign-out');
  } catch (error) {
    throw error;
  }
};

// 공지사항 게시물 데이터 조회 API 호출 함수
export const fetchNoticeBoards = async (category: string, cursor: string | null) => {
  try {
    const cursorParam = cursor ? `&cursor=${cursor}` : '&cursor=0';
    const url = `/api/boards?category=${category}${cursorParam}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 게시물 조회 API 호출 함수
export const fetchPostById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/api/boards/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 게시물 삭제 API 호출 함수
export const deletePostById = async (id: string | undefined) => {
  try {
    await axiosInstance.delete(`/api/boards/${id}`);
  } catch (error) {
    throw error;
  }
};

// 예약 생성 API 호출 함수
export const createReservation = async (reservationData: {
  reservationStartTime: string;
  reservationEndTime: string;
  members: number;
  meetingRoomId: number;
}) => {
  try {
    const response = await axiosInstance.post('/api/reservation', reservationData);
    return response;
  } catch (error) {
    throw error;
  }
};

// 게시물 작성 API 호출 함수
export const createPost = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/api/boards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
