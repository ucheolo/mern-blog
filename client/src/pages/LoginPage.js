import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState('');
  const {setUserInfo} = useContext(UserContext);

  async function login(ev){
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      // JSON.stringify : JavaScript 값이나 객체를 JSON 문자열로 변환합니다
      body: JSON.stringify({username, password}),
      //요청 헤더를 Content-Type을 application/json으로 지정
      headers: {'Content-Type':'application/json'},
      //서버에 요청을 보낼 때, 요청에 사용되는 쿠키와 같은 인증 정보를 자동으로 포함하도록 지정하는 옵션
      credentials: 'include',
    });
    if(response.ok){
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    }else{
      alert('비밀번호가 틀렸습니다.');
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <div>
      <form className="login" onSubmit={login}>
        <h1>Login</h1>
        <input 
          type="text" 
          placeholder="username" 
          value={username} 
          onChange={ev => setUsername(ev.target.value)}/>
        <input 
          type="password" 
          placeholder="password" 
          value={password} 
          onChange={ev => setPassword(ev.target.value)}/>
        <button>Login</button>
      </form>
    </div>
  );
}