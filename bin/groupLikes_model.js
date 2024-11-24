import { connection } from "../src/core/database.js";

class Like{
    constructor(){
        this.db = connection;
    }

    async like_groupPost(group_id, group_post_id,user_id){
        console.log(group_id, group_post_id, user_id);
        try {
            const [results,] = await this.db.execute(
                'INSERT INTO group_likes (group_id, group_post_id, user_id) VALUES (?,?, ?)',
                [group_id,group_post_id, user_id]
            );

            return results;
        }
        catch (err) {
            console.error('<error> Like.like_groupPost', err);
            throw err;
        }
    }

    async unlike_groupPost(grouplike_id,group_id, user_id){
        try {
            const [results,] = await this.db.execute(
                'DELETE FROM group_likes WHERE grouplike_id = ? AND group_id = ? AND user_id =?',
                [grouplike_id, group_id,user_id]
            );

            return results;
        }
        catch (err) {
            console.error('<error> Like.unlike_groupPost', err);
            throw err;
        }
    }


  










}

export default Like;