import { connection } from "../core/database.js";

class Like {
    constructor() {
        this.db = connection;
    }


    async getGroupId(post_id) {
        const [results] = await this.db.execute(
            'SELECT group_id FROM posts WHERE post_id = ?',
            [post_id]
        );
        // Return null if no results
        return results.length > 0 ? results[0].group_id : null;
    }
    
    async isUserInGroup(user_id, group_id) {
        const [results] = await this.db.execute(
            'SELECT COUNT(*) AS count FROM group_members WHERE user_id = ? AND group_id = ?',
            [user_id, group_id]
        );
        return results[0].count > 0;
    }
    
    async likePost(user_id, post_id) {
        try {
            // Fetch group_id, origin_id, and content for the post
            const [post] = await this.db.execute(
                'SELECT group_id, origin_id, content FROM posts WHERE post_id = ?',
                [post_id]
            );
    
            const { group_id, origin_id, content } = post[0];
    
            // Check if the user is part of the group (if it's a group post)
            if (group_id && !(await this.isUserInGroup(user_id, group_id))) {
                throw new Error('You cannot like because you are not a member of the group');
            }
    
            // Check if the post is a repost (origin_id not null and content is null)
            if (origin_id !== null && content === null) {
                throw new Error('Cannot like a repost');
            }

            await this.db.execute(
                'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
                [user_id, post_id]
            );
            
            const [likedPost] = await this.db.execute(
                'SELECT * FROM posts WHERE post_id = ?',
                [post_id]
            );

            // const [results,] = await this.db.execute(
            //     'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            //     [user_id, post_id]
            // );
            return likedPost[0];
    
        } catch (err) {
            console.error('<error> like.likePost', err);
            throw err;
        }
    }
    

    // CRUD - Delete like
    async unlikePost(user_id, like_id) {
        try {
            const [results,] = await this.db.execute(
                'DELETE FROM likes WHERE user_id = ? AND like_id = ?',
                [user_id, like_id]
            );
            return results;
        } catch (err) {
            console.error('<error> like.unlikePost', err);
            throw err;
        }
    }

    // CRUD - Read all likes by user
    async getUserLikes(user_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT l.*, 
                        p.username, 
                        img.file_path AS profile_pic
                 FROM likes l
                 JOIN profiles p ON l.user_id = p.user_id
                 LEFT JOIN upload_image img 
                 ON l.user_id = img.user_id AND img.image_type = 'profile_pic'
                 WHERE l.user_id = ?`,
                [user_id]
            );
    
            return results;
        } catch (err) {
            console.error('<error> like.getUserLikes', err);
            throw err;
        }
    }
    


    async getLike(like_id) {
        try {
            const [results] = await this.db.execute(
                'SELECT * FROM likes WHERE like_id = ?',
                [like_id]
            );
            return results[0];
        } catch (err) {
            console.error('<error> likeModel.getLike', err);
            throw err;
        }
    }


    async getPostLikes(post_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT user_account.user_id, user_account.firstname, user_account.lastname 
                 FROM likes 
                 JOIN user_account ON likes.user_id = user_account.user_id 
                 WHERE likes.post_id = ?`,
                [post_id]
            );
            return results;
        } catch (err) {
            console.error('<error> likeModel.getPostLikes', err);
            throw err;
        }
    }
    
}

export default Like;
