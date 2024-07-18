import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import MainPage from './pages/MainPage';
import Header from './components/layout/Header';
import NoticePage from './pages/NoticePage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import AboutPage from './pages/AboutPage';
import ReservationPage from './pages/ReservationPage';
import SelectPage from './pages/SelectPage';
import MyPage from './pages/MyPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  background-color: #f5f5f7;
`;

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <AppContainer>
          <Header />
          <Content>
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
              <Route path="/writepage" element={<WritePage />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Routes>
          </Content>
        </AppContainer>
      </Router>
    </RecoilRoot>
  );
};

export default App;
