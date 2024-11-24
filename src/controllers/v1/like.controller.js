import Like from '../../models/like.model.js';
import Notification from '../../models/notification.model.js';
import Post from '../../models/post.model.js';
import User from '../../models/users.js';

class LikeController {
    constructor() {
        this.likeModel = new Like();
        this.notificationModel = new Notification();
        this.postModel = new Post();
        this.userModel = new User();
    }

    async likePost(req, res) {
        const user_id = res.locals.user_id;
        const { post_id } = req.params;
        try {
            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;

            const result = await this.likeModel.likePost(user_id, post_id);

            const post = await this.postModel.getPost(post_id);
            const postOwnerId = post.user_id;

            const notificationMessage = ` liked your post.`;

            await this.notificationModel.createNotification(postOwnerId, user_id, 'like', post_id, notificationMessage);

            res.json({
                success: true,
                data: 'Successfully Liked',
                likedPost: result
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }

    async unlikePost(req, res) {
        const user_id = res.locals.user_id;
        const { like_id } = req.params;
        try {

            const like = await this.likeModel.getLike(like_id);
            if (like.user_id !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only unlike your own likes."
                });
            }

            const result = await this.likeModel.unlikePost(user_id, like_id);
            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }

    async getUserLikes(req, res) {
        // const { user_id } = req.params;
        const  user_id  = res.locals.user_id;
        try {
            const result = await this.likeModel.getUserLikes(user_id);
            console.log(result);
            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            }); 
            res.end();
        }
    }

    
    async getPostLikes(req, res) {
        const { post_id } = req.params;
        try {
            const result = await this.likeModel.getPostLikes(post_id);
            res.json({
                success: true,
                data: result
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            }); 
            res.end();
        }
    }


}

export default LikeController;
