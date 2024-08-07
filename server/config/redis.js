require("dotenv").config();
const Redis = require("ioredis");
const redis = new Redis({
  port: 11201, // Redis port
  host: "redis-11201.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASS,
  db: 0, // Defaults to 0
});

module.exports = redis
