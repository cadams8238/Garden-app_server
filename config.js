'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://user:password1@ds229771.mlab.com:29771/garden-app',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/garden-test'
};
