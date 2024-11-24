import { connection } from "../src/core/database.js";

class Group_Comments{
    constructor(){
        this.db = connection;
    };



    async create_GroupComment(group_id, user_id, group_post_id, parent_id=null, content,){
        try{  
          const [get_username] = await this.db.execute(
            'SELECT firstname FROM user_account WHERE user_id=?',
            [user_id]
          );
          if (get_username.length === 0) {
            throw new Error('User not found');
        }

          const username = get_username[0].firstname;





          const[result] = await this.db.execute(
              'INSERT INTO group_comments(group_id, user_id, group_post_id,parent_id, comment_text, username) VALUES(?,?,?,?,?,?)',
              [group_id, user_id, group_post_id, parent_id,content, username]
          );
          return result;

        } catch (err) {
            console.error('<error> Group_Comments.create_GroupComment', err);
            throw err;
          }

    }

// get all comments of a post
    async get_AllComments(group_id, group_post_id ){
        try{
            const[result] = await this.db.execute(
                'SELECT * FROM group_comments WHERE group_id = ? AND group_post_id=?',
                [group_id, group_post_id]
            );
            return result;
        }catch (err) {
            console.error('<error> Group_Comments.get_AllComments', err);
            throw err;
          }

    }

    // get a specific comment

    async getComment(groupcomment_id){
        try{ const [results,] = await this.db.execute(
            'SELECT * FROM group_comments WHERE groupcomment_id = ?',
            [groupcomment_id]
          );
          return results[0];
        } 
        catch (err) {
          console.error('<error> Group_Comments.getComment', err);
          throw err;
        }
      }

      async getUserComments(user_id) { // GET ALL COMMENTS IN A SPECIFIC USER
        try {
          const [results,] = await this.db.execute(
            'SELECT * FROM group_comments WHERE user_id = ?',
            [user_id]
          );
          return results;
        } 
        catch (err) {
          console.error('<error> Group_Comments.getUserComments', err);
          throw err;
        }
      }

      async deleteComment(group_id,user_id,group_post_id,groupcomment_id){
        try{
          const [result] = await this.db.execute(
            'DELETE FROM group_comments WHERE group_id=? AND user_id=? AND group_post_id=? AND groupcomment_id = ?',
            [group_id,user_id,group_post_id ,groupcomment_id]
          );
          return result;
        } catch (err) {
          console.error('<error> Group_Comments.deleteComment', err);
          throw err;
        }
      }


 


}

export default Group_Comments;