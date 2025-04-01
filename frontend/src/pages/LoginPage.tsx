import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { signInUser } from '../util/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1d1d1e;
`;

const FormContainer = styled.div`
  max-width: 800px;
  width: 100%;
  padding: 70px;
  background-color: #2c2c2e;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
`;

const LoginText = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #f5f5f7;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: 1px solid #636366;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 10px;
  background-color: #3a3a3c;
  color: #f5f5f7;
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
  color: #f5f5f7;
`;

const LoginButton = styled.button`
  border: none;
  background-color: #0a84ff;
  color: white;
  font-size: 16px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #0071e3;
  }

  &:disabled {
    background-color: #636366;
    cursor: not-allowed;
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setLogin } = useAuthStore();

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

      if (accessTokenFromHeader && accessTokenFromHeader.startsWith('Bearer ') && refreshTokenFromHeader) {
        const accessToken = accessTokenFromHeader.split(' ')[1];

        // Zustand 상태 업데이트
        setLogin(accessToken, refreshTokenFromHeader);

        console.log('Access Token saved:', accessToken);
        console.log('Refresh Token saved:', refreshTokenFromHeader);

        setIsModalOpen(true);
      } else {
        console.error('No valid tokens received');
        alert('로그인에 실패했습니다. 다시 로그인해주세요.');
        return;
      }
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
