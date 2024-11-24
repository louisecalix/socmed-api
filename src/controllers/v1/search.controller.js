import Search from "../../models/search.model.js";
// import events from 'events';
// events.EventEmitter.defaultMaxListeners = 20;

class SearchController {

    constructor() {
        this.search = new Search();
    }


    async searchPosts(req, res) {
        const { query, limit, offset } = req.query;
        try {
            const results = await this.search.searchPosts(query, parseInt(limit) || 10, parseInt(offset) || 0);
            res.json({
                success: true,
                data: results
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


    async searchUsers(req, res) {
        const { query, limit, offset } = req.query;
        try {
            const results = await this.search.searchUsers(query, parseInt(limit) || 10, parseInt(offset) || 0);
            res.json({
                success: true,
                data: results
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



    async searchGroups(req, res) {
        const { query, limit, offset } = req.query;
        try {
            const results = await this.search.searchGroups(query, parseInt(limit) || 10, parseInt(offset) || 0);
            res.json({
                success: true,
                data: results
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


    async searchHashtags(req, res) {
        const { query, limit, offset } = req.query;
        try {
            const results = await this.search.searchHashtags(query, parseInt(limit) || 10, parseInt(offset) || 0);
            res.json({
                success: true,
                data: results
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



    async searchAll(req, res) {
        const { query, limit, offset } = req.query;
        try {
            const results = await this.search.searchAll(query, parseInt(limit) || 10, parseInt(offset) || 0);
            res.json({
                success: true,
                data: results
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

export default SearchController;