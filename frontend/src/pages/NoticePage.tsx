import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchNoticeBoards } from '../util/api';

const ContentWrapper = styled.div`
  width: 100%;
  padding-top: 20px;
`;

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
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
      navigate('/login');
      return;
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!cursor) return;
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchData();
        }
      },
      { threshold: 1.0 },
    );

    const target = lastElementRef.current;
    if (target) observer.current.observe(target);

    return () => {
      if (target) observer.current?.unobserve(target);
    };
  }, [cursor, hasMore, loading]);

  const fetchData = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await fetchNoticeBoards('NOTICE', cursor);
      const { values, hasNext, cursor: newCursor } = res;

      setData((prev) => {
        const existingIds = new Set(prev.map((item) => item.boardId));
        const newItems = values.filter((item: BoardItem) => !existingIds.has(item.boardId));
        return [...prev, ...newItems];
      });

      setCursor(newCursor);
      setHasMore(hasNext);
    } catch (e) {
      console.error('공지사항 로딩 실패:', e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteClick = () => {
    navigate('/WritePage');
  };

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
