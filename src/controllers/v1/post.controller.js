import Post from "../../models/post.model.js";

class PostController {
  constructor() {
    this.post = new Post();
    }

    async createPost(req, res) {
      const user_id = res.locals.user_id;
      const { content } = req.body;
  
      try {
          const result = await this.post.createPost(user_id, content || null);
          console.log('Post creation result:', result);
          res.json({
              success: true,
              data: {
                  result,
              },
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
  
    async createPostGroup(req, res) {
        // const { user_id } = req.params;
        const  user_id  = res.locals.user_id;
        const group_id = res.locals.group_id;
        const { content} = req.body;
        try {
            const result = await this.post.createPostGroup(user_id, content, group_id);
            res.json({
                success: true,
                data: {
                  result,
                },
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


    async repost(req, res) {
      // const { user_id } = req.params;
      const  user_id  = res.locals.user_id;
      const { origin_id } = req.params;
      try {
        if (!origin_id) { 
          return res.status(400).json({
            success: false,
            message: "Origin ID is required if you want to repost",
          });
      }

        const result = await this.post.createPost(user_id, null, origin_id);
        res.json({  
          success: true,
          data: result,
        });
    }
    catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
      }
    }


    async quoteRepost(req, res) {
      // const { user_id } = req.params;
      const  user_id  = res.locals.user_id;
      const { origin_id } = req.params;
      const { content } = req.body;
      try {
        if (!origin_id) { 
          return res.status(400).json({
            success: false,
            message: "Origin ID and content are required for quote",
          });
      }

        const result = await this.post.createPost(user_id, content, origin_id);
        res.json({  
          success: true,
          data: result,
        });
      }
      catch (err) {
        res.json({
          success: false,
          message: err.toString(),
        });
        res.end();
        }
      }


    async getPost(req, res) {
        const { post_id } = req.params;
        try {
          const postDetails = await this.post.getPost(post_id);
          res.json({
            success: true,
            data: postDetails,
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
    


      async getAllUserPosts(req, res) {
        // const { user_id } = req.params;
        const  user_id  = res.locals.user_id;
        try {
          const userPosts = await this.post.getAllUserPosts(user_id);
          res.json({
            success: true,
            data: userPosts,
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


      async getUserGroupPosts(req, res) {
        const user_id = res.locals.user_id;
        const group_id = res.locals.group_id;
    
        try {
            const userPosts = await this.post.getUserGroupPosts(user_id, group_id); 
            res.json({
                success: true,
                data: userPosts,
            });
        } catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
        }
    }
    
    


      async updatePost(req, res) {
        const  user_id  = res.locals.user_id;
        const { post_id } = req.params;
        const { content} = req.body || {};
        try {
          const post = await this.post.getPost(post_id);
          if (post.user_id !== user_id) {
            return res.status(403).json({
              success: false,
              message: "You can only edit your own posts.",
            });
          }
          

          const result = await this.post.updatePost(post_id, content);
          res.json({
            success: true,
            data: {result

              
            },
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
    


      async deletePost(req, res) {
        const  user_id  = res.locals.user_id;
        const { post_id } = req.params;
        try {
          const post = await this.post.getPost(post_id);
          if (post.user_id !== user_id) {
            return res.status(403).json({
              success: false,
              message: "You can only delete your own posts.",
            });
          }

          const result = await this.post.deletePost(post_id);
          res.json({
            success: true,
            message: "Post deleted successfully",
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
}

export default PostController;