import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchNoticeBoards } from '../util/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  padding: 20px;
  padding-top: 700px;
  background-color: #1c1c1e;
  color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const WriteButton = styled.button`
  padding: 14px 28px;
  background-color: #0a84ff;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  &:hover {
    background-color: #0071e3;
  }
`;

const Box = styled.div`
  width: 100%;
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    background: #3a3a3c;
    transform: scale(1.05);
    box-shadow: 0px 6px 20px rgba(10, 132, 255, 0.4);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 12px;
  color: #f5f5f7;
`;

const Content = styled.div`
  font-size: 16px;
  color: #a1a1a1;
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
      const response = await fetchNoticeBoards('NOTICE', cursor);
      console.log('API response:', response);
      const { values, hasNext, cursor: newCursor } = response;

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

  const ContentWrapper = styled.div`
    width: 100%;
    padding-top: 20px; /* h1과 겹치지 않도록 조정 */
  `;

  return (
    <PageContainer>
      <h1>공지사항</h1> {/* 스크롤하면 자연스럽게 사라짐 */}
      <ContentWrapper>
        {data.map((item) => (
          <StyledLink to={`/Post/${item.boardId}`} key={item.boardId}>
            <Box>
              <Title>{item.title}</Title>
              <Content>{item.context}</Content>
            </Box>
          </StyledLink>
        ))}
      </ContentWrapper>
      {loading && <p>Loading...</p>}
      {hasMore && <div ref={lastElementRef} />}
      <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
    </PageContainer>
  );
};

export default NoticePage;
