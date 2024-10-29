import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

interface signInForm {
  username: string;
  password: string;
}
function SignInForm() {
  const dispatch: AppDispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
  };

  useEffect(() => {
    if (authState.token) {
      navigate("/");
    }
  }, [authState.token, navigate]);

  return (
    <div className="container flex flex-col justify-center items-center p-2">
      <h2 className="text-xl">Sign in</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 justify-center items-center border"
      >
        <TextField
          type="text"
          label="Username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          placeholder="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <Button variant="contained" type="submit">
          Sign in
        </Button>
      </form>
      {authState.loading && <p>Loading...</p>}
      {authState.error && <p>Error: {authState.error}</p>}
    </div>
  );
}

export default SignInForm;
