import React, { useState } from 'react';
import styled from 'styled-components';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { requestEmailVerification, confirmEmailVerification, signUpUser } from '../util/api';

const JoinText = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: #3a3a3a;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 0px;
`;
const LoginText = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: #585858;
  text-align: center;
`;
const LoginLink = styled(Link)`
  font-size: 20px;
  font-weight: 300;
  color: #ffe8f6;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #ffe8f6;
  }
`;
const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  color: #585858;
`;
const StyledForm = styled.form``;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const Select = styled.select`
  border-radius: 0;
  border: 0.7px solid #c0c0c0;
  color: #585858;
  height: 30px;
  width: 405px;
`;
const Input = styled.input`
  border-radius: 0;
  border: 0.7px solid #c0c0c0;
  height: 26px;
  width: 400px;
`;
const JoinButton = styled.button`
  border: none;
  background-color: #c0c0c0;
  color: #ffffff;
  font-size: 16px;
  height: 26px;
  width: 100%;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #000000;
  }
`;
const SendCodeButton = styled(JoinButton)`
  border: none;
  background-color: #c0c0c0;
  font-size: 15px;
  height: 24px;
  &:hover {
    background-color: black;
    border-color: black;
  }
`;
const ConfirmAuthButton = styled(SendCodeButton)`
  border: none;
  height: 24px;
`;
const EmailInput = styled(Input).attrs({ type: 'email', autoComplete: 'email' })`
  margin-bottom: 10px;
  border-radius: 0;
`;
const AuthCodeInput = styled(Input).attrs({ autoComplete: 'off' })`
  margin-bottom: 10px;
  border-radius: 0;
`;
const PasswordInput = styled(Input).attrs({ type: 'password', autoComplete: 'new-password' })`
  margin-bottom: 0px;
  border-radius: 0;
`;

const JoinPage: React.FC = () => {
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [name, setName] = useState('');
  const [verificationMessage] = useState<string>('');
  const [, setIsPasswordMatch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  const handleSendCodeClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      await requestEmailVerification(email);
      setIsModalOpen(true);
      setModalContent('이메일로 인증번호가 전송되었습니다.');
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        console.error('코드 전송 중 에러:', (error as AxiosError).message);
      } else {
        console.error('코드 전송 중 에러:', error);
      }
    }
  };

  const handleConfirmAuthClick = async () => {
    try {
      const response = await confirmEmailVerification(email, authCode);
      setIsModalOpen(true);
      setModalContent(response.message);
    } catch (error) {
      console.error('인증 확인 중 에러:', (error as AxiosError).message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setIsPasswordMatch(false);
      setModalContent('비밀번호가 일치하지 않습니다.');
      setIsModalOpen(true);
      return;
    } else {
      setIsPasswordMatch(true);
    }

    try {
      await signUpUser(affiliation, name, email, password);
      setIsModalOpen(true);
      setModalContent('회원가입이 완료되었습니다.');
    } catch (error) {
      console.error('서버로의 데이터 전송 중 에러:', error);
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
      <JoinText className="join">가입하기</JoinText>
      <LoginText className="already">
        이미 계정이 있습니까?{' '}
        <LoginLink to="/login" className="login">
          로그인
        </LoginLink>
        하기
      </LoginText>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="affiliation">소속</label>
            <Select
              id="affiliation"
              name="affiliation"
              value={affiliation}
              onChange={(event) => setAffiliation(event.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="Techeer">Techeer</option>
              <option value="TecheerPartners">Techeer Partners</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <label htmlFor="name">이름</label>
            <Input type="text" id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">이메일</label>
            <EmailInput id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <SendCodeButton onClick={handleSendCodeClick}>{'인증'}</SendCodeButton>
          </FormGroup>
          <FormGroup>
            <label htmlFor="authCode">인증코드</label>
            <AuthCodeInput
              id="authCode"
              name="authCode"
              value={authCode}
              onChange={(event) => setAuthCode(event.target.value)}
            />
            <ConfirmAuthButton onClick={handleConfirmAuthClick}>{'인증확인'}</ConfirmAuthButton>
            <div>{verificationMessage}</div>
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">비밀번호</label>
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <PasswordInput
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <JoinButton>{'가입하기'}</JoinButton>
          </div>
        </StyledForm>
      </FormContainer>
    </>
  );
};
export default JoinPage;
