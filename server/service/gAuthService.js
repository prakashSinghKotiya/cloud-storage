import {OAuth2Client} from 'google-auth-library'

 const clientId = process.env.GOOGLE_CLIENT_ID

const client = new OAuth2Client(clientId )// creating an login with google instance here and sharing our client id so late we can check 

export  async function verifyIdToken(token){
    try {
   const response =  await client.verifyIdToken({ // we are verifying jwt token ie idtoken comming from frontend of user when he clicked logiin with google 
        idToken: token,
        audience : clientId // here we are checking the user is getting login from our instance only 
    })

    console.log(response);
    

    const userDetails = response.getPayload() // payload will filterout things and give us user deatils like name email pic sub and many more 
  
    return userDetails
    
    
}catch (error) {
    console.log(error)
    throw error;
    
} 

    
}

