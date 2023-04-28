import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { UserContext } from "./UserContext";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);

  // 훅을 사용하여 컴포넌트가 랜더링될 때마다 'fetch'함수를 실행
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      // 쿠키 정보를 서버에 보내기 위한 설정
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  // 빈 배열이 두번째 인자로 전달되므로 컴포넌트가 처음 렌더링될 때 한번만 실행
  }, []);

  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return(
    <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
          {username && (
            <>
              <span>{username}</span>
              <Link to="/create">Create new post</Link>
              <Link onClick={logout}>Logout</Link>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
  );
}