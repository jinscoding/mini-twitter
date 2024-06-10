// import { useState } from "react";
// import { auth } from "../firebase";
// import { Link, useNavigate } from "react-router-dom";
// import { FirebaseError } from "firebase/app";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import {
//   Error,
//   Form,
//   Input,
//   Switcher,
//   Title,
//   Wrapper,
// } from "../components/auth-components";
// import GithubButton from "../components/GithubBtn";

// export default function Login() {
//   const navigate = useNavigate();
//   const [isLoading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const {
//       target: { name, value },
//     } = e;
//     if (name === "email") {
//       setEmail(value);
//     } else if (name === "password") {
//       setPassword(value);
//     }
//   };
//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     if (isLoading || email === "" || password === "") return;
//     try {
//       setLoading(true);
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/");
//     } catch (e) {
//       if (e instanceof FirebaseError) {
//         setError(e.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Wrapper>
//       <Title>로그인</Title>
//       <Form onSubmit={onSubmit}>
//         <Input
//           onChange={onChange}
//           name="email"
//           value={email}
//           placeholder="Email"
//           type="email"
//           required
//         />
//         <Input
//           onChange={onChange}
//           value={password}
//           name="password"
//           placeholder="Password"
//           type="password"
//           required
//         />
//         <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
//       </Form>
//       {error !== "" ? <Error>{error}</Error> : null}
//       <Switcher>
//         Don't have an account?{" "}
//         <Link to="/signup">Create one &rarr;</Link>
//       </Switcher>
//       <GithubButton />
//     </Wrapper>
//   );
// }

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.message);
      }
    }
  };

  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("email", { required: "이메일을 입력하세요" })} placeholder="이메일" type="email" />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input {...register("password", { required: "비밀번호를 입력하세요" })} placeholder="비밀번호" type="password" />
        {errors.password && <Error>{errors.password.message}</Error>}

        <Input type="submit" value={isSubmitting ? "Loading..." : "Login"} />
      </Form>

      <Switcher>
        아직 회원이 아니신가요?<Link to="/signup">회원가입 &rarr;</Link> <br/><br/>
      </Switcher>
    </Wrapper>
  );
}
