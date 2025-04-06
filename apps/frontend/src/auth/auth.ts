import axios from "axios";
import { Backend_Url } from "../../config";

export const signup = async (name: string, email: string, password: string) => {
  
  try {
    const response = await axios.post(`${Backend_Url}/signup`, {
      name:name,
      email:email,
      password:password,
    });
    console.log(response)

    const token = response.data?.token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      console.warn("No token received from the server.");
    }

    return response.data;
  } catch (error) {
    console.log(error)
    } 
  }


  export const login=async(email:string,password:string)=>{
    try {

     const response= await axios.post(`${Backend_Url}/login`,{
      email,
      password
     })
     const token= response.data.token
     if(token){
      localStorage.setItem("token",token)
     }
    } catch (error) {
      console.log(error)
    }
  }
