import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../util/axiosConfig';
import styled from 'styled-components';

const Button = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #232323;
  background-color: #232323;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/boards/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // ID가 변경될 때마다 호출합니다.

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/boards/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.context}</p>
      {post.imageUrls &&
        post.imageUrls.map((url: string, index: number) => (
          <img key={index} src={url} alt="Post Image" style={{ width: '100%', marginBottom: '10px' }} />
        ))}
      <Button onClick={handleDelete}>삭제</Button>
    </div>
  );
};

export default PostPage;
