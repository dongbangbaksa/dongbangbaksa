import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { accessTokenState, isLoggedInState } from '../../recoil/recoilState';

const StyledHeaderBorder = styled.div`
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  font-size: 16px;
  width: 100%;
  height: 64px;
  font-weight: 500;
`;

const StyledNav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
    li {
      margin: 0 20px;
      a {
        color: #333333;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const Header = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true); // 로그인 상태 설정
    } else {
      setIsLoggedIn(false); // 로그아웃 상태 설정
    }
  }, [setAccessToken, setIsLoggedIn]);

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
        <StyledNav>
          <ul>
            <li>
              <Link to="/Main">Home</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>
              <Link onClick={handleReservationClick} to="/Select">
                Reservation
              </Link>
            </li>
            <li>
              <Link to="/Notice">Notice</Link>
            </li>
            {isLoggedIn ? (
              <li>
                <Link to="/Mypage">Mypage</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/Login">Login</Link>
                </li>
                <li>
                  <Link to="/Join">Join</Link>
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
