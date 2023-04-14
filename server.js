var express = require('express');
const dotenv = require("dotenv");
const { Client } = require("pg")
dotenv.config();
var app = express();
var fs = require("fs");

app.get('/migraine', async function (req, res) {
   const response = await getMigraineStatus();
   res.end(response); 
})

app.post('/migraine', async function (req, res) {
   const response = await updateMigraineStatus();
   res.end(response);
   

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})


async function getMigraineStatus() {
  return new  Promise( async(resolve, reject)  => {
      try {
         const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
         })
         await client.connect();
         const res = await client.query('SELECT * FROM migraine')
         const response =  JSON.stringify(res["rows"][0]);
         console.log(response);
         await client.end();
         resolve(response);
         

      } catch (error) {
         console.log(error)
         reject(JSON.stringify(error));
      }
   })
}

async function updateMigraineStatus() {
   return new  Promise( async(resolve, reject)  => {
       try {
          const client = new Client({
             user: process.env.PGUSER,
             host: process.env.PGHOST,
             database: process.env.PGDATABASE,
             password: process.env.PGPASSWORD,
             port: process.env.PGPORT
          })
          await client.connect();
          const res = await client.query('UPDATE migraine set activated = NOT activated')
          await client.end();
          resolve("success");
          
 
       } catch (error) {
          console.log(error)
          reject(JSON.stringify(error));
       }
    })
 }