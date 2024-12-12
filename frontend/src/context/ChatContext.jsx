import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { AuthContext } from "./AuthContext";
import {io} from "socket.io-client";


export const ChatContext = createContext(AuthContext);


export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [potentialChats,setPotentialChats] = useState([]);
  const [currentChat,setCurrentChat] = useState(null);
  const [messages,setMessages] = useState([]);
  const [isMessagesLoading,setIsMessagesLoading] = useState(false);
  const [isMessagesError,setIsMessagesError] = useState(null);
  const [sendTextMessageError,setSendTextMessageError] = useState(null);
  const[newMessage,setNewMessage] = useState([]);
  const [socket,setSocket] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const [notifications,setNotifications]=useState([]);
  const [allUsers,setAllUsers]=useState([]);
  
  


  useEffect(()=>{
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  },[user]);

  // Add user to online users
  useEffect(()=>{
    if (!socket) return;
    socket.emit("addNewUser",user?._id);
    socket.on("getOnlineUsers",(res) => {
      setOnlineUsers(res);
    });
    return () => socket.off("getOnlineUsers");
  }
  ,[socket]);

  //send messages
  useEffect(()=>{
    if (!socket) return;
    
    const recipientId = currentChat?.members?.find((id) => id !== user._id);

    socket.emit("sendMessage",{...newMessage,recipientId });
  }
  ,[newMessage,socket]);

  //reecive messages and notification
  useEffect(()=>{
    if (!socket) return;
    socket.on("getMessage",(res) => {
      if (res.chatId !== currentChat._id) return;
      setMessages((prevMessages) => [...prevMessages,res]);
    });

    socket.on("getNotification",(res)=>{
      const isChatOpen=currentChat?.members.some(id=>id===res.senderId);
      if (isChatOpen){
        setNotifications(prev=>[{...res,isRead:true}, ...prev])
      }else{
        setNotifications(prev => [res,...prev])
      }
    })
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    }
  } ,[socket,currentChat]);

  useEffect(()=>{
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error){
        return console.log("Error fetching users",response);
      }
      const pChats = response.filter((u) => {
        if (user?._id === u._id) return false; // Filter out current user

        let isChatCreated = false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members.includes(u._id);
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    }
    getUsers();
    
  },[userChats,user])

  useEffect(() => {
    setLoading(true);
    const getUserChats = async () => {
      if (user?._id) {
        const response = await getRequest(
          `${baseUrl}/chats/${user?._id}`,
          token
        );
        
        if (response.error) {
          setLoading(false);
          return setError(response.message);
        }
        
        setUserChats(response);
        setLoading(false);
      }
    };
    getUserChats();
  }, [user?._id,notifications]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        setIsMessagesLoading(true);
        const response = await getRequest(
          `${baseUrl}/messages/${currentChat._id}`
        );
        if (response.error) {
          setIsMessagesLoading(false);
          return setIsMessagesError(response.message);
        };
        setMessages(response);
        setIsMessagesLoading(false);
      }
    };
    getMessages();
  }, [currentChat]);
  const sendTextMessage = useCallback(async (textMessage,sender,setTextMessage) => {
    if (!textMessage) return;
    const response = await postRequest(
      `${baseUrl}/messages`,
      JSON.stringify({ chatId: currentChat._id ,senderId: sender._id,text: textMessage })
    );
    if (response.error) {
      return setSendTextMessageError(response);
    }
    setMessages((prevMessages) => {
      return [...prevMessages, response];
    });
    setNewMessage(response);
    setTextMessage("");
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId,secondId) => {
    setLoading(true);
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId }),
      
    );
    if (response.error) {
      setLoading(false);
      return setError(response.message);
    }
    setUserChats((prevChats) => {
      return [...prevChats, response];
    });
    setLoading(false);
  }, []);

  const markAllNotificationsAsRead=useCallback((notifications)=>{
    const nNotifications = notifications.map(n=>{
      return {...n,isRead:true};
    });

    setNotifications(nNotifications);
  });

  const markNotificationAsRead=useCallback((n,userChats,user,notifications)=>{
    //find chat to open
    const desiredChat = userChats.find(chat =>{
      const chatMembers = [user._id,n.senderId];
      const isDesiredChat=chat?.members.every((member)=>{
        return chatMembers.includes(member);
      });

      return isDesiredChat
    });

    //mark notification as read

    const nNotifications = notifications.map(el=>{
      if(n.senderId === el.senderId){
        return {...el,isRead:true};
      }else{
        return el;
      }
      
    });

    updateCurrentChat(desiredChat);
    setNotifications(nNotifications);
  },[]);

  const markThisNotificationsAsread=useCallback((thisNotification,notifications)=>{
    const nNotifications = notifications.map(el=>{
      let notification;
      thisNotification.forEach(n => {
        if(n.senderId === el.senderId){
          notification={...el,isRead:true};
        }else{
          notification=el;
        }
      });
      return notification;
    });

    setNotifications(nNotifications);
  }
  ,[notifications]);
  return (
    <ChatContext.Provider value={{markThisNotificationsAsread,markNotificationAsRead,markAllNotificationsAsRead, allUsers,notifications,onlineUsers,messages,isMessagesError,isMessagesLoading,updateCurrentChat, createChat,potentialChats,error, loading, userChats, setUserChats,currentChat,sendTextMessage,}}>
      {children}
    </ChatContext.Provider>
  );
};
