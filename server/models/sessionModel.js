import { model, Schema } from "mongoose";

const sessionSchema = new Schema({ 
   
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    createdAt: { // this is creating an ttl index  and we area using this for sessions 
      type: Date, // giving type date is compulsory for ttl index 
      default: Date.now, // this is telling the exact tme this doc was created 
      expires: 3600, // this paticular sesssion doc will be removed after this much seconds 
    },

      },

    {
    strict: "throw",
     })

const Session = model("Session", sessionSchema) // here we are creating session collecction in mongodb word but its an model

export default Session // now this file will be used fo file related query earlier in mongo 
// db we were using "db" that db will be now replaced with this file and we can do operation using this Directory 