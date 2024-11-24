import { connection } from '../core/database.js';

class Comment {
  constructor() {
    this.db = connection;
  }

  async getGroupId(post_id) {
    const [results,] = await this.db.execute(
      'SELECT group_id FROM posts WHERE post_id = ?',
      [post_id]
    );
    // return results[0].group_id;
    return results.length > 0 ? results[0].group_id : null;
  }


  async isUserInGroup(user_id, group_id) { // CHECK IF USER IS A MEMBER IN A GROUP
    const [results,] = await this.db.execute(
      'SELECT COUNT(*) AS count FROM group_members WHERE user_id = ? AND group_id = ?',
      [user_id, group_id]
    );
    return results[0].count > 0;
  }


  async createComment(user_id, post_id, content) {
    try {
      const group_id = await this.getGroupId(post_id);
      if (group_id && !await this.isUserInGroup(user_id, group_id)) {
        throw new Error('You cant comment bacause you are not a member of the group');
      }

      const [user] = await this.db.execute(
        'SELECT username FROM profiles WHERE user_id = ?',
        [user_id]
      );

      const user_name = user[0].username;
      console.log(user_name);



      const [results,] = await this.db.execute(
        'INSERT INTO comments (user_id, post_id, content, user_name) VALUES (?, ?, ?, ?)',
        [user_id, post_id, content, user_name]
      );

      const c_id = results.insertId;

      const [comments] = await this.db.execute(
        `SELECT c.*, ui.file_path AS pfp
         FROM comments c
         LEFT JOIN upload_image ui
         ON ui.user_id = c.user_id AND ui.image_type = "profile_pic"
         WHERE c.comment_id = ?`,
        [c_id]
      );
      
      // return results;
      return comments;
    } 
    catch (err) {
      console.error('<error> comment.createComment', err);
      throw err;
    }
  }


  async createReply(user_id, post_id, content, parent_id = null) {
    try {
      const group_id = await this.getGroupId(post_id);
      if (group_id && !await this.isUserInGroup(user_id, group_id)) {
        throw new Error('You cant comment bacause you are not a member of the group');
      }

      const [user] = await this.db.execute(
        'SELECT username FROM profiles WHERE user_id = ?',
        [user_id]
      );

      const user_name = user[0].username;
      console.log(user_name);


      const [results,] = await this.db.execute(
        'INSERT INTO comments (user_id, post_id, content, parent_id, user_name) VALUES (?, ?, ?, ?, ?)',
        [user_id, post_id, content, parent_id, user_name]
      );
      // return results;
      const r_id = results.insertId;

      const [reply] = await this.db.execute(
        `SELECT c.* , ui.file_path AS pfp
        FROM comments c
        LEFT JOIN upload_image ui
        ON ui.user_id = c.user_id AND ui.image_type = "profile_pic"
        WHERE comment_id = ?`,
        [r_id]
      );
      return reply;
    } 
    catch (err) {
      console.error('<error> comment.createComment', err);
      throw err;
    }
  }



  async deleteComment(comment_id) {
    try {
      const [results,] = await this.db.execute(
        // 'UPDATE comments SET is_deleted = 1 WHERE comment_id = ?',
        // [comment_id],
        'DELETE FROM comments WHERE comment_id = ?',
        [comment_id]
      );
      return results;
    } 
    catch (err) {
      console.error('<error> comment.deleteComment', err);
      throw err;
    }
  }

  async getPostComments(post_id) { // GET ALL COMMENTS IN A SPECIFIC POST
    try {
      const [results] = await this.db.execute(
        `SELECT c.* , ui.file_path AS pfp
        FROM comments c
        LEFT JOIN upload_image ui
        ON ui.image_type = "id_pic"
        WHERE post_id = ?`,
        [post_id]
      );
      return results;
    } 
    catch (err) {
      console.error('<error> comment.getPostComments', err);
      throw err;
    }
  }

  async getComment(comment_id) { // GET A SPECIFIC COMMENT
    try {
      const [results] = await this.db.execute(
        `SELECT c.* , ui.file_path AS pfp
        FROM comments c
        LEFT JOIN upload_image ui
        ON ui.image_type = "id_pic"
        WHERE comment_id = ?`,
        [comment_id]
      );
      return results[0];
    } 
    catch (err) {
      console.error('<error> comment.getComment', err);
      throw err;
    }
  }

  async getUserComments(user_id) { // GET ALL COMMENTS IN A SPECIFIC USER
    try {
      const [results,] = await this.db.execute(
        'SELECT * FROM comments WHERE user_id = ?',
        [user_id]
      );
      return results;
    } 
    catch (err) {
      console.error('<error> comment.getUserComments', err);
      throw err;
    }
  }


  
  async getReplies(parent_id) { // GET ALL REPLIES TO A SPECIFIC COMMENT
    try {
      const [results] = await this.db.execute(
        `SELECT c.*, ui.file_path AS pfp
         FROM comments c
         LEFT JOIN upload_image ui
         ON ui.user_id = c.user_id AND ui.image_type = "profile_pic"
         WHERE c.parent_id = ?`,
        [parent_id]
      );
      return results;
    } catch (err) {
      console.error('<error> comment.getReplies', err);
      throw err;
    }
  }
}

export default Comment;
