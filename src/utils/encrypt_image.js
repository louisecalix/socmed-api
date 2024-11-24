import crypto from "crypto";


export function encrypt_File(filename){
    return crypto.createHmac('sha256', process.env.API_SECRET_KEY)
    .update(filename)
    .digest('hex');
};