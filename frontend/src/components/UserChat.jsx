import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../hooks/useFetchRecipient";
import avatar from "../assets/avatar.svg";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import { unreadNotificaationsFunc } from "../utils/unreadNotifications";
import { useFetchLastMessage } from "../hooks/useFetchLastMessage";
import moment from "moment";
const UserChat = ({ chat, user }) => {
  const { recipient, error } = useFetchRecipient(chat, user);
  const {onlineUsers,notifications,markThisNotificationsAsread}=useContext(ChatContext);

  const unreadNotifications = unreadNotificaationsFunc(notifications);
  const thisNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipient?._id
  )
  const {lastMessage}=useFetchLastMessage(chat);
  const isOnline=onlineUsers.some((user)=>user.userId===recipient?._id);

  
  const truncateText=(text)=>{
    let shortText=text.substring(0,20);
    if(text.length>20){
      shortText+="...";
    }
    return shortText;
  }
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisNotifications?.length>0) {
          markThisNotificationsAsread(thisNotifications, notifications);  
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
            <img src={avatar} height="35px"></img>
        </div>
        <div className="text-content">
          <div className="name">{recipient?.name}</div>
          <div className="text">{
            lastMessage?.text?truncateText(lastMessage.text):"Start a conversation"
            }</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">{lastMessage?moment(lastMessage.createdAt).calendar():null}</div>
        {thisNotifications?.length>0?<div className="this-user-notifications">{thisNotifications?.length}</div>:null}
        
        <div className={isOnline?"user-online":""}>   </div>
      </div>
    </Stack>
  );
};

export default UserChat;
