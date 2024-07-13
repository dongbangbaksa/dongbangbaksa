import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostById, deletePostById } from '../util/api';

const PostContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: #1d1d1f;
  font-weight: 600;
`;

const Content = styled.p`
  font-size: 18px;
  color: #515154;
  line-height: 1.8;
  margin-bottom: 30px;
`;

const Image = styled.img`
  width: 100%;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  width: 120px;
  height: 45px;
  border-radius: 6px;
  border: none;
  background-color: #0071e3;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }

  &:first-child {
    background-color: #f0f0f5;
    color: #0071e3;

    &:hover {
      background-color: #e5e5ea;
    }
  }
`;

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePostById(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <PostContainer>
      <Title>{post.title}</Title>
      <Content>{post.context}</Content>
      {post.imageUrls &&
        post.imageUrls.map((url: string, index: number) => (
          <Image key={index} src={url} alt={`Post Image ${index + 1}`} />
        ))}
      <ButtonContainer>
        <Button onClick={() => navigate('/Notice')}>뒤로가기</Button>
        <Button onClick={handleDelete}>삭제</Button>
      </ButtonContainer>
    </PostContainer>
  );
};

export default PostPage;
