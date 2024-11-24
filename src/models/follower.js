import { connection } from "../core/database.js";

export class Followers {
    constructor() {
        this.connect = connection;
    }

    // user_id is making the follow action

    async get_profile_id(user_id){
   
            const [result] = await this.connect.execute(
                'SELECT  profile_id FROM profiles WHERE user_id = ?',
                [user_id]
            )

            if (result.length === 0) throw new Error(`Profile not found for user_id ${user_id}`);
            return result[0].profile_id;
        }
        


    async follow_User(user_id, followed_id) {
        try {
            const [followerResult] = await this.connect.execute(
                `SELECT username AS follower_name FROM profiles WHERE user_id = ?`,
                [user_id]
            );
            const [followingResult] = await this.connect.execute(
                `SELECT username AS following_name FROM profiles WHERE user_id = ?`,
                [followed_id]
            );

            if (followerResult.length === 0 || followingResult.length === 0) {
                throw new Error('User or following user not found');
            }
         
           const follower_pid= await this.get_profile_id(user_id);
           const following_pid = await this.get_profile_id(followed_id);

            const [result] = await this.connect.execute(
                `INSERT INTO followers (follower_id, followed_id) 
                 VALUES (?, ?)`,
                [follower_pid, following_pid]
            );
            return {
                insertResult: result,
                follower_name : followerResult[0].follower_name,
                following_name : followingResult[0].following_name
    
                
            };
        } catch (err) {
            console.error('<error> Followers.follow_User', err);
            throw err;
        }
    }

   
    async unfollow_User(user_id,followed_id) {
        try {

            const follower_pid= await this.get_profile_id(user_id);
            const following_pid = await this.get_profile_id(followed_id);

            const [result] = await this.connect.execute(
                `DELETE FROM followers WHERE follower_id = ? AND followed_id = ? `,
                [follower_pid, following_pid]
            );
            return result;
        } catch (err) {
            console.error('<error> Followers.unfollow_User', err);
            throw err;
        }
    }


    async get_user_followers(user_id) {
        try {
            const profile_id = await this.get_profile_id(user_id);
    
          
            const [result] = await this.connect.execute(
                `SELECT f.follower_id, p.username AS follower_name, ui.file_path AS follower_pfp
                 FROM followers f
                 JOIN profiles p ON f.follower_id = p.profile_id
                 LEFT JOIN upload_image ui ON f.follower_id = ui.user_id AND ui.image_type = 'profile_pic'
                 WHERE f.followed_id = ?`,
                [profile_id]
            );
    
            return { followers: result };
        } catch (err) {
            console.error('<error> Followers.get_user_followers', err);
            throw err;
        }
    }
    

 
    async get_user_following(user_id) {
        try {
            const profile_id = await this.get_profile_id(user_id);
    
          
            const [result] = await this.connect.execute(
                `SELECT f.followed_id, p.username AS following_name, ui.file_path AS following_pfp
                 FROM followers f
                 JOIN profiles p ON f.followed_id = p.profile_id
                 LEFT JOIN upload_image ui ON ui.user_id = f.followed_id AND ui.image_type = 'profile_pic'
                 WHERE f.follower_id = ?`,
                [profile_id]
            );
    
           
            const followingWithPfp = result.map(followed => ({
                ...followed,
                following_pfp: followed.following_pfp || null  
            }));
    
          
            const [pfp] = await this.connect.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ? AND image_type = ?',
                [user_id, 'profile_pic']
            );
            const profile_pic = pfp.length ? pfp[0].file_path : null;
    
           
            return {
                following: followingWithPfp,  
                profile_pic                 
            };
        } catch (err) {
            console.error('<error> Followers.get_user_following', err);
            throw err;
        }
    }
}

export default Followers;
