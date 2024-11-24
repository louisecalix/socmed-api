import Bookmark from "../../models/bookmark.model.js";

class BookmarkController {
    constructor() {
        this.bookmark = new Bookmark();
    }

    async addBookmark(req, res) {
        const user_id = res.locals.user_id;
        const { post_id } = req.params;
        try {
            const result = await this.bookmark.addBookmark(user_id, post_id);
            res.json({
                success: true,
                data: result
            });
        }
        catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }

    async removeBookmark(req, res) {
        const user_id = res.locals.user_id;
        const { bookmark_id } = req.params;
        try {
            const bookmark = await this.bookmark.getBookmark(bookmark_id);
            if (bookmark.user_id !== user_id) {
                res.json({
                    success: false,
                    message: "You can only delete your own bookmark"
                });
                return;
            }
            const result = await this.bookmark.removeBookmark(user_id, bookmark_id);
            res.json({
                success: true,
                data: result
            });
        }
        catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }


    async getUserBookmarks(req, res) {
        // const { user_id } = req.params;
        const  user_id  = res.locals.user_id;
        try {
            const result = await this.bookmark.getUserBookmarks(user_id);
            res.json({
                success: true,
                data: result
            });
        }
        catch (err) {
            res.json({
                success: false,
                message: err.toString()
            });
            res.end();
        }
    }
}


export default BookmarkController;