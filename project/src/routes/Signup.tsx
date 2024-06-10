import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
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
  name?: string;
  email: string;
  password?: string;
}


export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email, password, name } = data;
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password!);
        await updateProfile(credentials.user, { displayName: name });
        navigate("/login");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.message);
      }
    }
  };



  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name", { required: "이름을 입력하세요" })} placeholder="이름" type="text" />
        {errors.name && <Error>{errors.name.message}</Error>}

        <Input {...register("email", { required: "이메일을 입력하세요"   })} placeholder="이메일" type="email" />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input {...register("password", { required: "비밀번호를 입력하세요" })} placeholder="비밀번호" type="password" />
        {errors.password && <Error>{errors.password.message}</Error>}

        <Input type="submit" value={isSubmitting ? "Loading..." : "Create Account"} />
      </Form>

      <Switcher>
        이미 계정이 있으신가요? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
