import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/recoilState';

const StyledHeaderBorder = styled.div`
  border-bottom: 1px solid #dddddd;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  font-size: 20px;
  width: 100%;
`;

const StyledNav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    justify-content: space-around;
    padding: 0;
    li {
      margin: 0 30px;
      a {
        color: black;
        text-decoration: none;
      }
    }
  }
`;

const Header = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const navigate = useNavigate();

  // 로컬 스토리지에서 accessToken을 가져와 설정
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, [setAccessToken]);

  // handleReservationClick에서 액세스 토큰을 콘솔 로그에 출력
  const handleReservationClick = () => {
    console.log('Access Token:', accessToken);
    // 액세스 토큰이 없으면 로그인 페이지로 이동
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
            {accessToken ? (
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
