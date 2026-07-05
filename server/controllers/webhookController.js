import Razorpay from "razorpay"
import Subscription from "../models/rzpsubscriptionModel.js";
import User from "../models/userModel.js";
import { paymentActivated, paymentCancelledd } from "./webhookEventController.js";

export const PLANS = {
  plan_SnOQBLIj5Szjoa: {
    storageQuotaBytes: 2 * 1024 ** 3,
  },
  plan_SnOQvZ3V0ScfPB: {
    storageQuotaBytes: 2 * 1024 ** 3,
  },
  plan_SnORKRSyPNKV4A: {
    storageQuotaBytes: 5 * 1024 ** 3,
  },
  plan_SnORnXuC5wrR2n: {
    storageQuotaBytes: 5 * 1024 ** 3,
  },
  plan_SnOSFXhT5nacDR: {
    storageQuotaBytes: 10 * 1024 ** 3,
  },
  plan_SnOT3JdHCj8L5vJ: {
    storageQuotaBytes: 10 * 1024 ** 3,
  },
};

 const handlers = {
        "subscription.activated": paymentActivated,
        "subscription.cancelled": paymentCancelledd,
        // "payment.captured": handlePaymentCaptured,
        // "payment.failed": handlePaymentFailed,
    };


export const rzpWebhook = async (req,res,next) => {
 
const rzpsignature = req.headers["x-razorpay-signature"] // this is the sign razor pay had generated and sent it in headers we are  pickiing it 
const isSignatureValid = Razorpay.validateWebhookSignature(  JSON.stringify(req.body), // this will create the sign again and match with rzp one 
    rzpsignature,                          
     process.env.RAZORPAY_WEBHOOK_SECRET , // this should be thee same secret we  gave at  rzp webhook 
    )

if(isSignatureValid){
    console.log("signature verified rzp  ");  

   

    const events = handlers[req.body.event];
    if (events) {
      console.log("event found",events);
        await events(req.body);
    }

   
    // if(req.body.event === "subscription.activated"){  // there are multiple rzp event we are processing this one this will trigger if succesfulll payment happened 
    //     const rzpSubscription = req.body.payload.subscription.entity;
    //     const planid = rzpSubscription.plan_id
    //     const subscription = await Subscription.findOne({razorpaySubscriptionId: rzpSubscription.id})
    //     subscription.status = rzpSubscription.status 
    //     await subscription.save()
    //     const increaseStorage = PLANS[planid].storageQuotaBytes // pickingg the storage from above plan array by matching plain id 

    //     const user = await User.findByIdAndUpdate(subscription.userId, { $inc: { maxStorage: increaseStorage, plans:"pro" } },{new : true}) //increasing storage
    //     console.log("storage increased !!!");
    // }

    //   if(req.body.event === "subscription.cancelled"){  // there are multiple rzp event we are processing this one this will trigger if succesfulll payment happened 
    //     const rzpSubscription = req.body.payload.subscription.entity;
    //     const planid = rzpSubscription.plan_id
    //     const subscription = await Subscription.findOne({razorpaySubscriptionId: rzpSubscription.id})
    //     subscription.status = rzpSubscription.status 
    //     await subscription.save()
       
    //     console.log("payment cancelled !!!");
    // }


 
  } else{
    console.log("invalid signature ");  
  }    

   res.end("OK");
}