import { WebSocketServer } from 'ws';
import {JWT_secret} from "@repo/backend-common/config"
import jwt, { JwtPayload } from "jsonwebtoken"

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,request) {
  const url = request.url
  if(!url){
    return  
  }
  const queryparams = new URLSearchParams(url.split("?")[1])
  const token = queryparams.get("token")||""
  const decoded = jwt.verify(token, JWT_secret) as JwtPayload
  if(!decoded || !decoded.email){
    ws.close()
  }
  ws.on('message', function message(data) {
  ws.send(data)
  });
});