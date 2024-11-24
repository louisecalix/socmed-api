import jwt from 'jsonwebtoken';

const adminAuthentication = (req, res, next) => {
    const token = req.headers.token;
    const adminToken = req.headers.admintoken;

    console.log("User Token:", token);
    console.log("Admin Token:", adminToken);

    if (!token || !adminToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated user. Missing token or admin token.',
        });
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decodedUser) => {
        if (err) {
            console.log("User token verification failed:", err.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid user token',
            });
        }

        console.log("Decoded User Token:", decodedUser);
        res.locals.user_id = decodedUser.user_id;
        res.locals.authenticated = true;

        jwt.verify(adminToken, process.env.API_SECRET_KEY, (adminErr, decodedAdmin) => {
            if (adminErr) {
                console.log("Admin token verification failed:", adminErr.message);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid admin token',
                });
            }

            console.log("Decoded Admin Token:", decodedAdmin);


            if (decodedAdmin.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin privileges required.',
                });
            }

            res.locals.adminAuthenticated = true;
            next();
        });
    });
};

export default adminAuthentication;
