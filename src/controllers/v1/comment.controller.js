import Comment from "../../models/comment.model.js";
import Notification from '../../models/notification.model.js';
import Post from '../../models/post.model.js';
import User from '../../models/users.js';

class CommentController {
    constructor() {
        this.comment = new Comment();
        this.notificationModel = new Notification();
        this.postModel = new Post();
        this.userModel = new User();
    }

    async createComment(req, res) {
        const user_id = res.locals.user_id;
        const { post_id } = req.params;
        const { content } = req.body || {};

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required to comment.',
            });
        }

        try {
            const result = await this.comment.createComment(user_id, post_id, content,);

            const post = await this.postModel.getPost(post_id);
            const postOwnerId = post.user_id;

            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;
            // for notif
            const notificationMessage = `commented on your post.`;
            await this.notificationModel.createNotification(postOwnerId, user_id, 'comment', post_id, notificationMessage);

            res.json({
                success: true,
                data: result,
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


    async createReply(req, res) {
        const user_id = res.locals.user_id;
        const { post_id, parent_id } = req.params;
        const { content } = req.body || {};
    
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required to reply in a comment',
            });
        }
    
        try {
            const replyId = await this.comment.createReply(user_id, post_id, content, parent_id);
    
            const parentComment = await this.comment.getComment(parent_id);
            const parentCommentUserId = parentComment.user_id;
    
            const account = await this.userModel.getUser(user_id);
            const first_name = account.firstname;
    
            // const notificationMessage = `${first_name} replied to your comment.`;
            // await this.notificationModel.createNotification(
            //     parentCommentUserId,
            //     user_id,
            //     'reply',
            //     post_id,
            //     replyId,
            //     parent_id,
            //     notificationMessage
            // );
    
            res.json({
                success: true,
                data: { replyId },
            });
        } 
        catch (err) {
            console.error('<error> commentController.createReply', err);
    
            res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }
    


    async deleteComment(req, res) {
        const user_id = res.locals.user_id;
        const { comment_id } = req.params;
        try {
            const comment = await this.comment.getComment(comment_id);
            if (comment.user_id !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only delete your own comment",
                });
            }
        
            const result = await this.comment.deleteComment(comment_id);
            res.json({
                success: true,
                data: result,
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

    async getPostComments(req, res) {
        const { post_id } = req.params;
        try {
            const result = await this.comment.getPostComments(post_id);
            res.json({
                success: true,
                data: result,
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

    async getComment(req, res) {
        const { comment_id } = req.params;
        try {
            const result = await this.comment.getComment(comment_id);
            res.json({
                success: true,
                data: result,
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

    async getUserComments(req, res) {
        const user_id = res.locals.user_id;
        try {
            const result = await this.comment.getUserComments(user_id);
            res.json({
                success: true,
                data: result,
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


    async getCommentReplies(req, res) {
        const { comment_id } = req.params;
        try {
            const result = await this.comment.getReplies(comment_id);
            res.json({
                success: true,
                data: result,
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

export default CommentController;
