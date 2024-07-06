import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../util/axiosConfig';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const Box = styled.div`
  width: 100%;
  height: 180px;
  background-color: #ffffff;
  border: 1px solid #e4e4e4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px;
  margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

const Title = styled.div`
  font-weight: bold;
  color: #000000;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: left;
  margin-top: 10px;
  margin-left: 10px;
`;

const Content = styled.div`
  color: #575757;
  font-size: 14px;
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const WriteButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: calc(33.333% - 14px);
  margin-right: 0;
`;

interface BoardItem {
  boardId: number;
  author: string;
  authorEmail: string;
  category: string;
  title: string;
  context: string;
  viewCount: number;
  commentCount: number;
  imageUrls: string[];
  createdAt: string;
  id: number;
}

const NoticePage: React.FC = () => {
  const [data, setData] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      console.log('Access token or refresh token is missing. Redirecting to login.');
      navigate('/login');
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (cursor) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { threshold: 1.0 },
      );

      if (lastElementRef.current) {
        observer.current.observe(lastElementRef.current);
      }
    }

    return () => observer.current?.disconnect();
  }, [loading, hasMore, cursor]);

  const fetchData = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const cursorParam = cursor ? `&cursor=${cursor}` : '&cursor=0';
      const url = `/api/boards?category=NOTICE${cursorParam}`;

      const response = await axios.get(url);
      console.log('API response:', response.data);
      const { values, hasNext, cursor: newCursor } = response.data;

      if (!values || values.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => {
          const newDataIds = new Set(values.map((item: BoardItem) => item.boardId));
          const filteredPrevData = prevData.filter((item) => !newDataIds.has(item.boardId));
          return [...filteredPrevData, ...values];
        });
        setCursor(newCursor);
        setHasMore(hasNext);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('An error occurred while loading data.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchData();
  };

  const handleWriteClick = () => {
    navigate('/WritePage');
  };

  return (
    <>
      <PageContainer>
        <WriteButton onClick={handleWriteClick}>Write Post</WriteButton>
        {data.length > 0 ? (
          data.map((item) => (
            <StyledLink to={`/Post/${item.boardId}`} key={item.boardId}>
              <Box>
                <Title>{item.title}</Title>
                <Content>{item.context}</Content>
              </Box>
            </StyledLink>
          ))
        ) : (
          <p>No posts available.</p>
        )}
        {loading && <p>Loading...</p>}
        {hasMore && <div ref={lastElementRef} />}
      </PageContainer>
    </>
  );
};

export default NoticePage;
