import jwt from 'jsonwebtoken';
import {User} from '../../models/users.js';
import { Admin } from '../../models/admin.js';
// import UploadController from '../../../archive/convert_img.js';
import formidable from 'formidable';
import UploadFile from '../../models/upload_Model.js';
import fs from "fs"; 
import path from "path"; 
import { console } from "inspector";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AccountController{
    constructor(){

        this.user= new User();
        // this.uploads = new UploadController();
        this.upload_file = new UploadFile();
    }   
  
    async createUser(req, res) {
        const form = formidable({ multiples: true });
    
        const uploadDir = path.join(__dirname, '../../../static/uploads');
    

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to parse form data',
                });
            }
    
            const { student_id, firstname, lastname, course_strand, year_level, section, email, password } = fields;
    
            if (!student_id || !firstname || !lastname || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields.',
                });
            }
    
            try {
                const response = await this.user.create_user(
                    student_id, firstname, lastname, course_strand, year_level, section, email, password
                );
                console.log(response);
    
                const user_id = response?.insertId; 
                if (!user_id) {
                    throw new Error('Failed to retrieve user ID.');
                }
                console.log('User created with ID:', user_id);
    
                const file = files.image ? files.image[0] : null;
    
                if (!file || !file.filepath) {
                    console.error('File path is missing or incorrect field name.');
                    return res.status(400).send('File path is missing or incorrect field name.');
                }

                const image = await this.upload_file.upload_id(user_id, file )
    
               
                const imagePath = `/uploads/${file.originalFilename || file.newFilename}`;
    
                res.json({
                    success: true,
                    data: {
                        student_id,
                        firstname,
                        lastname,
                        year_level,
                        course_strand,
                        section,
                        user_id,
                        image
                    },
                });
            } catch (error) {
                console.error(`Error creating user: ${error.message}`);
                return res.status(500).json({
                    success: false,
                    message: `Failed to create user: ${error.message}`,
                });
            }
        });
    }
    
    async create_admin(req, res){
        const form = formidable({ multiples: true });
    
        // Correct path for the uploads folder inside The-Wall-API directory
        const uploadDir = path.join(__dirname, '../../The-Wall-API/uploads');
    
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to parse form data',
                });
            }
    
            const { student_id, firstname, lastname, course_strand, year_level, section, email, password } = fields;
    
            if (!student_id || !firstname || !lastname || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields.',
                });
            }
    
            try {
                const response = await this.user.create_admin(
                    student_id, firstname, lastname, course_strand, year_level, section, email, password
                );
                console.log(response);
    
                const user_id = response?.insertId; 
                if (!user_id) {
                    throw new Error('Failed to retrieve user ID.');
                }
                console.log('User created with ID:', user_id);
    
                const file = files.image ? files.image[0] : null;
    
                if (!file || !file.filepath) {
                    console.error('File path is missing or incorrect field name.');
                    return res.status(400).send('File path is missing or incorrect field name.');
                }

                const image = await this.upload_file.upload_id(user_id, file);
    

                const filePath = path.join(uploadDir, file.originalFilename || file.newFilename);
                fs.renameSync(file.filepath, filePath);
    
                const imagePath = `/uploads/${file.originalFilename || file.newFilename}`;
    
                res.json({
                    success: true,
                    data: {
                        student_id,
                        firstname,
                        lastname,
                        year_level,
                        course_strand,
                        section,
                        user_id,
                        image
                    },
                });
            } catch (error) {
                console.error(`Error creating user: ${error.message}`);
                return res.status(500).json({
                    success: false,
                    message: `Failed to create user: ${error.message}`,
                });
            }
        });
    }

    async approve_user(req, res){
        const {user_id} = req.params;
   

        try{
            const result = await this.user.approveUser(user_id);

            if (result.affectedRows ===0){
                return res.json({
                    success: false,
                    message: 'Approval not found',
                    
                });
            }

    

            res.json({
                success: true,
                message: 'User: Approved!',
            });
        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    


    }

    async approveAll(req, res){

        try{
            const result = await this.user.approve_all();
            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: 'Approval not found ',
                });


            }
            res.json({
                success: true,
                message: 'Users approved successfully',
            });

            res.end();

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }

    


    async declineUser(req, res){
        const {user_id} = req.params;

        try{
            const response = await this.user.declineUser(user_id);
            if (response.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: 'Approval not found or already declined',
                });
            }

            res.json({
                success: true,
                message: 'User declined successfully',
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
        }

        async declineAll(req, res){
            try{
                const result = await this.user.decline_all();
                if (result.affectedRows === 0) {
                    return res.json({
                        success: false,
                        message: 'Approval not found or already declined',
                    });

                }

                res.json({
                    success: true,
                    message: 'User declined successfully',
                });

                res.end();
            }catch (err) {
                res.json({
                    success: false,
                    message: err.toString(),
                });
        }
    }



    
    async getAllUser(req, res) {
        try {
  
            const approvals = await this.user.getAllUsers();
    
           
            if (!approvals || approvals.length === 0) {
                return res.json({
                    success: false,
                    message: 'No users found',
                });
            }
    
          
            const approvalData = approvals.map(approval => ({
                approval_id: approval.approval_id,
                student_id: approval.student_id,
                firstname: approval.firstname,
                lastname: approval.lastname,
                course_strand: approval.course_strand,
                year_level: approval.year_level,
                section: approval.section,
                email: approval.email,
                status: approval.status,
                created_at: approval.created_at,
                id_pic: approval.idpic,  
                role: approval.role,
            }));
    
       
            res.json({
                success: true,
                data: approvalData,
            });
        } catch (err) {
        
            res.json({
                success: false,
                message: err.toString(),
            });
        } finally {
            res.end();
        }
    }
    
    async getUser(req, res) {
        const user_id = res.locals.user_id;
    
        try {
            const response = await this.user.getUser(user_id);
    
            res.json({
                success: true,
                data: {
                    userId: response.user.user_id,
                    student_id: response.user.student_id,
                    firstname: response.user.firstname,
                    lastname: response.user.lastname,
                    course_strand: response.user.course_strand,
                    year: response.user.year_level,
                    section: response.user.section,
                    email: response.user.email,
                    status: response.user.status,
                    created_at: response.user.created_at,
                    role: response.user.role,
                    id_pic: response.id.file_path, // Assuming `file_path` is the column name for the image path
                }
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }
    
    async updateUser(req, res){
        const user_id = res.locals.user_id;

        const{course_strand, year, section, email, password}= req.body || {};

        try{
            const result = await this.user.updateUser(user_id,course_strand, year, section, email, password);

            if (result.affectedRows >0){
                res.json({
                    success: true,
                    message: 'User updated successfully',
                });
            }else{
                res.json({
                    success: false,
                    message: 'User not found',
                });
            };

            res.end();



            
        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
              

            });
            res.end();
            
        }

    }

    async login(req, res) {
        try {
            const { email, password } = req.body || {};
            const result = await this.user.verify(email, password);
    
            const user_id = result?.[0]?.user_id;
            const role = result?.[0]?.role; 
    
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }
    
            const token = jwt.sign({ user_id, email }, process.env.API_SECRET_KEY, {
                expiresIn: '7d',
            });
    
            let adminToken = null;
            if (role === 'admin') {
                adminToken = jwt.sign({ user_id, role }, process.env.API_SECRET_KEY, {
                    expiresIn: '7d',
                });
            }
    
            res.json({
                success: true,
                data: {
                    user_id,
                    role,
                    token,
                    adminToken, 
                },
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }
    
    
    async deleteUser(req, res){
        const{user_id} = req.params;

        try{
            const result = await this.user.deleteUser(user_id);
            if(result.affectedRows ===0){
                return res.json({
                    success: false,
                    message: 'User not found or already deleted',
                });

            }
            res.json({
                success: true,
                message: 'User account deleted successfully',
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }
    async log_out(req, res) {
        try {
           
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while logging out'
            });
        }
    }

    async forgotPassword(req, res){
        const user_id = res.locals.user_id;

        const {email} = req.body || {};

        try{

            const result = await this.user.forgot_password(email, user_id);

            res.json({
                success: true,
                message: "Password Reset"
            });   res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }

    async getApproved(req, res) {
        try {
            const users = await this.user.get_approved();
    
            res.json({
                success: true,
                data: users 
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }

    async getAnApproval(req, res){
        const {user_id}= req.params;

        try{
            const result = await this.user.get_an_approval(user_id);

            res.json({
                success: true,
                data: result
            });

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    
    }
    async getApprovedUser(req, res){
        

        try{
            const result = await this.user.get_approved_user();

            res.json({
                success: true,
                data: result
            });

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    

    }
    async getAnApproved(req, res){
        const {user_id}= req.params;

        try{
            const result = await this.user.get_an_approved(user_id);

            res.json({
                success: true,
                data: result
            });

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    
    }
    

}

export default AccountController;