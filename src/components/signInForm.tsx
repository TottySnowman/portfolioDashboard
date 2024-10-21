import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";

interface signInForm {
  username: string;
  password: string;
}
function SignInForm() {
  const dispatch: AppDispatch = useDispatch();
   const authState = useSelector((state: RootState) => state.auth);


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody: signInForm = {
      username: username,
      password: password,
    };
    dispatch(signIn(requestBody));
    console.log(requestBody);
  };
  return (
    <div className="container flex flex-col justify-center items-center p-2">
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
      {authState.loading && <p>Loading...</p>}
      {authState.error && <p>Error: {authState.error}</p>}
      {authState.isAuthenticated && <p>Authenticated</p>}
    </div>
  );
}

export default SignInForm;
