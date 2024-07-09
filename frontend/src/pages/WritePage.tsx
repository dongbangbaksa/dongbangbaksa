import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createPost } from '../util/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
      <h1>Write a New Post</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="SUGGESTION">Suggestion</option>
          <option value="NOTICE">Notice</option>
          <option value="EVENT">Event</option>
          {/* 필요한 다른 카테고리 여기에 추가 */}
        </Select>
        <TextArea placeholder="Content" value={context} onChange={(e) => setContext(e.target.value)} required />
        <FileInput type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        <Button type="submit">Submit</Button>
      </form>
    </PageContainer>
  );
};

export default WritePage;
