import Group_Comments from "../../models/group_comments._Model.js";
import Notification from '../src/models/notification.model.js';
import GroupPost from '../../models/groupPost_model.js';
import User from '../src/models/users.js';
import { Group } from "../src/models/groups_model.js";

class Group_Comments_Controller{
    constructor(){
        this.groupComments= new Group_Comments
        this.notificationModel = new Notification();
        this.GroupPostModel = new GroupPost();
        this.userModel = new User();
        this.group = new Group();

    }

    async createGroupComment(req, res){
        const { group_id,user_id, group_post_id } = req.params;
        const { content, parent_id } = req.body || {};
        try {
            const group_name = await this.group.get_group(group_id);
            const groupname = group_name.group_name;

            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;

            const result = await this.groupComments.create_GroupComment(group_id, user_id, group_post_id, parent_id, content);

            const post = await this.GroupPostModel.get_group_post(group_post_id);
            const postOwnerId = post.user_id;

            const notificationMessage = `${first_name} commented on your post in the ${groupname} group page.`;

            await this.notificationModel.createNotification(postOwnerId, user_id, 'comment', null, group_id, group_post_id, notificationMessage);
            res.json({
                success: true,
                data: {groupcomment_id:result?.insertId},
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message:'Post not found.',
            });
            res.end();
        }
    }
    // get all comments of a post

    async getAllComments(req, res){
        const {group_id, group_post_id} = req.params;
        try{
            const result= await this.groupComments.get_AllComments(group_id, group_post_id);

            res.json({
                success: true,
                data:{ result
                    // groupcomment_id: result.groupcomment_id,
                    // user_id:result.user_id,
                    // content: result.content,
                    // created_at: result.created_at
                    

                }
            });
            res.end();

        } catch (err) {
            res.json({
                success: false,
                message:'No comments found.',
            });
            res.end();
        }
    }

    async getComment(res, req){

        const{groupcomment_id}= req.params;
        try {
            const result = await this.groupComments.getComment(groupcomment_id);
            res.json({
                success: true,
                data:{ result

                }
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message: 'Comment not found.',
            });
            res.end();
        }
    }

    async get_UserComments(req, res){
        const {user_id} = req.params;
        try {
            const result = await this.groupComments.getUserComments(user_id);
            res.json({
                success: true,
                data: { 
                    groupcomment_id: result.groupcomment_id,
                    user_id:result.user_id,
                    content: result.content,
                    created_at: result.created_at
                    },
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message:  'User not found.',
            });
            res.end();
        }
    }

    async deleteComment(req, res){
        const {group_id, user_id, group_post_id, groupcomment_id} = req.params;

        try{ const result = await this.groupComments.deleteComment(group_id, user_id, group_post_id, groupcomment_id);
            res.json({
                success: true,
                message: 'Comment deleted.'
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message:'Comment not found.',
            });
            res.end();
        }


    }


    }


    


    


export default Group_Comments_Controller;