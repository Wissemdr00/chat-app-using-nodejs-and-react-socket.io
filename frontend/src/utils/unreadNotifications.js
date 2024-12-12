export const unreadNotificaationsFunc=(notifications)=>{
    return notifications.filter((n)=>n.isRead ===false)
}