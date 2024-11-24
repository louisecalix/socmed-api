import Like from "../../models/groupLikes_model.js";
import GroupPost from '../../models/groupPost_model.js';
import User from '../src/models/users.js';
import { Group } from "../src/models/groups_model.js";
import Notification from '../src/models/notification.model.js';

class LikeController{
    constructor(){
        this.group = new Group();
        this.groupLike = new Like();
        this.notificationModel = new Notification();
        this.GroupPostModel = new GroupPost();
        this.userModel = new User();
    }

    async likeGroupPost(req, res){
        const{group_id, group_post_id,user_id } = req.params;

        try {
            const group_name = await this.group.get_group(group_id);
            const groupname = group_name.group_name;

            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;

            const result = await this.groupLike.like_groupPost(group_id, group_post_id,user_id);

            const post = await this.GroupPostModel.get_group_post(group_id,user_id,group_post_id);
            const postOwnerId = post.user_id;
            console.log(postOwnerId);
            // console.log(user_id);

            const notificationMessage = `${first_name} liked your post in the ${groupname} group page.`;
            console.log(notificationMessage);
            await this.notificationModel.createNotification(user_id, user_id, 'like', null, group_id, group_post_id, notificationMessage);
            res.json({
                success: true,
                data:{grouplike_id: result.grouplike_id}
            });
        }
        catch (err) {
            res.json({
                success: false,
                message:'Post not found'
            });
            res.end();
        }


    }

    async unlikeGroupPost(req, res) {
        const { grouplike_id, group_id,user_id} = req.params;
        try {
            const result = await this.groupLike.unlike_groupPost(grouplike_id, group_id,user_id);
            res.json({
                success: true,
                message: 'Unliked'
            });
            res.end();
        }
        catch (err) {
            res.json({
                success: false,
                message: 'Post not found.'
            });
            res.end();
        }
    }










}
export default LikeController;