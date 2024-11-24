import { connection } from "../core/database.js";

class Bookmark {

    constructor() {
        this.db = connection;
    }

    async addBookmark(user_id, post_id) {
        try {
            const [post] = await this.db.execute(
                'SELECT origin_id, content FROM posts WHERE post_id = ?',
                [post_id]
            );
    
            if (post[0].origin_id !== null && post[0].content === null) {
                throw new Error('Cannot bookmark a repost');
            }

            const [results,] = await this.db.execute(
                'INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)',
                [user_id, post_id] 
            );
            return results;
        }
        catch (err) {
            console.error('<error> bookmark.addBookmark', err);
            throw err;
        }
    }

    async removeBookmark(user_id, bookmark_id) {
        try {
            const [results,] = await this.db.execute(
                // 'UPDATE bookmarks SET is_deleted = 1 WHERE user_id = ? AND post_id = ?',
                // [user_id, post_id],
                'DELETE FROM bookmarks WHERE user_id = ? AND bookmark_id = ?',
                [user_id, bookmark_id]
            );
            return results;
        }
        catch (err) {
            console.error('<error> bookmark.deleteBookmark', err);
            throw err;
        }
    }
    async getUserBookmarks(user_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT b.*, 
                        p.username, 
                        img.file_path AS profile_pic
                 FROM bookmarks b
                 JOIN profiles p ON b.user_id = p.user_id
                 LEFT JOIN upload_image img 
                 ON b.user_id = img.user_id AND img.image_type = 'profile_pic'
                 WHERE b.user_id = ?`,
                [user_id]
            );
    
            return results.map(bookmark => ({
                ...bookmark,
                profile_pic: bookmark.profile_pic || null
            }));
        } catch (err) {
            console.error('<error> bookmark.getUserBookmarks', err);
            throw err;
        }
    }
    

    async getBookmark(bookmark_id) {
        try {
            const [results,] = await this.db.execute(
                'SELECT * FROM bookmarks WHERE bookmark_id = ?',
                [bookmark_id]
            );
            return results[0];
        }
        catch (err) {
            console.error('<error> bookmark.getBookmark', err);
            throw err;
        }
    }


}

export default Bookmark;