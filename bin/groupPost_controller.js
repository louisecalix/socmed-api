import GroupPost from "../../models/groupPost_model.js";

class GroupPost_Controller{
    constructor(){
        this.groupPost = new GroupPost();

    }

    async create_groupPost(req, res){
        const {group_id, user_id} = req.params;

        const{content} = req.body || {};

        try{
            const result = await this.groupPost.create_group_post(group_id, user_id, content);

            res.json({
                success: true,
                data: {group_post_id: result?.insertId}
            });
            res.end();
        }catch (err) {
            res.json({
                success: false,
                message: err.toString(),
            });
            res.end();
        }
    }
    //  fetch a specific post in a group
    async get_GroupPost(req, res){
        const {group_id, user_id, group_post_id} = req.params;

        try{

            const gp_user = await this.groupPost.get_group_post(group_id, user_id, group_post_id);

            res.json({
                success: true,
                data: gp_user,


            });
            res.end();


            
        }catch (err) {
            res.json({
              success: false,
              message: 'Post not found.',
            });
            res.end();
          }
    }

    //get all post from a certain group
    async getAll_groupPosts(req, res){
        const {group_id} = req.params;

        try{
            const [all_gp] = await this.groupPost.get_all_posts(group_id);
            res.json({
                success: true,
                data: all_gp,
            });
            res.end();

        }catch(err){
            res.json({
                success: false,
                message: 'No group post found.'
            });
            res.end();
        }

    }
// get all post from a user in a group

    async getAllUserGroupPost(req, res){
        const {group_id, user_id} = req.params;

        try{

            const [result] = await this.groupPost.get_allUsergroupPost(group_id, user_id);
            res.json({
                success: true,
                data: result,
            });
            res.end();

        }catch(err){
            res.json({
                success: false,
                message: 'No user group post found.'
            });
            res.end();
        }
    }

    async update_groupPost(req, res){
        const {group_id, user_id, group_post_id} = req.params;

        const {content} = req.body || {};

        try{
            const updatePost = await this.groupPost.update_group_post(group_id, user_id, group_post_id, content);
            if (updatePost.affectedRows > 0){
                res.json({
                    success: true,
                    message: 'Group Post update.',
                    
                });
            }else{
                res.json({
                    success: false,
                    message: 'Group Post not found',
                });
            };

            res.end();
        }catch(err){
            res.json({
                success:false,
                message:err.toString(),
              

            });
            res.end();
        }
        

    }
    async delete_GrouPost(req, res) {
        const {group_id, user_id, group_post_id } = req.params;
        try {
          const result = await this.groupPost.delete_group_post( group_id, user_id, group_post_id);
          res.json({
            success: true,
            message: "Post deleted successfully",
          }); 
          res.end();
        } catch (err) {
          res.json({
            success: false,
            message: 'No group post found.',
          });
          res.end();
        }
    }    







}

export default GroupPost_Controller