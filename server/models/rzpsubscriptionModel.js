import { model, Schema } from "mongoose";


const rzpSubscriptionSchema = new Schema({ 
       razorpaySubscriptionId:{
        type: String,
        required : true
        },

        userId: {
          type: Schema.Types.ObjectId,
          required: true,
        },

        status: {
      type: String,
           enum: [
                   "created",
                   "active",
                   "pending",
                   "past_due",
                   "paused",
                   "canceled",
                   "in_grace",
                 ],
                    default: "created",
    },},

    {
        strict: "throw",
    }
       
    
     )

const Subscription = model("Subscription", rzpSubscriptionSchema) 

export default Subscription 