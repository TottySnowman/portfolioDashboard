import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { useAppSelector } from '../store/hooks';

interface signInForm {
  username: string;
  password: string;
}
function SignInForm() {
  const dispatch = useDispatch();
    const token = useAppSelector((state) => state.auth.token);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  
  const handleButton = () =>{
    console.log(token)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: signInForm = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:6001/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        // Dispatch the loginSuccess action with the token and user data
        dispatch(
          loginSuccess({
            token: data.token,
          }),
        );
      } else {
        // Handle login error (e.g., invalid credentials)
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
    console.log(requestBody);
  };
  return (
    <div className="container flex flex-col justify-center items-center p-2">
      <button onClick={handleButton}>Handle the button</button>
      <h2 className="text-xl">Sign in</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center border"
      >
        <input
          type="text"
          className="form-control"
          id="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit" className="bg-sky-600 p-5 rounded-md">
          Log in
        </button>
      </form>
    </div>
  );
}

export default SignInForm;
