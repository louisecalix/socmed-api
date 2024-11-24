import {connection} from '../core/database.js';
import { encrypt_Password} from '../utils/encrypt.js';

export class User{
    constructor(){
    this.connect_db = connection;
    }


    
    async isAdmin(user_id) {
        try {
            const [rows] = await this.connect_db.execute(
                'SELECT role FROM user_account WHERE user_id = ?',
                [user_id]
            );

            return rows.length > 0 && rows[0].role === 'admin';
        } catch (err) {
            console.error('<error> User.isAdmin', err);
            throw err;
        }
    }

    async create_user(student_id, firstname, lastname, course_strand, year_level, section, email, password, image) {
        

        student_id = String(student_id).trim();
        firstname = String(firstname).trim();
        lastname = String(lastname).trim();
       course_strand = String(course_strand).trim();
       section = String( section).trim();
       email = String(email).trim();
      
        const studentIdRegex = /^\d{2}-\d{4}$/;
    
      
        if (!studentIdRegex.test(student_id)) {
            throw new Error("Invalid student ID format. It should be in the format XX-YYYY (e.g., 22-1234).");
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
    
   
        if (Array.isArray(password)) {
            password = password[0]; 
        }
        if (Array.isArray(year_level)) {
            year_level = parseInt(year_level[0].trim(), 10);
        } else {
            year_level = parseInt(year_level.trim(), 10); 
        }
    
       
        const encryptedPassword = encrypt_Password(password); 
    
        const [result] = await this.connect_db.execute(
            'INSERT INTO user_account(student_id, firstname, lastname, course_strand, year_level, section, email, password) VALUES(?,?,?,?,?,?,?,?)',
            [student_id, firstname, lastname, course_strand, year_level, section, email, encryptedPassword]
        );

      

        return result;
    }
    
    async create_admin(student_id, firstname, lastname, course_strand, year_level, section, email, password) {
        student_id = String(student_id).trim();
        firstname = String(firstname).trim();
        lastname = String(lastname).trim();
       course_strand = String(course_strand).trim();
       section = String( section).trim();
       email = String(email).trim();
      
        const studentIdRegex = /^\d{2}-\d{4}$/;
    
      
        if (!studentIdRegex.test(student_id)) {
            throw new Error("Invalid student ID format. It should be in the format XX-YYYY (e.g., 22-1234).");
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }

        const pw_regex = /^[a-zA-Z0-9!@#$%^&*()_+={}|:;,.<>?/-]{8}$/;
        if (!pw_regex.test(password)) {
            throw new Error("Invalid password format.");
        }


   
        if (Array.isArray(password)) {
            password = password[0]; 
        }
        if (Array.isArray(year_level)) {
            year_level = parseInt(year_level[0].trim(), 10);
        } else {
            year_level = parseInt(year_level.trim(), 10); 
        }
    
       
        const encryptedPassword = encrypt_Password(password); 
        const [result] = await this.connect_db.execute(
            'INSERT INTO user_account(student_id, firstname,  lastname, course_strand, year_level, section, email, password, status, role) VALUES(?,?,?,?,?,?,?,?,?,?)',
            [student_id,  firstname, lastname,  course_strand, year_level, section, email, encryptedPassword,'approved', 'Admin']
        );
    
            const get_userid = result?.insertId;
    
            const [add_profile] = await this.connect_db.execute(
                'INSERT INTO profiles (user_id, username) VALUES (?,?)',
                [get_userid, firstname]
            );
    
            return result;
       
    }
    


    async approveUser(user_id) {
        try {

            // const isAdmin = await this.isAdmin(admin_id); // Check if the user is an admin
            // if (!isAdmin) {
            //     throw new Error('Unauthorized: Only admins can approve users.');
            // }


            const [result] = await this.connect_db.execute(
                'UPDATE user_account SET status = ? WHERE user_id = ?',
                ['approved', user_id]
            );

            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }

            const [getinfo] = await this.connect_db.execute(
                'SELECT user_id, firstname FROM user_account WHERE user_id =? AND status = ?',
                [user_id, 'approved']
            );

            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }
            
            const firstname = getinfo[0].firstname;


            const [makeprofile] = await this.connect_db.execute(
                'INSERT INTO profiles (user_id, username) VALUES (?,?)',
                [user_id, firstname]
            );



            return { message: 'User: Approved!' };
        } catch (err) {
            console.error('<error> User.approveUser', err);
            throw err;
        }
    }
    async approve_all() {
        try {
            // Update the status to 'approved' for all users
            const [result] = await this.connect_db.execute(
                'UPDATE user_account SET status = ?',
                ['approved']
            );
    
            // Retrieve the user_id and firstname of the approved users
            const [getinfo] = await this.connect_db.execute(
                'SELECT user_id, firstname FROM user_account WHERE status = ?',
                ['approved']
            );
    
            // Check if getinfo has data
            if (getinfo.length === 0) {
                return { message: 'No users found to approve.' };
            }
    
            // Iterate over the approved users and insert into the profiles table
            for (let user of getinfo) {
                const { user_id, firstname } = user;
    
                if (user_id && firstname) {
                    const [makeprofile] = await this.connect_db.execute(
                        'INSERT INTO profiles (user_id, username) VALUES (?, ?)',
                        [user_id, firstname]
                    );
                }
            }
    
            return { message: 'User(s) approved!' };
        } catch (err) {
            console.error('<error> User.approve_all', err);
            throw err;
        }
    }
    

    // async moveUser(User_id) {
    //     try {
    //         const [approved_details] = await this.connect_db.execute(
    //             'SELECT student_id, firstname, lastname, course_strand, year_level, section, email, password FROM Users WHERE User_id = ?',
    //             [User_id]
    //         );

    //         if (approved_details.length === 0) {
    //             throw new Error('User not found');
    //         }

    //         const {
    //             student_id,
    //             firstname, 
    //             lastname,   
    //             course_strand,
    //             year_level,
    //             section,
    //             email,
    //             password
    //         } = approved_details[0];

    //         console.log({ student_id, firstname, lastname, course_strand, year_level, section, email, password });

    //         await this.connect_db.execute(
    //             'INSERT INTO user_account (student_id, firstname, lastname, course_strand, year_level, section, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    //             [student_id, firstname, lastname, course_strand, year_level, section, email, password]
    //         );
    //         // await this.connect_db.execute(
    //         //     'INSERT INTO profiles ( username) VALUES ( ?)',
    //         //     [ firstname]

               
    //         // );

    //         await this.connect_db.execute(
    //             'DELETE FROM Users WHERE User_id = ?',
    //             [User_id]
    //         );

    //     } catch (err) {
    //         console.error('<error> User.moveUser', err);
    //         throw err;
    //     }
    // }

    async declineUser(user_id) {
        try {
            const [result] = await this.connect_db.execute(
                'DELETE FROM user_account WHERE user_id = ?',
                [user_id]
            );

            if (result.affectedRows === 0) {
                throw new Error('User not found or already deleted');
            }
            return { message: 'User: Declined!' };
        } catch (err) {
            console.error('<error> Users.declineUser', err);
            throw err;
        }
    }

    async decline_all() {
        try {
            const [response] = await this.connect_db.execute(
                'DELETE FROM user_account WHERE status = ?',
                ['pending']
            );
    
            if (response.affectedRows === 0) {
                throw new Error('No pending users found to decline and delete');
            }
    
            return { message: 'Pending users declined and deleted successfully!' };
    
        } catch (err) {
            console.error('<error> Users.decline_all', err);
            throw err;
        }
    }
    
    async getUser(user_id) {
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM user_account WHERE user_id = ?',
                [user_id]
            );
            const [id] = await connection.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
                [user_id, 'id_pic']
            );
            return { user: rows[0], id };
        } catch (err) {
            console.error('<error> User.getUser', err);
            throw err;
        }
    }
    

    async getAllUsers() {
        try {
            const [all_users] = await this.connect_db.execute('SELECT * FROM user_account');
            
           
            const usersWithPics = await Promise.all(all_users.map(async (user) => {
                const [id_pic] = await this.connect_db.execute(
                    'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
                    [user.user_id, 'id_pic']
                );
    
                
                user.idpic = id_pic.length > 0 ? id_pic[0].file_path : null;
    
                return user;
            }));
    
            return usersWithPics;
        } catch (err) {
            console.error('<error> User.getAllUsers', err);
            throw err;
        }
    }
    

    async verify(email, password){
        try{
            const [verify_user] = await this.connect_db.execute(
                'SELECT * FROM user_account WHERE email = ? AND status =?',
                [email, 'approved']
            );

            const user_ = verify_user[0];

            if(!user_){
                return null;
            }

            const verify_pw = await encrypt_Password(password);

            if (verify_pw === user_.password){
                return verify_user;
            }else{
                return null;
            }

            
        }catch(err){
            console.error('<error> User.verify', err);
            throw err;
        }
    }async get_approved() {
        try {
        
            const [rows] = await this.connect_db.execute(
                `SELECT ua.user_id, ua.student_id, ua.firstname, ua.lastname, 
                        ua.course_strand, ua.year_level, ua.section, ua.email, 
                        ua.status, ua.created_at, ua.role, 
                        ui.file_path AS id_pic
                 FROM user_account ua
                 LEFT JOIN upload_image ui
                 ON ua.user_id = ui.user_id AND ui.image_type = "id_pic"
                 WHERE ua.status = "pending"`
            );
    
       
            const users = rows.map(row => ({
                userId: row.user_id,
                student_id: row.student_id,
                firstname: row.firstname,
                lastname: row.lastname,
                course_strand: row.course_strand,
                year: row.year_level,
                section: row.section,
                email: row.email,
                status: row.status,
                created_at: row.created_at,
                role: row.role,
                id_pic: row.id_pic || null 
            }));
    
            return users;
        } catch (err) {
            console.error('<error> User.get_approved', err);
            throw err;
        }
    }

    async get_an_approval(user_id){
        
        try{
            const [rows] = await this.connect_db.execute(
                `SELECT ua.user_id, ua.student_id, ua.firstname, ua.lastname, 
                        ua.course_strand, ua.year_level, ua.section, ua.email, 
                        ua.status, ua.created_at, ua.role, 
                        ui.file_path AS id_pic
                 FROM user_account ua
                 LEFT JOIN upload_image ui
                 ON ua.user_id = ui.user_id AND ui.image_type = "id_pic"
                 WHERE ua.status = "pending" AND ua.user_id = ? `,
                 [user_id]
            );
            const users = rows.map(row => ({
                userId: row.user_id,
                student_id: row.student_id,
                firstname: row.firstname,
                lastname: row.lastname,
                course_strand: row.course_strand,
                year: row.year_level,
                section: row.section,
                email: row.email,
                status: row.status,
                created_at: row.created_at,
                role: row.role,
                id_pic: row.id_pic || null 
            }));
            return users;
    
            
        }catch (err) {
            console.error('<error> User.get_an_approval', err);
            throw err;
        }
    }

    async get_approved_user(){
        try{
            const [rows] = await this.connect_db.execute(
                `SELECT ua.user_id, ua.student_id, ua.firstname, ua.lastname, 
                        ua.course_strand, ua.year_level, ua.section, ua.email, 
                        ua.status, ua.created_at, ua.role, 
                        ui.file_path AS id_pic
                 FROM user_account ua
                 LEFT JOIN upload_image ui
                 ON ua.user_id = ui.user_id AND ui.image_type = "id_pic"
                 WHERE ua.status = "approved" `
                
            );
            const users = rows.map(row => ({
                userId: row.user_id,
                student_id: row.student_id,
                firstname: row.firstname,
                lastname: row.lastname,
                course_strand: row.course_strand,
                year: row.year_level,
                section: row.section,
                email: row.email,
                status: row.status,
                created_at: row.created_at,
                role: row.role,
                id_pic: row.id_pic || null 
            }));
            return users;
    

        

    }catch (err) {
            console.error('<error> User.get_approved_user', err);
            throw err;
        }
    

    }

    async get_an_approved(user_id){
        
        try{
            const [rows] = await this.connect_db.execute(
                `SELECT ua.user_id, ua.student_id, ua.firstname, ua.lastname, 
                        ua.course_strand, ua.year_level, ua.section, ua.email, 
                        ua.status, ua.created_at, ua.role, 
                        ui.file_path AS id_pic
                 FROM user_account ua
                 LEFT JOIN upload_image ui
                 ON ua.user_id = ui.user_id AND ui.image_type = "id_pic"
                 WHERE ua.status = "approved" AND ua.user_id = ? `,
                 [user_id]
            );
            const users = rows.map(row => ({
                userId: row.user_id,
                student_id: row.student_id,
                firstname: row.firstname,
                lastname: row.lastname,
                course_strand: row.course_strand,
                year: row.year_level,
                section: row.section,
                email: row.email,
                status: row.status,
                created_at: row.created_at,
                role: row.role,
                id_pic: row.id_pic || null 
            }));
            return users;
    
            
        }catch (err) {
            console.error('<error> User.get_an_approval', err);
            throw err;
        }
    }






    // async getUserEmail(email){
    //     const [getemail] =await connection.execute(
    //          'SELECT * FROM users_account WHERE email = ? LIMIT 1'
    //          [email]
    //     );
    //    return getemail.length > 0? getemail[0]: null;
    
    // }
    
    async updateUser( user_id,course_strand, year_level, section, email, password){

        try{
           
            const[result] = await connection.execute(
                'UPDATE user_account SET course_strand= ?, year_level=?, section=?, email=?, password=? WHERE user_id=?',
                [ course_strand, year_level, section, email, password, user_id]
            );
            return result;

        }catch(err){
            console.log('<error> User.updateUser', err);
            throw err;
        }
    }

    async deleteUser(user_id){
        try{
            const[result] = await this.connect_db.execute(
                'DELETE FROM user_account WHERE user_id=?',
                [user_id]
            );
            return result;
        }catch (err) {
            console.error('<error> User.deleteUser', err);
            throw err;
        }
    }

    // async log_out(user_id){
    //     try{

    //     }catch (err) {
    //         console.error('<error> User.log_out', err);
    //         throw err;
    //     }
    // }

    async forgot_password(email, user_id, password){
        try{

            const [result] = await this.connect_db.execute(
                'UPDATE user_account SET password=? WHERE email = ? AND user_id = ?'
                [password,email, user_id]
            );

            return result;



        }catch (err) {
            console.error('<error> User.forgot_password', err);
            throw err;
        }
    }


}

export default User;