import mongoose from "mongoose";

export async function connectdb(){
    try {
       await mongoose.connect(process.env.DB_URL)
       console.log("Database connectedd");
       
      
    } catch (err) {
       console.log(err);
    console.log("Could Not Connect to the Database");
    process.exit(1);
    }
}

process.on("SIGINT", async () => { // this will run when we do ctrl+c and close the server it will close the server gentally
  await mongoose.disconnect();
  console.log("Client Disconnected!");
  process.exit(0);
});
