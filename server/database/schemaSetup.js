import mongoose from "mongoose";
import { connectdb } from "./database.js";

await connectdb();
const client = mongoose.connection.getClient()

try {
 const db = mongoose.connection.db
 const command = "collMod"; // will change it to collMod after we create it . bcz schema is created once and then only updated , create and collMod

  await db.command({
    [command]: "users", 
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "email",  "rootDirId"],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
            minLength: 3,
            description:
              "name field should a string with at least three characters",
          },
          email: {
            bsonType: "string",
            description: "please enter a valid email",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          },
          password: {
            bsonType: "string",
            minLength: 4,
          },
           picture: {
            bsonType: "string",
          },
            plans: {
            bsonType: "string",
            enum : [ "free" , "pro" ],
          },
          rootDirId: {
            bsonType: "objectId",
          },
           role: {
            enum : [ "User" , "Admin" ,"Manager"]
          },
          maxStorage: {
            bsonType: ["int", "long"] //long is int64 
          },
          deleted :{
            bsonType : "bool"
          },
          __v: {
            bsonType: "int",
          },
        },
        additionalProperties: false,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  await db.command({
    [command]: "directories",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "userId", "parentDirId"],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
          },
          size: {
            bsonType: "int", 
          },
          userId: {
            bsonType: "objectId",
          },
          parentDirId: {
            bsonType: ["objectId", "null"],
          },
          __v: {
            bsonType: "int",
          },
        },
        additionalProperties: false,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

  await db.command({
    [command]: "files",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "extension", "userId", "parentDirId"],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
          },
          isUploading: {
            bsonType : "bool"

          },
          starred: {
            bsonType : "bool"

          },
          extension: {
            bsonType: "string",
          },
          userId: {
            bsonType: "objectId",
          },
          size :{
            bsonType : "int"
              
          
              },
          parentDirId: {
            bsonType: ["objectId", "null"],
          },
          __v: {
            bsonType: "int",
          },
        },
        additionalProperties: false,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });
} catch (err) {
  console.log("Error setting up the database", err);
} finally {
  await client.close();
}


// we are not importing this in server,js cuz this will be created once and and we will run this file individually once when
//we will create our new server and use this file for schema validation 
// after than whenever we need to update any schema we will update it here using collMod and agai run this file using node schemasetup.js 
//individuallly to update the schema of db 
//schema can be directly created and updated in mongodb compass but we are putting it here in code to track our previous schema 
