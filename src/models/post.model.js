import { connection } from "../core/database.js";

class Post {
    constructor() {
        this.db = connection;
    }


    // CRUD - Create
    async createPost(user_id, content, origin_id = null) {
        try {
            let postContent = content;
    
            // Handle repost logic if origin_id exists
            if (origin_id) {
                // Fetch only the content of the original post based on origin_id
                const [originalPostResult] = await this.db.execute(
                    'SELECT content FROM posts WHERE post_id = ?',
                    [origin_id]
                );
    
                if (originalPostResult.length > 0) {
                    // Use the content of the original post for the repost
                    postContent = originalPostResult[0].content; // Only use original post's content for the repost
                }
            }
    
            // Insert the new post with the determined content (only content)
            const [postResults] = await this.db.execute(
                'INSERT INTO posts(user_id, content, origin_id) VALUES (?, ?, ?)',
                [user_id, postContent || null, origin_id]
            );
            const post_id = postResults.insertId;
    
            // Fetch the inserted post details
            const [response] = await this.db.execute(
                'SELECT * FROM posts WHERE post_id = ?',
                [post_id]
            );
    
            // Retrieve the username
            const [userNameResult] = await this.db.execute(
                'SELECT username FROM profiles WHERE user_id = ?',
                [user_id]
            );
    
            const [pfpreturn] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
                [user_id, 'profile_pic']
            );
    
            const username = userNameResult.length > 0 ? userNameResult[0].username : null;
    
            // Handle hashtags in the content
            if (typeof content === 'string') {
                const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
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
                            'INSERT INTO post_hashtags(post_hashtag_id, hashtag_id) VALUES (?, ?)',
                            [post_id, hashtag_id]
                        );
                    }
                }
            }
    
            return { post_id, username, pfpreturn, response };
        } catch (err) {
            console.error('<error> post.createPost', err);
            throw err;
        }
    }
     


    // POST IN GROUPS
    async createPostGroup(user_id, content, group_id = null) {
        try {
            if (group_id && !await this.isUserInGroup(user_id, group_id)) {
                throw new Error('You can not post bacause you are not a member of the group');
            }


            const [postResults] = await this.db.execute(
                'INSERT INTO posts(user_id, content, group_id) VALUES (?, ?, ?)',
                [user_id, content || null, group_id]
            );
            const post_id = postResults.insertId;

            const [response] = await this.db.execute(
                'SELECT * FROM posts WHERE post_id = ?',
                [post_id]
            );

            const [userNameResult] = await this.db.execute(
                'SELECT username FROM profiles WHERE user_id = ?',
                [user_id]
            );
    
           const [pfpreturn] = await this.db.execute(
            'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
            [user_id, 'profile_pic']
           );
            const username = userNameResult.length > 0 ? userNameResult[0].username : null;
            // const post_id = postResults.insertId;

            // if (typeof content === 'string') {
            //     const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
            //     if (hashtags.length > 0) {
            //         for (const hashtag of hashtags) {
            //             const [existingHashtag] = await this.db.execute(
            //                 'SELECT hashtag_id FROM hashtags WHERE hashtag = ?',
            //                 [hashtag]
            //             );

            //             let hashtag_id;
            //             if (existingHashtag.length > 0) {
            //                 hashtag_id = existingHashtag[0].hashtag_id;
            //             } else {
            //                 const [insertHashtagResults] = await this.db.execute(
            //                     'INSERT INTO hashtags(hashtag) VALUES (?)',
            //                     [hashtag]
            //                 );
            //                 hashtag_id = insertHashtagResults.insertId;
            //             }

            //             await this.db.execute(
            //                 'INSERT INTO post_hashtags(post_hashtag_id, hashtag_id) VALUES (?, ?)',
            //                 [post_id, hashtag_id]
            //             );
            //         }
            // //     }
            // }
            return {post_id,username,pfpreturn,response};
        } catch (err) {
            console.error('<error> post.createPost', err);
            throw err;
        }
    }



    // CRUD - Read specific post

    async getPost(post_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT p.*, 
                        pr.username, 
                        img.file_path AS profile_pic
                 FROM posts p
                 JOIN profiles pr ON p.user_id = pr.user_id
                 LEFT JOIN upload_image img 
                 ON p.user_id = img.user_id AND img.image_type = 'profile_pic'
                 WHERE p.post_id = ?`,
                [post_id]
            );
    
            return results?.[0] || null;
        } catch (err) {
            console.error('<error> post.getPost', err);
            throw err;
        }
    }
    



    // Read all posts by user

    async getAllUserPosts(user_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT p.*, 
                        pr.username, 
                        img.file_path AS profile_pic
                 FROM posts p
                 JOIN profiles pr ON p.user_id = pr.user_id
                 LEFT JOIN upload_image img 
                 ON p.user_id = img.user_id AND img.image_type = 'profile_pic'
                 WHERE p.user_id = ? AND p.group_id IS NULL`,
                [user_id]
            );
    
            // Sort the posts by 'created_at' in descending order (most recent first)
            results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
          
            
            return results.map(post => ({
                ...post,
                profile_pic: post.profile_pic || null, 
            }));
        } catch (err) {
            console.error('<error> post.getAllUserPosts', err);
            throw err;
        }
    }
    

    // FOR GROUP POSTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
    async getUserGroupPosts(user_id, group_id) {
        try {
            // const [results] = await this.db.execute(
            //     'SELECT * FROM posts WHERE user_id = ? AND group_id = ?',
            //     [user_id, group_id]
            // );
            // return results;
            const [postWithUserDetails] = await this.db.execute(
                `SELECT p.*, pr.username, ui.file_path AS profile_picture
                 FROM posts p
                 JOIN profiles pr ON p.user_id = pr.user_id
                 LEFT JOIN upload_image ui ON p.user_id = ui.user_id AND ui.image_type = 'profile_pic'
                 WHERE p.post_id = ?`,
                [post_id]
            );
    
            return postWithUserDetails[0];
        } catch (err) {
            console.error('<error> post.getUserPostsInGroup', err);
            throw err;
        }
    }


    // CRUD - Update post

   
    async updatePost(post_id, content) {
        try {
            const [results] = await this.db.execute(
                'UPDATE posts SET content = ? WHERE post_id = ?',
                [content, post_id]
            );
    
            const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
    
            await this.db.execute(
                'DELETE FROM post_hashtags WHERE post_hashtag_id = ?',
                [post_id]
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
                        'INSERT INTO post_hashtags(post_hashtag_id, hashtag_id) VALUES (?, ?)',
                        [post_id, hashtag_id]
                    );
                }

                
            }
            const [postWithUserDetails] = await this.db.execute(
                `SELECT p.*, pr.username, ui.file_path AS profile_picture
                 FROM posts p
                 JOIN profiles pr ON p.user_id = pr.user_id
                 LEFT JOIN upload_image ui ON p.user_id = ui.user_id AND ui.image_type = 'profile_pic'
                 WHERE p.post_id = ?`,
                [post_id]
            );
    
            return postWithUserDetails[0];
        } catch (err) {
            console.error('<error> post.updatePost', err);
            throw err;
        }
    }



    // CRUD - Delete post

    async deletePost(post_id) {
        try {
            const [results2,] = await this.db.execute(
                'DELETE FROM comments WHERE post_id = ?',
                [post_id]
            )

            const [results,] = await this.db.execute(
                // 'UPDATE posts SET is_deleted = 1 WHERE post_id = ?',
                // [post_id],
                'DELETE FROM posts WHERE post_id = ?',
                [post_id]
            );

            
            return results;
        }
        catch (err) {
            console.error('<error> post.deletePost', err);
            throw err;
        }
    }
}

export default Post;