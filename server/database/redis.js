import {createClient} from "redis";


const redisDb = createClient()

redisDb.on("error", (err) =>{ console.log("Redis Client Error", err);  process.exit(1)})
await redisDb.connect().then(() => console.log("Redis client connected")).catch(console.error)

export default redisDb