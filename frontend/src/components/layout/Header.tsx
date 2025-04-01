import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../../store/useAuthStore';

const StyledHeaderBorder = styled.div`
  border-bottom: 1px solid #333;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: #1c1c1e;
  padding: 15px 0;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #0a84ff;
  text-decoration: none;
`;

const StyledNav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;

    li {
      margin: 0 20px;

      a {
        color: #ffffff;
        text-decoration: none;
        font-size: 1.2rem;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
          color: #0a84ff;
        }
      }
    }
  }
`;

const Header = () => {
  const { accessToken, isLoggedIn, setLogin, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setLogin(storedToken, localStorage.getItem('refreshToken'));
    } else {
      logout();
    }
  }, [setLogin, logout]);

  const handleReservationClick = () => {
    if (!accessToken) {
      navigate('/Login');
    } else {
      navigate('/Select');
    }
  };

  return (
    <StyledHeaderBorder>
      <StyledHeader>
        <Logo to="/Main">동방박사</Logo>
        <StyledNav>
          <ul>
            <li>
              <Link onClick={handleReservationClick} to="/Select">
                예약하기
              </Link>
            </li>
            <li>
              <Link to="/Notice">공지사항</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <Link to="/Mypage">마이페이지</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/Login">로그인</Link>
                </li>
                <li>
                  <Link to="/Join">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </StyledNav>
      </StyledHeader>
    </StyledHeaderBorder>
  );
};

export default Header;
