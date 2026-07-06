import { model, Schema } from "mongoose";

const directorySchema = new Schema({ 
     name: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
          default: 0,
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        parentDirId: {
          type: Schema.Types.ObjectId,
          default: null,
          ref: "Directory", // later when we will use populate we wll use this ref
        },
    },
    {
    strict: "throw",
     })

const Directory = model("Directory", directorySchema) // here we are creating directory collecction in mongodb word but its an model

export default Directory // now this directory will be used fo directory related query earlier in mongo 
// db we were using "db" that db will be now replaced with this dorectory and we can do operation using this Directory 