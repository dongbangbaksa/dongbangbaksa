import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createPost } from '../util/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f7;
  min-height: 100vh;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  min-height: 150px;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
`;

const Select = styled.select`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #0071e3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const WritePage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('SUGGESTION');
  const [context, setContext] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      'boardRequestOnlyJson',
      new Blob(
        [
          JSON.stringify({
            title,
            category,
            context,
          }),
        ],
        { type: 'application/json' },
      ),
    );

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      await createPost(formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  return (
    <PageContainer>
      <h1>글쓰기</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="SUGGESTION">Suggestion</option>
          <option value="NOTICE">Notice</option>
          <option value="EVENT">Event</option>
          {/* 필요한 다른 카테고리 여기에 추가 */}
        </Select>
        <TextArea placeholder="내용" value={context} onChange={(e) => setContext(e.target.value)} required />
        <FileInput type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        <Button type="submit">작성하기</Button>
      </form>
    </PageContainer>
  );
};

export default WritePage;
