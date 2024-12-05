import { useEffect,useState } from "react";
import { baseUrl, getRequest } from "../utils/services";


export const useFetchRecipient = (chat,user) => {
    const [recipient,setRecipient] = useState(null);
    const [error,setError] = useState(null);
    const recipientId = chat?.members?.find((member) => member !== user._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;
            const res = await getRequest(`${baseUrl}/users/find/${recipientId}`);
            if (res.error) {
                return setError(res);
            }
            setRecipient(res); 
        };
        getUser();
    },[recipientId]);


    return {recipient,error};
};