import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/UserChat";
import PotentialChats from "../components/PotentialChats";
import ChatBox from "../components/ChatBox";
const Chat = () => {
    const {user}   = useContext(AuthContext);
    const {
        error,loading,userChats,updateCurrentChat,messages,isMessagesError,isMessagesLoading
    } = useContext(ChatContext);    
    
    return(
        <Container>
            <PotentialChats />
            {userChats?.length<1 ? null :(
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="all-users messages-box flex-grow-0 pe-3" gap={3}>
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {userChats?.map((chat,index) =>{
                            return(
                                <div key={index} onClick={()=> updateCurrentChat(chat)}>
                                    <UserChat user={user} chat={chat} />
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
                
            )}
        </Container>
    )
}
 
export default Chat;