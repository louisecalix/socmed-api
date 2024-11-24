import { connection } from "../core/database.js";

class Search {
    constructor() {
        this.db = connection;
    }

    async searchPosts(query, limit, offset = 0) {
        try {
            const [results,] = await this.db.execute(
                'SELECT * FROM posts WHERE content LIKE ? LIMIT ? OFFSET ?',
                [`%${query}%`, limit, offset]
            );
            return results;
        } catch (err) {
            console.error(`<error> search.searchPosts: Query "${query}" failed.`, err);
            throw err;
        }
    }

    async searchUsers(query, limit, offset = 0) {
        try {
            const [results,] = await this.db.execute(
                'SELECT * FROM profiles WHERE username LIKE ? LIMIT ? OFFSET ?',
                [`%${query}%`, limit, offset]
            );
            return results;
        } catch (err) {
            console.error(`<error> search.searchUsers: Query "${query}" failed.`, err);
            throw err;
        }
    }

    async searchGroups(query, limit, offset = 0) {
        try {
            const [results,] = await this.db.execute(
                'SELECT * FROM group_page WHERE group_name LIKE ? LIMIT ? OFFSET ?',
                [`%${query}%`, limit, offset]
            );
            return results;
        } catch (err) {
            console.error(`<error> search.searchGroups: Query "${query}" failed.`, err);
            throw err;
        }
    }

    async searchHashtags(query, limit, offset = 0) {
        try {
            const [results] = await this.db.execute(
                `SELECT posts.*, hashtags.hashtag AS hashtag
                 FROM hashtags
                 JOIN post_hashtags ON hashtags.hashtag_id = post_hashtags.hashtag_id
                 JOIN posts ON post_hashtags.post_hashtag_id = posts.post_id
                 WHERE hashtags.hashtag LIKE ? 
                 LIMIT ? OFFSET ?`,
                [`%${query}%`, limit, offset]
            );
            return results;
        } catch (err) {
            console.error(`<error> search.searchHashtags: Query "${query}" failed.`, err);
            throw err;
        }
    }
    


    async searchAll(query, limit, offset = 0) {
        try {
            const [postResults,] = await this.searchPosts(query, limit, offset);
            const [userResults,] = await this.searchUsers(query, limit, offset);
            const [groupResults,] = await this.searchGroups(query, limit, offset);
            const [hashtagResults,] = await this.searchHashtags(query, limit, offset);
      
            const results = {
              posts: postResults,
              users: userResults,
              groups: groupResults,
              hashtags: hashtagResults
            };
            return results;
        } catch (err) {
            console.error(`<error> search.searchAll: Query "${query}" failed.`, err);
            throw err;
        }
    }
}

export default Search;
