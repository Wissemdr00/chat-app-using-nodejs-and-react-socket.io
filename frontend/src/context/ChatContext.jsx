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

  //reecive messages
  useEffect(()=>{
    if (!socket) return;
    socket.on("getMessage",(message) => {
      if (message.chatId !== currentChat._id) return;
      setMessages((prevMessages) => [...prevMessages,message]);
    });
    return () => socket.off("getMessage");
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
  }, [user?._id]);

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
  return (
    <ChatContext.Provider value={{onlineUsers,messages,isMessagesError,isMessagesLoading,updateCurrentChat, createChat,potentialChats,error, loading, userChats, setUserChats,currentChat,sendTextMessage,}}>
      {children}
    </ChatContext.Provider>
  );
};
