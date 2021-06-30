# TruExam

# Tech Stack

- Ts Nodejs
- Express
- DB - NoSqlDB, mongoDB, mongoose(ORM)
- Authentication, Authorization - Passport, passport-jwt, JsonWebToken
- Logging using Morgan, winston

## Functionalites

- Create User Accounts
- Create Instructor Accounts
- Instructors can create an Image editing task for students.
- Students has access to their tasks
- Students can download the source image and upload it back after editing
- Instructor can get student edited image and grade it from 1-5
- Students can check stats across tasks that they do

## Postman Documentation

API Documentation: https://documenter.getpostman.com/view/8802598/TzkyP162

## About the Backend

- Backend is in TypeScript so its type safe and no-less error during run time.

- Authorization & Authentication using Passport and JavaWebTokens(JWTs), cookies.

- DataBase - NoSql DB - MongoDB for Scalability, store image links (easy insertion in Nosql dbs, fast quering) [For higher scalability Indexing can be done]

- Proper file/folder Structure in this project is implemented

- Used Express js - Open source easy light but powerful web framework

## To run

To run this one will need nodejs, ts, mongodb installed in one's system.

Create a .env file in root directory, .env file will contain:

MONGO_URI=
SECRET=

```bash

git clone https://github.com/Arkaraj/TruExam_Intern.git

cd TruExam

npm install

# For running development
npm run dev

# Build
npm run build

# Running in production
npm start

```
