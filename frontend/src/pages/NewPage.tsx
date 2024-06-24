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

const NewPage: React.FC = () => {
  const { id } = useParams(); // URL에서 ID 값을 가져옵니다.
  const [post, setPost] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/boards/${id}`);
        setPost(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost(); // 컴포넌트가 마운트될 때 게시글을 불러옵니다.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // ID가 변경될 때마다 호출합니다.

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/boards/${id}`);
      navigate('/'); // 삭제 후 홈페이지로 이동
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.context}</p>
      <Button onClick={handleDelete}>삭제</Button>
    </div>
  );
};

export default NewPage;
