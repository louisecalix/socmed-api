
import { connection } from "../src/core/database.js";

class GroupPost{
    constructor(){
        this.db = connection;
    }

    async create_group_post(group_id,user_id, content){
        try {
            const [postResults] = await this.db.execute(
                'INSERT INTO group_posts(group_id,user_id, content) VALUES (?, ?, ?)',
                [group_id,user_id, content || null]
            );
            const group_post_id = postResults.insertId;

            const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
            if (hashtags.length > 0) {
                for (const hashtag of hashtags) {
                    const [existingHashtag] = await this.db.execute(
                        'SELECT group_hashtag_id FROM group_hashtags WHERE group_hashtag = ?',
                        [hashtag]
                    );

                    let hashtag_id;
                    if (existingHashtag.length > 0) {
                        hashtag_id = existingHashtag[0].hashtag_id;
                    } else {
                        const [insertHashtagResults] = await this.db.execute(
                            'INSERT INTO group_hashtags(hashtag) VALUES (?)',
                            [hashtag]
                        );
                        hashtag_id = insertHashtagResults.insertId;
                    }

                    await this.db.execute(
                        'INSERT INTO group_post_hashtags(group_post_hashtag_id, group_hashtag_id) VALUES (?, ?)',
                        [group_post_id, hashtag_id]
                    );
                }
            }
            return postResults;
        } catch (err) {
            console.error('<error> post.createPost', err);
            throw err;
        }
    }

// specific post of user in a group
async get_group_post(group_id, user_id, group_post_id) {
    console.log('group_id:', group_id, 'user_id:', user_id, 'group_post_id:', group_post_id);
    try {
        const [posts] = await this.db.execute(
            'SELECT * FROM group_posts WHERE group_id = ? AND user_id = ? AND group_post_id = ?',
            [group_id, user_id, group_post_id]
        );
        return posts;
    } catch (err) {
        console.error('<error> GroupPost.get_group_post', err);
        throw err;
    }
}

//get all post in a group
    async get_all_posts(group_id){
        try{
            const [all_posts] = await this.db.execute(
                'SELECT * FROM group_posts WHERE group_id= ?',
                [group_id]
            );
            return all_posts
        }catch(err){
            console.error('<error> GroupPost.get_all_posts', err);
            throw err;
        }
    }
//get all post of a user in a group
    async get_allUsergroupPost(group_id,user_id){
        try{
            const [result] = await this.db.execute(
                'SELECT * FROM group_posts WHERE group_id=? AND user_id = ?',
                [group_id, user_id]
            );
            return result;
        } catch (err) {
            console.error('<error> GroupPost.get_allUsergroupPost', err);
            throw err;
        }
    }

    async update_group_post(group_id, user_id,gp_id, content ){
        try{
            const [results] = await this.db.execute(
                'UPDATE group_posts SET content = ? WHERE group_id = ? AND user_id = ? AND group_post_id = ?',
                [content, group_id, user_id,  gp_id]
            );

            const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
    
            await this.db.execute(
                'DELETE FROM group_post_hashtags WHERE group_post_hashtag_id = ?',
                [gp_id]
            );
    
            if (hashtags.length > 0) {
                for (const hashtag of hashtags) {
                    const [existingHashtag] = await this.db.execute(
                        'SELECT hashtag_id FROM hashtags WHERE hashtag = ?',
                        [hashtag]
                    );
    
                    let hashtag_id;
                    if (existingHashtag.length > 0) {
                        hashtag_id = existingHashtag[0].hashtag_id;
                    } else {
                        const [insertHashtagResults] = await this.db.execute(
                            'INSERT INTO hashtags(hashtag) VALUES (?)',
                            [hashtag]
                        );
                        hashtag_id = insertHashtagResults.insertId;
                    }
    
                    await this.db.execute(
                        'INSERT INTO group_post_hashtags(group_post_hashtag_id, hashtag_id) VALUES (?, ?)',
                        [gp_id, hashtag_id]
                    );
                }
            }
    
            return results;

        } catch (err) {
            console.error('<error> GroupPost.update_group_post', err);
            throw err;
        }
    }

    async delete_group_post(g_id, user_id, gp_id){
        try{
            const[delete_gp] = await this.db.execute(
                'DELETE FROM group_posts WHERE group_id = ? AND user_id=? AND group_post_id= ? ',
                [g_id,user_id,gp_id]
            );

            if (delete_gp.affectedRows === 0 ){
                throw new Error("Group Post not found");
            }
            return {message: 'Group Post deleted!'};
        } catch (err) {
            console.error('<error> GroupPost.delete_group_post', err);
            throw err;
        }

    }


}

export default GroupPost;

