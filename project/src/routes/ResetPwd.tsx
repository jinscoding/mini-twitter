import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import {  Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  Error,
  Switcher,
  Input,
  Title,
  Wrapper,
} from "../components/auth-components";


interface FormData {
  name?: string;
  email: string;
  password?: string;
}



export default function ResetPwd() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email } = data;
    try {
            await sendPasswordResetEmail(auth, email);
            alert("비밀번호 재설정 이메일이 전송되었습니다.");
            navigate("/login");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.message);
      }
    }
  };



  return (
    <Wrapper>
      <Title>비밀번호 변경</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>

        <Input {...register("email", { required: "이메일을 입력하세요"   })} placeholder="이메일" type="email" />
        {errors.email && <Error>{errors.email.message}</Error>}

        <Input type="submit" value={isSubmitting ? "로딩 중..." : "메일 보내기"} />

      </Form>

      <Switcher>
        아직 계정이 없으신가요? <Link to="/signup">회원가입 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
