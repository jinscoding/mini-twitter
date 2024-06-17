import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Button = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

interface Props {
  userId: string;
  id: string;
  file: string | undefined;
}

const DeleteTweetForm: React.FC<Props> = ({ userId, id, file }) => {
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = window.confirm("선택한 트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (file) {
        const fileRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(fileRef);
      }
    } catch (e) {
      console.error("Error deleting tweet:", e);
    }
  };

  return user?.uid === userId ? <Button onClick={onDelete}>삭제</Button> : null;
};

export default DeleteTweetForm;
