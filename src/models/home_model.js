import { connection } from "../core/database.js";

class Home {

    constructor() {
        this.connect = connection;
    }
    async get_currentposts() {
        try {
            const thisWeek = new Date();
            thisWeek.setDate(thisWeek.getDate() - 7);
    
            const [posts] = await this.connect.execute(
                `SELECT p.*, 
                        pr.username, pr.profile_id, 
                        img.file_path AS profile_pic
                 FROM posts p
                 JOIN profiles pr ON p.user_id = pr.user_id
                 LEFT JOIN upload_image img 
                 ON p.user_id = img.user_id AND img.image_type = 'profile_pic'
                 WHERE p.created_at >= ?
                 ORDER BY p.created_at DESC`,
                [thisWeek]
            );
    
            return posts.map(post => ({
                ...post,
                profile_pic: post.profile_pic || null
            }));
        } catch (err) {
            console.error('<error> Home.get_currentposts', err);
            throw err;
        }
    }
    

    async get_trending(limit = 10) {
        try {
           
            const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
    
            const [trending] = await this.connect.execute(
                `SELECT p.*, 
                        (p.likes_count + p.comments_count) AS engagement_score, 
                        u.username, u.profile_id,
                        img.file_path AS profile_pic
                 FROM posts p
                 JOIN profiles u ON p.user_id = u.user_id
                 LEFT JOIN upload_image img 
                 ON p.user_id = img.user_id AND img.image_type = 'profile_pic'
                 ORDER BY engagement_score DESC
                 LIMIT ${safeLimit}`
            );
    
           
            return trending.map(post => ({
                ...post,
                profile_pic: post.profile_pic ||null
            }));
        } catch (err) {
            console.error('<error> Home.get_trending', err);
            throw err;
        }
    }
    
    

    // // Get all posts sorted by creation date
    // async getAllPosts() {
    //     try {
    //         const [allPosts] = await this.connect.execute(
    //             'SELECT * FROM posts WHERE is_deleted = 0 ORDER BY created_at DESC'
    //         );
    //         return allPosts;
    //     } catch (err) {
    //         console.error('<error> Home.getAllPosts', err);
    //         throw err;
    //     }
    // }

  // GET POSTS FROM FOLLOWINGS
  
  async followings_posts(user_id) {
    console.log("User ID passed to followings_posts:", user_id);

    try {
        const [get_pid] = await this.connect.execute(
            'SELECT profile_id FROM profiles WHERE user_id = ?',
            [user_id]
        );

        const profile_id = get_pid[0]?.profile_id;
        if (!profile_id) {
            console.log("Profile not found for user_id:", user_id);
            return { success: false, message: "Profile not found" };
        }

        const [get_followings] = await this.connect.execute(
            'SELECT followed_id FROM followers WHERE follower_id = ?',
            [profile_id]
        );

        if (get_followings.length === 0) {
            console.log("No followings found for user_id:", user_id);
            return { success: false, message: "No followings found" };
        }

        const followed_ids = get_followings.map(follow => follow.followed_id);

        const posts = [];
        for (const followed_id of followed_ids) {
            const [get_fuid] = await this.connect.execute(
                'SELECT user_id, username FROM profiles WHERE profile_id = ?',
                [followed_id]
            );

           

            const f_uid = get_fuid[0]?.user_id;
            const user_name = get_fuid[0]?.username;

            if (!f_uid) {
                continue;
            }

            const [result] = await this.connect.execute(
                'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
                [f_uid]
            );

            const [pfp] = await this.connect.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
                [f_uid, 'profile_pic']
            )

            
            const profile_pic = pfp[0]?.file_path || null;

            if (Array.isArray(result)) {
                result.forEach(post => {
                    posts.push({
                        ...post,
                        username: user_name,
                        pfp: profile_pic,
                        profile_id: profile_id
                    });
                });
            }
        }

        console.log("Fetched posts:", posts);

        if (posts.length === 0) {
            console.log("No posts found for any followed users.");
            return { success: false, message: "No posts found" };
        }

        return { success: true, posts };

    } catch (error) {
        console.error("Error in followings_posts:", error);
        return { success: false, message: error.message };
    }
}

}
export default Home;
