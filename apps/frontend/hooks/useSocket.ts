import { useEffect, useState } from "react";
 import { Ws_Url } from "../config";
 
 export function useSocket() {
     const [loading, setLoading] = useState(true);
     const [socket, setSocket] = useState<WebSocket>();
     
 
     useEffect(() => {
        const token=localStorage.getItem("token")
        if (!token) {
            console.error("Token not found in localStorage");
            return;
          }
         const ws = new WebSocket(`${Ws_Url}?token=${token}`);
         ws.onopen = () => {
             setLoading(false);
             setSocket(ws);
         }
         return () => {
            ws.close();
          };
     }, []);
 
     return {
         socket,
         loading
     }
 
 }