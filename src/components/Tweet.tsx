import { styled } from "styled-components";
import { ITweet } from "./Timeline";
import DeleteTweetForm from "./DeleteTweetForm";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

export default function Tweet({ username, file, tweet, userId, id }: ITweet) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <DeleteTweetForm userId={userId} id={id} file={file} />
      </Column>
      <Column>{file ? <Image src={file} /> : null}</Column>
    </Wrapper>
  );
}
