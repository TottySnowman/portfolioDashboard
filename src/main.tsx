import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/projects.tsx";
import SignInPage from "./pages/signIn.tsx";
import ProtectedRoute from "./pages/protectedRoute.tsx";
import Tags from "./pages/tags.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import CvPage from "./pages/cv.tsx";
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/signIn" element={<SignInPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <Tags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute>
                <CvPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
     </ThemeProvider>
    </Provider>
  </StrictMode>,
);
