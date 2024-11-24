import { connection } from '../core/database.js';
import { encrypt_Password } from '../utils/encrypt.js';

export class Admin{
    constructor(){
        this.connection_db = connection;
    }

    async create_admin(email, password){
        try{
            const[admin] = await this.connection_db.execute(
                'INSERT INTO admin_account (email, password) VALUES(?,?)',
                [email, encrypt_Password(password)]
            );
            return admin;
        }catch (err) {
            console.error('<error> Admin.create_admin', err);
            throw err;
        }

    }
    async verify(email, password){
        try{
            const[verify_admin] = await this.connection_db.execute(
                'SELECT * FROM admin_account WHERE email = ?',
                [email]
            );

            const admin_ = verify_admin[0];

            if (!admin_){
                return null;
            }

            const verify_pw = await encrypt_Password(password);

            if (verify_pw === admin_.password){
                return verify_admin;
            }else{
                return null;
            }


        }catch(err){
            console.err('<error> Admin.verify', err);
            throw err;
        }
    }

    async updateAdmin(admin_id ,email, password){

        try{
           
            const[result] = await connection_db.execute(
                'UPDATE admin_account SET email=?, password=? WHERE admin_id=?',
                [admin_id,username, course_strand, year, section, email, password]
            );
            return result;

        }catch(err){
            console.log('<error> Admin.updateAdmin ', err);
            throw err;
        }
    }








   async get_admin(admin_id){
    try{
        const[admin]= await this.connection_db.execute(
            'SELECT * FROM admin_account WHERE admin_id= ?',
            [admin_id]
        );
        return admin
    }catch (err) {
        console.error('<error> Admin.get_admin', err);
        throw err;
    }
   }

   async delete_admin(admin_id){
    try{
        const[result] = await this.connection_db.execute(
            'DELETE FROM admin_account WHERE admin_id=?',
            [admin_id]
        )
        return result;
    }catch (err) {
        console.error('<error> Admin.deleteAdmin', err);
        throw err;
    }
   }
}