import React, { useState } from 'react';
import styled from 'styled-components';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { requestEmailVerification, confirmEmailVerification, signUpUser } from '../util/api';

const JoinText = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #3a3a3a;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const LoginText = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: #585858;
  text-align: center;
  margin-bottom: 20px;
`;

const LoginLink = styled(Link)`
  font-size: 16px;
  font-weight: 300;
  color: #0071e3;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #005bb5;
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const Select = styled.select`
  border: 1px solid #e4e4e4;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  width: 100%;
`;

const Input = styled.input`
  border: 1px solid #e4e4e4;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  border: none;
  background-color: #0071e3;
  color: #ffffff;
  font-size: 16px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  width: 100%;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
`;

const JoinPage: React.FC = () => {
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [name, setName] = useState('');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
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
      setVerificationMessage('인증이 완료되었습니다.');
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
      <JoinText>가입하기</JoinText>
      <LoginText>
        이미 계정이 있습니까? <LoginLink to="/login">로그인</LoginLink>
      </LoginText>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="affiliation">소속</Label>
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
            <Label htmlFor="name">이름</Label>
            <Input type="text" id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="button" onClick={handleSendCodeClick} disabled={!email}>
              인증
            </Button>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="authCode">인증코드</Label>
            <Input
              type="text"
              id="authCode"
              name="authCode"
              value={authCode}
              onChange={(event) => setAuthCode(event.target.value)}
            />
            <Button type="button" onClick={handleConfirmAuthClick} disabled={!authCode}>
              인증확인
            </Button>
            <div>{verificationMessage}</div>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button type="submit">가입하기</Button>
          </div>
        </StyledForm>
      </FormContainer>
    </>
  );
};

export default JoinPage;
