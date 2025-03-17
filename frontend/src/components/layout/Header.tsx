import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { accessTokenState, isLoggedInState } from '../../recoil/recoilState';

const StyledHeaderBorder = styled.div`
  border-bottom: 1px solid #333;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: #1c1c1e;
  padding: 10px 0;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
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
      margin: 0 15px;

      a {
        color: #ffffff;
        text-decoration: none;
        font-size: 1rem;
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
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
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
        <Logo to="/Main">동방박사</Logo>
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
