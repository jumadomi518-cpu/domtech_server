
 const { Router } = require("express");
 const paymentRouter = Router();
 const axios = require("axios");
 const { Pool } = require("pg");
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
 });
const CryptoJS = require("crypto-js");

 const accessTokens = {};
 async function getToken(id, consumerKey, consumerSecret) {

  if (accessTokens[id] &&  Date.now() <= accessTokens[id].tokenExpiry) {
    return accessTokens[id].acessToken;
   }
 const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await axios.get("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
   headers: { 'Authorization': `Basic ${auth}`, "Content-Type": "application/json"}
   });

 const tokenExpiry = Date.now() + 3599 * 1000 - 5000;

 accessTokens[id] = { tokenExpiry: tokenExpiry, accessToken: res.data.access_token };
 return res.data.access_token;

}


 paymentRouter.post("/mpesa-callback", (req, res) => {
   console.log(req.body);
   res.status(200).json({
      ResultCode: 0,
     ResultDesc: "Accepted"
    });
   });

 paymentRouter.post("/:id", async (req, res) => {
  try {
 const date = new Date();
 const timestamp = date.getFullYear().toString() + String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0");
 const { rows } = await pool.query("SELECT * FROM secrets WHERE location_id = $1", [req.params.id]);
 const paymentDetails = rows[0];
 const consumerKey = CryptoJS.AES.decrypt(paymentDetails.consumer_key, process.env.SECRET).toString(CryptoJS.enc.utf8);
 const consumerSecret = CryptoJS.AES.decrypt(paymentDetails.consumer_secret, process.env.SECRET).toString(CryptoJS.enc.utf8);
 const passKey = CryptoJS.AES.decrypt(paymentDetails.pass_key, process.env.SECRET).toString(CryptoJS.enc.utf8);
 const password = Buffer.from(paymentDetails.short_code + passKey + timestamp).toString("base64");

 const payload = {
   "BusinessShortCode": paymentDetails.short_code,
   "Password": password,
   "Timestamp": timestamp,
   "TransactionType": paymentDetails.transaction_type,
   "Amount": req.body.amount,
   "PartyA": req.body.phone,
   "PartyB": paymentDetails.short_code,
   "PhoneNumber": req.body.phone,
   "CallBackURL": "https://domtech-server-juf6.onrender.com/pay/mpesa-callback",
   "AccountReference": paymentDetails.account_ref
   };
 const accessToken = await getToken(paymentDetails.location_id, consumerKey, consumerSecret);
 const stkRes = await axios.post("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", payload, {
  headers: { "Authorization": `Bearer ${accessToken}`}
   });
 res.json(stkRes.data);
 } catch (err) {
  res.status(500).json({ status: "an error occured", error: err.message});
 }
  });



 module.exports = paymentRouter;
