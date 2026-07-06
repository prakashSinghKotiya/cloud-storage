import { rateLimit } from 'express-rate-limit'
import { slowDown } from 'express-slow-down'

// this is anti dos attack 

export const generalLimiter = rateLimit({   // we use rate limiter ffor dos attack  
	
	windowMs:  15 * 60 * 1000, // 15 minutes
	limit: 100,             // allowing only 100 req/ 15 min
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})


export const registerLimiter = rateLimit({   // we use rate limiter ffor dos attack  
	windowMs:  60 * 1000, // 1 minutes
	limit: 3,             // allowing only 5 req/min
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

/// throttling 

export const requstThrottling =  slowDown({
	windowMs: 60 * 1000, // cleaning the req array of that ip addedd after 1 min 
	delayAfter: 5, // after 5 consequtive req it will start delaying thr req
	delayMs: (hits) => hits * 1000, // Addding 1 sec of delay after ever 5 req in a min after a min it will be clean and again if there are more than 5 req it will delay 
})