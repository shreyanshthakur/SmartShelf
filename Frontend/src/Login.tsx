import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      <h1>SmartShelf</h1>
      <form>
        <div>
          <label>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
      </form>

      <button id="LoginButton">Login</button>
      <br></br>
      <div>
        <p>Create a new account</p>
        <button id="SignUpButton">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
