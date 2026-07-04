import Razorpay from "razorpay"
import Subscription from "../models/rzpsubscriptionModel.js"

const rzpInstance = new Razorpay({
    key_id: "rzp_live_SnPiFEhZMGGNkM",
    key_secret : "2Fz1Op7mMzuBmMweCIpE8tJE"  // fill this after creating rzp acc 
    
})


    export const createSubscription = async(req, res, next)=>{

        try {
    const newSubscription = await rzpInstance.subscriptions.create({  //creatin subcription in rzp
        plan_id : req.body.planId,
        total_count : 120, //      subscription will run till 12 years 
        notes:{
            userId : req.user._id
        }
     })

        //inserting in database 
     const subscription = await Subscription.create({
        razorpaySubscriptionId: newSubscription.id ,
        userId: req.user._id                                // not giving status cuz deafult is already set to "created "
                                    
     })


     res.json({subscriptionId :  newSubscription.id})

}
    
 catch (error) {
    console.log(error);
    next(error)
    
}

    }
