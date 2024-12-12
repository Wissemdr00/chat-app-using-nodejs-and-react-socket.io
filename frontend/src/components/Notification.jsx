import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { unreadNotificaationsFunc } from "../utils/unreadNotifications";
import moment from "moment";
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications,markNotificationAsRead,markAllNotificationsAsRead, userChats, allUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const unreadNotifications = unreadNotificaationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id == n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-left-dots-fill"
          viewBox="0 0 16 16"
        >
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
        {unreadNotifications?.length > 0 && (
          <span className="notification-count">
            {unreadNotifications.length}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="mark-as-read" onClick={()=>markAllNotificationsAsRead(notifications)}>Mark all as read</button>
          </div>
          {modifiedNotifications.length > 0 ? (
            modifiedNotifications.map((n,index) => (
              <div
                key={index}
                className={n.isRead ? "notification" : "notification not-read"}
                onClick={()=>{
                  markNotificationAsRead(n,userChats,user,notifications);
                  setIsOpen(false);
                }}
              >
                
                  <span>{`${n.senderName} sent you a new message`} </span>{" "}
                  {n.content}
                  <span className="notification-time">{moment(n.date).calendar()}</span>
                
              </div>
            ))
          ) : (
            <span className="notification">No notification yet..</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
