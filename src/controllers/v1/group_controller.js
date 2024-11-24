import jwt from 'jsonwebtoken';
import { Group } from "../../models/groups_model.js";
import Notification from '../../models/notification.model.js';
import User from '../../models/users.js';


class GroupController{
    constructor(){
        this.group = new Group();
        this.notificationModel = new Notification();
        this.userModel = new User();

    }

   

    async create_group(req, res) {
        console.log('Request Body: ', req.body);
        const { group_name, description } = req.body || {};
        const user_id = res.locals.user_id;
    
        try {
            
            const response = await this.group.create_group(group_name, description, user_id);
    
            const group_id = response?.group_id;
            console.log(group_id);
    
           
            const group = await this.group.add_group_admin(group_id, user_id);
    
        
            const groupToken = jwt.sign(
                { group_id },
                process.env.API_SECRET_KEY,
                { expiresIn: '7d' } 
            );
    
          
            const groupAdminToken = jwt.sign(
                { admin_id: user_id, group_id, role: 'Admin' },
                process.env.API_SECRET_KEY,
                { expiresIn: '7d' } 
            );
    
          
            res.json({
                success: true,
                data: {
                    group_id,
                    group_name: group_name,
                    description: description,
                    groupToken,
                    groupAdminToken,
                },
            });
            res.end();
        } catch (err) {
            console.error('<error> GroupController.create_group', err);
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }
    
    
    async getGroup(req, res){
        const group_id = res.locals.group_id;
        console.log(group_id);

        try{
            const getgroup = await this.group.get_group(group_id);
            if (!getgroup){
                return res.json({
                    success: false,
                    message: 'Group not found',

                });

            }

            res.json({
                success: true,
                data: {
                    group_id: getgroup.group_id,
                    group_name: getgroup.group_name,
                    description: getgroup.description,
                    created_by: getgroup.created_by,
                    created_at: getgroup.created_at
                },
            });
        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
            });
        }


    }

    async getAllGroups(req, res){
        
        try{
            const allgroups = await this.group.get_all_groups();

            if(!allgroups || allgroups ===0){
                return res.json({
                    success: false,
                    message: 'No groups found',
                });

            }

            const allgroupsdata = allgroups.map(getgroup =>({
                group_id: getgroup.group_id,
                group_name: getgroup.group_name,
                description: getgroup.description,
                created_by: getgroup.created_by,
                created_at: getgroup.created_at
                
            }));
            res.json({
                success: true,
                data: allgroupsdata,
            });

            res.end();

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });

            res.end();
        }

    }

    async get_UsersGroup(req, res){
        const user_id = res.locals.user_id;

        try{
            const result = await this.group.get_usersGroup(user_id);

            
            if(!result || result ===0){
                res.json({
                    success: false,
                    message: 'No groups found',
                });
            }

            res.json({
                success: true,
                data:result
            });

            res.end();

         
        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end()
        }
    }


   

    async add_GroupAdmin(req, res) {
        console.log('Request Body: ', req.body);
    
        const group_id = res.locals.group_id;
        const { user_id } = req.body || {};
    
       
        if (!group_id || !user_id) {
            return res.json({
                success: false,
                message: 'Group id and user_id required'
            });
        }
    
        try {
          
    
         
            const response = await this.group.add_group_admin(group_id, user_id);
            
           
            if (!response) {
                return res.json({
                    success: false,
                    message: 'Failed to add admin. Please try again.'
                });
            }

            
            const groupToken = jwt.sign(
                { group_id },
                process.env.API_SECRET_KEY,
                { expiresIn: '7d' } 
            );
    
            const groupAdminToken = jwt.sign(
                { admin_id: user_id, group_id, role: 'Admin' },
                process.env.API_SECRET_KEY,
                { expiresIn: '7d' } 
            );
    
          
            res.json({
                success: true,
                data: {
                    group_id,
                    groupToken,
                    groupAdminToken,
                },
            });
    
        } catch (err) {
            console.error('Error adding group admin:', err); // Log the error for debugging
            return res.json({
                success: false,
                message: err.toString(),
            });
        }
    }
    

    async submit_joinRequest(req, res){
        const{group_id} = req.params;
        const user_id = res.locals.user_id;

        console.log("req params: ", req.params);
        console.log(user_id);
        try{
            const response = await this.group.submit_joinRequest(group_id, user_id);

            res.json({
                success: true,
                message: 'Waiting for admin to approve.'

            });
            res.end()
        }catch (err) {
            res.json({
                success: false,
                message: 'Group not found',
            });
            res.end();
        }


    }


    //admin will add their member in group creation(like send an invite)
    async add_GroupMembers(req, res){
        console.log('Request Body: ', req. body);

        const {group_id, user_id} = req.body || {};

        if (!group_id || !user_id ){
            res.json({
                success: false,
                message: 'Group id and user_id required'
            });
        }

        try{
            const response= await this.group.add_group_members(group_id,user_id);

            res.json({
                success: true,
                message: 'Waiting admin to approve.',
                
            });
            res.end();

        }catch (err) {
            res.json({
                success: false,
                message: 'User not found',
            });
            res.end();
        }
    }

    async approve_members(req, res){
        console.log(req.params)
        const group_id = res.locals.group_id;
        const {user_id} = req.params;
        console.log(group_id);

        try{
            // const group_page = await this.group.get_group(group_id);
            // const groupname = group_page.group_name;

            // const group = await this.group.get_group(group_id);
            // const admin = group.created_by;
             
            const result = await this.group.approve_group_members(group_id, user_id);
            // const notificationMessage = `You have been approved to the ${groupname} group.`;
            // //notif
            // await this.notificationModel.createNotification(admin, user_id, 'approve', null ,notificationMessage);

            if (result.affectedRows ===0){
                return res.json({
                    success: false,
                    message: 'Approval not found',
                    
                });
            }

            const token = jwt.sign({user_id: result.user_id }, process.env.API_SECRET_KEY, {
                expiresIn: '2d',
         
            });

            const groupToken = jwt.sign({ group_id, user_id }, process.env.API_SECRET_KEY, {
                expiresIn: '2d',
            });
            res.json({
                success: true,
                message: 'User: Approved!',
                data:{
                    membership_id: result.insertId,
                  
                    groupToken: groupToken
                }
            });
            res.end();

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }

    async decline_member(req,res){
        const { user_id} = req.params;
        const group_id = res.locals.group_id;
        try{
            const group_page = await this.group.get_group(group_id);
            const groupname = group_page.group_name;

            const group = await this.group.get_group(group_id);
            const admin = group.created_by;

            const result = await this.group.decline_group_members(group_id, user_id);

            const notificationMessage = `You have been declined to the ${groupname} group.`;
            //notif
            await this.notificationModel.createNotification(admin, user_id, 'declined', null, notificationMessage);

            res.json({
                success: true,
                message: 'Declined.'
            });
            res.end();
        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }


    }

    async update_Role(req, res){
        const group_id = res.locals.group_id;
        const { user_id} = req.params;
        const {role} = req.body ||{};

        if (!group_id || !user_id) {
            res.json({
                success: false,
                message: 'Missing group_id or user_id in path parameters'
            });
        }

    
        if (!role || (role !== 'admin' && role !== 'member')) {
            res.json({
                success: false,
                message: 'Invalid or missing role. Role must be "admin" or "member"'
            });
        }

        try{
            const result = await this.group.update_role(group_id, user_id, role);

            if (result.affectedRows ===0){
                res.json({
                    success: false,
                    message: 'Can not update the role.'
                });
            }

            res.json({
                success: true,
                message: 'Member role updated.'
            });


        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
              

            });
        }

    }

    async update_GroupInfo(req, res){
        // const {group_id} = req.params;
        const group_id = res.locals.group_id;

        const{group_name, description} = req.body || {};

      

        try{

            const result = await this.group.update_groupInfo(group_id, group_name, description);

            if (result.affectedRows ===0){
                res.json({
                    success: false,
                    message: 'Can not update the group information.'
                });
            }

            res.json({
                success: true,
                data:{
                    group_name: group_name,
                    description: description
                }
            });




        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
              

            });
        }

    


    }

    async deleteGroup(req, res){
        const {group_id} = req.params;


        try{
            const result = await this.group.delete_group(group_id);

            res.json({
                success: true,
                message: 'Group deleted',
            });
        }catch(err){
            res.json({
                success:false,
                message:'Group not found.',
              

            });
        }

    }




}

export default GroupController;