import Redis from "ioredis";

const redisClient = new Redis(
  "redis://default:zVv71zF6zp0Qv8UWG8HsUKYq7YV0Wrgf@redis-12950.c14.us-east-1-3.ec2.cloud.redislabs.com:12950"
);


export default redisClient;