import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../hooks/useFetchRecipient";
import avatar from "../assets/avatar.svg";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

const UserChat = ({ chat, user }) => {
  const { recipient, error } = useFetchRecipient(chat, user);
  const {onlineUsers}=useContext(ChatContext);
  const isOnline=onlineUsers.some((user)=>user.userId===recipient?._id);
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
            <img src={avatar} height="35px"></img>
        </div>
        <div className="text-content">
          <div className="name">{recipient?.name}</div>
          <div className="text">text message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">12-05-05</div>
        <div className="this-user-notifications">2</div>
        <div className={isOnline?"user-online":""}>   </div>
      </div>
    </Stack>
  );
};

export default UserChat;
