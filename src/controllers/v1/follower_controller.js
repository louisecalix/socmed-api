import { Followers } from "../../models/follower.js";
import Notification from '../../models/notification.model.js';
import User from '../../models/users.js';

class FollowersController{
    constructor(){
        this.followers = new Followers();
        this.notificationModel = new Notification();
        this.userModel = new User();
    }


    async followUser(req, res){
        const{ following_id} = req.params;
        const user_id = res.locals.user_id;
        console.log(user_id);


        try{
            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;

            const  { insertResult, follower_name, following_name }   = await this.followers.follow_User(user_id, following_id);
            const notificationMessage = ` followed you.`;
            //notif
            await this.notificationModel.createNotification(following_id, user_id, 'follow', null, notificationMessage);
            
            res.json({
                success: true,
                
                message:'Followed',

                data:{
                    follower_id: user_id,
                    follower_name,
                    following_id,
                    following_name,
                    insertResult
                }
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

    async unfollowUser(req, res) {
        const { following_id } = req.params;
        const user_id = res.locals.user_id;
        try{
            const result = await this.followers.unfollow_User(user_id, following_id);

            res.json({
                success: true,
                
                message:'unFollowed',
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

    async getUserFollowers(req, res){
        // const {user_id} = req.params;
        const user_id = res.locals.user_id;
        console.log(user_id);
        try{

            const result = await this.followers.get_user_followers(user_id);

            res.json({
                success: true,
                data: result
            });

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }

    async getUserFollowings(req, res){
        // const {user_id} = req.params;
        const user_id = res.locals.user_id;
        try{

            const result = await this.followers.get_user_following(user_id);

            res.json({
                success: true,
                data: result
            });

        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }








}

export default FollowersController