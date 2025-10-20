import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.json({
            Success: false,
            message: "Unauthorized Access"
        });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecoded.id) {
            req.body = req.body || {}; // ✅ Ensure body exists
            req.body.userId = tokenDecoded.id;
        } else {
            return res.json({
                Success: false,
                message: "Unauthorized Access, Login Again"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            Success: false,
            message: error.message
        });
    }
};

export default userAuth;
