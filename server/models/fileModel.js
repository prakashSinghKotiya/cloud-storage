import { model, Schema } from "mongoose";


const fileSchema = new Schema({ 
     name: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
     isUploading: {
      type: Schema.Types.Boolean,
     },
     starred:{
      type: Schema.Types.Boolean,
      default : false
     },
    size :{
          type : Number,
          required: true
    
        },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
    },
       },
    {
    strict: "throw",
     })

const File = model("File", fileSchema) // here we are creating file collecction in mongodb word but its an model

export default File // now this file will be used fo file related query earlier in mongo 
// db we were using "db" that db will be now replaced with this file and we can do operation using this Directory 