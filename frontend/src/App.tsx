import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from 'styled-components';
import Header from './components/layout/Header';
import { useAuthStore } from './store/useAuthStore';

// 페이지 컴포넌트들을 레이지 로딩으로 불러오기
const MainPage = React.lazy(() => import('./pages/MainPage'));
const NoticePage = React.lazy(() => import('./pages/NoticePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const JoinPage = React.lazy(() => import('./pages/JoinPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ReservationPage = React.lazy(() => import('./pages/ReservationPage'));
const SelectPage = React.lazy(() => import('./pages/SelectPage'));
const MyPage = React.lazy(() => import('./pages/MyPage'));
const WritePage = React.lazy(() => import('./pages/WritePage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 98vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1c1c1e;
`;

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const App: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContainer>
          <Suspense fallback={<div>로딩 중...</div>}>
            {/* Suspense는 페이지가 로딩 중일 때 보여줄 컴포넌트 */}
            <Content>
              <Header />
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/select" element={<SelectPage />} />
                <Route path="/notice" element={<NoticePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/writepage" element={isLoggedIn ? <WritePage /> : <LoginPage />} />
                <Route path="/post/:id" element={<PostPage />} />
              </Routes>
            </Content>
          </Suspense>
        </AppContainer>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
