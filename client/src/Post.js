export default function Post(){
  return (
    <div className="post">
      <div className="image">
        <img src="https://techcrunch.com/wp-content/uploads/2022/12/lawnmower-Large.jpeg?w=990&crop=1"></img>
      </div>
      <div className="texts">
        <h2>Full-house battery backup coming later this year</h2>
        <p className="info">
          <a className="author">UC</a>
          <time>2023-04-20 11:12</time>
        </p>
        <p className="summary">At CES, the company launches battery backup, a lawn mower, a portable A/C and a portable fridge</p>
      </div>
    </div>
  );
}