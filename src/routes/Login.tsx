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
import GithubButton from "../components/GithubBtn";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

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
        <Input
          {...register("email", { required: "이메일을 입력하세요" })}
          placeholder='이메일'
          type='email'
        />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input
          {...register("password", { required: "비밀번호를 입력하세요" })}
          placeholder='비밀번호'
          type='password'
        />
        {errors.password && <Error>{errors.password.message}</Error>}

        <Input type='submit' value={isSubmitting ? "Loading..." : "Login"} />
      </Form>

      <Switcher>
        아직 회원이 아니신가요?<Link to='/signup'>회원가입 &rarr;</Link> <br />
        <br />
        비밀번호를 잊으셨나요?<Link to='/resetpwd'> 비밀번호 변경 &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
