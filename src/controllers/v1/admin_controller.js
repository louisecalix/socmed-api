
import {Admin} from '../../models/admin.js';
import  jwt  from 'jsonwebtoken';

class AdminController{
    constructor(){
        this.admin = new Admin;
    }

    async create_admin(req, res){
        const{email, password} = req.body || {};
        try{
            const {response} = await this.admin.create_admin(email, password);
            res.json({
                success: true, 
                data:{
                    record_index: response?.insertId
                },
            });
            res.end();

        }catch(err){
            res.json({
                success:false,
                message: err.toString(),
            });
            res.end();
        }
    }

    async admin_login(req, res) {
        try {
            const { email, password } = req.body || {};                                                                               
            const result = await this.admin.verify(email, password);
    
            if (!result || result.role !== 'admin') {
                return res.json({
                    success: false,
                    message: 'Invalid email, password, or unauthorized access',
                });
            }
    
         
            res.json({
                success: true,
                data: {
                    token: jwt.sign(
                        { email: result.email, role: result.role }, 
                        process.env.API_SECRET_KEY,
                        { expiresIn: '1d' }
                    ),
                },
            });
            res.end();
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }
    

    async updateAdmin(req, res){
        const {admin_id} = req.params;

        const{email, password}= req.body || {};

        try{
            const result = await this.admin.updateAdmin( admin_id,email, password);

            if (result.affectedRows >0){
                res.json({
                    success: true,
                    message: 'Admin updated successfully',
                });
            }else{
                return res.json({
                    success: false,
                    message: 'Admin not found',
                });
            }

            
        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
              

            });
        }


    }

    
    async deleteAdmin(req, res){
        const{admin_id} = req.params;

        try{
            const result = await this.admin.delete_admin(admin_id);
            if(result.affectedRows ===0){
                return res.json({
                    success: false,
                    message: 'Admin not found or already deleted',
                });

            }
            res.json({
                success: true,
                message: 'Admin account deleted successfully',
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

}

export default AdminController;