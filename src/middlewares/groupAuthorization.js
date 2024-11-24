/**
 * Authorization middleware to check if `apikey`, `admintoken`, and `grouptoken` are present in headers.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next 
 */
function groupAuthorization(req, res, next) {
    const apikey = req.headers.apikey;
    // const admintoken = req.headers.admintoken;
    const grouptoken = req.headers.grouptoken;

    if (!apikey || apikey !== process.env.API_KEY) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized User - API key is invalid or missing',
        });
    }

    if (!admintoken) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized User - Admin token is required',
        });
    }

    if (!grouptoken) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized User - Group token is required',
        });
    }

    next();
}

export default groupAuthorization;
