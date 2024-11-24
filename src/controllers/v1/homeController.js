import Home from "../../models/home_model.js";

class HomeController {
    constructor() {
        this.home = new Home();
    }

   
    async current_posts(req, res) {
        try {
            const results = await this.home.get_currentposts();

          
            const posts = results.map((result) => ({
                profile_id: result.profile_id,
                post_id: result.post_id,
                user_id: result.user_id,
                username: result.username,
                content: result.content,
                likes_count: result.likes_count,
                comments_count: result.comments_count,
                repost_count: result.repost_count,
                created_at: result.created_at,
                bookmark_counts: result.bookmark_counts,
                pfp : result.profile_pic
            }));

            res.json({
                success: true,
                data: posts
            });
            res.end();
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }

    async get_trendings(req, res) {
        try {
            const results = await this.home.get_trending();

          
            const posts = results.map((result) => ({
                profile_id: result.profile_id,
                post_id: result.post_id,
                user_id: result.user_id,
                username: result.username,
                content: result.content,
                likes_count: result.likes_count,
                comments_count: result.comments_count,
                repost_count: result.repost_count,
                created_at: result.created_at,
                bookmark_counts: result.bookmark_counts,
                pfp : result.profile_pic
            }));

            res.json({
                success: true,
                data: posts
            });
            res.end();
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }


    // async get_allPosts(req, res) {
    //     try {
    //         const results = await this.home.getAllPosts();

    //         const posts = results.map((result) => ({
    //             post_id: result.post_id,
    //             user_id: result.user_id,
    //             content: result.content,
    //             likes_count: result.likes_count,
    //             comments_count: result.comments_count,
    //             repost_count: result.repost_count,
    //             created_at: result.created_at,
    //             bookmark_counts: result.bookmark_counts
    //         }));

    //         res.json({
    //             success: true,
    //             data: posts
    //         });
    //         res.end();
    //     } catch (err) {
    //         res.json({
    //             success: false,
    //             message: err.toString()
    //         });
    //         res.end();
    //     }
    // }

    async followingsPosts(req, res) {
        const user_id = res.locals.user_id;
    
        try {
            const results = await this.home.followings_posts(user_id);
    
          
            if (!results || !Array.isArray(results.posts)) {
                throw new Error('No posts found');
            }
    
            const posts = results.posts.map((result) => ({
                profile_id: result.profile_id,
                pfp: result.pfp,
                post_id: result.post_id,
                user_id: result.user_id,
                username: result.username,
                content: result.content,
                likes_count: result.likes_count,
                comments_count: result.comments_count,
                repost_count: result.repost_count,
                created_at: result.created_at,
                bookmark_counts: result.bookmark_counts,
             

            }));
    
            res.json({
                success: true,
                data: posts
            });
            res.end();
        } catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }
    
}

export default HomeController;
