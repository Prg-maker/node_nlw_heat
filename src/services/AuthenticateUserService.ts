import axios from 'axios' 
import prismaClient from '../prisma'
import  {sign} from 'jsonwebtoken'

interface IAccessTokenResponse{
  access_token: string
}
interface IUserResponse{
  avatar_url: string;
  login: string; // <-- nome do usuario no git
  id: number;
  name: string // <-- nome do propriedario da conta o git
}

class AuthenticateUserService{
  async execute(code: string){
    const url = "https://github.com/login/oauth/access_token";
    
    const {data: accessTokenResponse} = await axios.post<IAccessTokenResponse>(url , null ,{
      params:{
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET ,
        code
      },
      headers:{
        "Accept": "application/json"
      }
    }) 

    const response = await axios.get("https://api.github.com/user" , {
      headers:{
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })
    
    const {login , id  , name , avatar_url } = response.data
  
    let user = await prismaClient.user.findFirst({
      where:{
        github_id: id
      }
    })

    if(!user){
      user = await prismaClient.user.create({
       data:{
        github_id:id,
        name, 
        avatar_url,
        login
       }
      })
    }
    const token = sign({
      user:{
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
    }, 
      process.env.WEN_TOKEN_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    ) 


    return {token , user}
  } 
}

export {AuthenticateUserService}