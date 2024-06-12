import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { Error } from "./auth-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    watch, // watch 함수를 추가하여 파일 첨부 여부를 감시합니다.
  } = useForm<FormProps>();

  const MAX_FILE_SIZE = 1024 * 1024;

  const onSubmit = async (data: FormProps) => {
    console.log(data.file);
    const user = auth.currentUser;
    if (!user || data.tweet === "" || data.tweet.length > 180) return;

    try {
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: data.tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (data.file && data.file.length > 0) {
        const file = data.file[0];
        if (file.size > MAX_FILE_SIZE) {
          console.log("파일 크기가 너무 큽니다. 1MB를 초과할 수 없습니다.");
          return;
        }

        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      reset();
    } catch (e) {
      console.log(e);
    }
  };

  const data = watch(); // watch 함수를 사용하여 data 객체를 가져옵니다.

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        rows={5}
        maxLength={180}
        {...register("tweet", {
          required: "글을 작성해주세요!!",
          maxLength: 180,
        })}
        placeholder='당신의 이야기를 적어보세요..'
      />
      {errors.tweet && <Error>{errors.tweet.message}</Error>}

      <AttachFileButton htmlFor='file'>
        {/* 파일이 첨부되었고, 첨부된 파일이 있는 경우에만 '첨부 완료' 표시 */}
        {data.file && data.file.length > 0 ? "첨부 완료✅" : "파일 첨부"}
      </AttachFileButton>
      <AttachFileInput
        {...register("file")}
        type='file'
        id='file'
        accept='image/*'
      />

      <SubmitBtn
        type='submit'
        value={isSubmitting ? "게시 중..." : "보내기"}
        disabled={isSubmitting}
      />
    </Form>
  );
}
