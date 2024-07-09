import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import MainPage from './pages/MainPage';
import Header from './components/layout/Header';
import NoticePage from './pages/NoticePage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import ReservationPage from './pages/ReservationPage';
import SelectPage from './pages/SelectPage';
import MyPage from './pages/MyPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <div>
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
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/writepage" element={<WritePage />} />
            <Route path="/post/:id" element={<PostPage />} />
          </Routes>
        </div>
      </Router>
    </RecoilRoot>
  );
};

export default App;
