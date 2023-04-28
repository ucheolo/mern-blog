import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost(){
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data, 
      //fetch 요청을 보낼 때 요청 헤더에 쿠키나 인증 토큰과 같은 정보를 함께 보낸다.
      credentials: 'include',
    });
    if(response.ok){
      setRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  return(
    <form onSubmit={createNewPost}>
      <input 
        type="title" 
        placeholder={'Title'} 
        value={title}
        onChange={ev => setTitle(ev.target.value)}/>
      <input 
        type="summary" 
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}/>
      <input type="file" onChange={ev => setFiles(ev.target.files)}/>
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Create Post</button>
    </form>
  );
}