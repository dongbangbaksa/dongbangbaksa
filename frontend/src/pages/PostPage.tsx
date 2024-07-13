import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostById, deletePostById } from '../util/api';

const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Content = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100%;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #232323;
  background-color: #232323;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #444;
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
        <Button onClick={() => navigate('/')}>뒤로가기</Button>
        <Button onClick={handleDelete}>삭제</Button>
      </ButtonContainer>
    </PostContainer>
  );
};

export default PostPage;
