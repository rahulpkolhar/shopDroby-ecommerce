const seller = (req, res, next) => {
    if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({ message: "Seller access required" });
    }
};

module.exports = { seller };