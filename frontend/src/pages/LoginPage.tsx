import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useSetRecoilState } from 'recoil';
import { accessTokenState, refreshTokenState, isLoggedInState } from '../recoil/recoilState';
import { signInUser } from '../util/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f8f8;
`;

const FormContainer = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const LoginText = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  font-size: 16px;
`;

const PasswordInput = styled(Input).attrs({ type: 'password', autoComplete: 'current-password' })``;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0071e3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await signInUser(email, password);
      const accessTokenFromHeader = response.headers['authorization'];
      const refreshTokenFromHeader = response.headers['refresh-token'];

      if (accessTokenFromHeader && accessTokenFromHeader.startsWith('Bearer ')) {
        const accessToken = accessTokenFromHeader.split(' ')[1];
        localStorage.setItem('accessToken', accessToken);
        setAccessToken(accessToken);
        console.log('Access Token saved:', localStorage.getItem('accessToken')); // 저장된 액세스 토큰 확인
      } else {
        console.error('No access token received');
      }

      if (refreshTokenFromHeader) {
        localStorage.setItem('refreshToken', refreshTokenFromHeader);
        setRefreshToken(refreshTokenFromHeader);
        console.log('Refresh Token saved:', localStorage.getItem('refreshToken')); // 저장된 리프레시 토큰 확인
        setIsLoggedIn(true);
      } else {
        console.error('No refresh token received');
        alert('로그인 성공, 하지만 리프레시 토큰을 받지 못했습니다. 다시 로그인해주세요.');
        setIsLoggedIn(false);
        navigate('/login'); // 리프레시 토큰이 없다면 다시 로그인을 유도
        return;
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  const closeModalAndRedirect = () => {
    setIsModalOpen(false);
    navigate('/main');
  };

  return (
    <Container>
      <Modal isOpen={isModalOpen} onClose={closeModalAndRedirect}>
        <p>로그인이 완료 되었습니다.</p>
      </Modal>
      <FormContainer>
        <LoginText>로그인</LoginText>
        <StyledForm onSubmit={handleLogin}>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input type="email" id="email" name="email" value={email} onChange={handleEmailChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <PasswordInput id="password" name="password" value={password} onChange={handlePasswordChange} />
          </FormGroup>
          <LoginButton type="submit">로그인</LoginButton>
        </StyledForm>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;
