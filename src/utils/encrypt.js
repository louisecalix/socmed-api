// import { Buffer } from "buffer";

// window.Buffer - Buffer;
import crypto from "crypto";


export function encrypt_Password(password){
    return crypto.createHmac('sha256', process.env.API_SECRET_KEY)
    .update(password)
    .digest('hex');
};