import Subscription from "../models/rzpsubscriptionModel.js";
import User from "../models/userModel.js";

export const paymentActivated  = async(body)=>{
    try {
    
        const rzpSubscription = body.payload.subscription.entity;
        const planid = rzpSubscription.plan_id
        const subscription = await Subscription.findOne({razorpaySubscriptionId: rzpSubscription.id})
        subscription.status = rzpSubscription.status 
        await subscription.save()
        const increaseStorage = PLANS[planid].storageQuotaBytes // pickingg the storage from above plan array by matching plain id 

        await User.findByIdAndUpdate(subscription.userId, { $inc: { maxStorage: increaseStorage, plans:"pro" } },{new : true}) //increasing storage
        console.log("storage increased !!!");
    }catch(error){console.log(error)}
}

export const paymentCancelledd  = async(body)=>{
    try {
    
         const rzpSubscription = body.payload.subscription.entity;
        const planid = rzpSubscription.plan_id
        const subscription = await Subscription.findOne({razorpaySubscriptionId: rzpSubscription.id})
        subscription.status = rzpSubscription.status 
        await subscription.save()
       
        console.log("payment cancelled !!!");
    }catch(error){console.log(error)}
}

