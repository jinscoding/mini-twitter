import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./routes/Home"
import Profile from "./routes/Profile"
import Login from "./routes/Login"
import Signup from "./routes/Signup"
import styled, { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/LoadingScreen"
import { auth } from "./firebase"
import ProtectedRoute from "./components/ProtectedRoute"
import ResetPwd from "./routes/ResetPwd"

const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Home />
        ),
      },
      {
        path: "profile",
        element: (
          <Profile />
        ),
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path:"/resetpwd",
    element: <ResetPwd />
  }
])

const GlobalStyles = createGlobalStyle`
${reset};
*{
  box-sizing: border-box;
}
body {
  background-color: #87CEFA;
  color:white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Sege UI",
  Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetice Neue",
  sans-serif;
}`

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, [])
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
