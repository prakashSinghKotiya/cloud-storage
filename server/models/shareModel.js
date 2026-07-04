import { model, Schema } from "mongoose";

const sharingSchema = new Schema({ 
   
    fileId : {
        type : Schema.Types.ObjectId,
        ref : "File",
        required : true
    },
     userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token : {
        type: String,
      unique: true,
      required: true,

    },
    createdAt: { // this is creating an ttl index  and we area using this for sessions 
      type: Date, // giving type date is compulsory for ttl index 
      default: Date.now, // this is telling the exact tme this doc was created 
      expires: 3600, // this paticular sesssion doc will be removed after this much seconds 
    },

      },

    {
    strict: "throw",
    timestamps : true
     })

const Sharing = model("Sharing", sharingSchema) // here we are creating session collecction in mongodb word but its an model

export default Sharing  
