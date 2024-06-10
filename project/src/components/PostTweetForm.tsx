import { addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { Error } from "./auth-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: black;
  background-color: white;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
      opacity: 0.9;
    }
`;

const AttachFileButton = styled.label`
  padding: 10px 10px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

interface FormProps {
  tweet: string;
  file: FileList;
}

export default function PostTweetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormProps>();

  const onSubmit = async (data: FormProps) => {
    const user = auth.currentUser;
    if (!user || data.tweet === "" || data.tweet.length > 180) return;

    try {
      await addDoc(collection(db, "tweets"), {
        tweet: data.tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      // Reset form after submission
      reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        rows={5}
        maxLength={180}
        {...register("tweet", {
          required: "글을 작성해주세요!!",
          maxLength: 180,
        })}
        placeholder='좋은 일만 가득하길'
      />
      {errors.tweet && <Error>{errors.tweet.message}</Error>}

      <AttachFileButton htmlFor='file'>
        {errors.file ? "첨부 ✅" : "사진 첨부"}
      </AttachFileButton>
      <AttachFileInput
        {...register("file")}
        type='file'
        id='file'
        accept='image/*'
      />
      {errors.file && <Error>{errors.file.message}</Error>}

      <SubmitBtn
        type='submit'
        value={isSubmitting ? "게시 중..." : "보내기"}
        disabled={isSubmitting}
      />
    </Form>
  );
}
