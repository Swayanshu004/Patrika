const JWT = require('jsonwebtoken');

const secret = "$ecurepanda";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileUrl: user.profileUrl,
        role: user.role,
    }
    const token = JWT.sign(payload, secret);
    // console.log("in services :- ",token);
    return token; 
}
function validateToken(token){
    const payload =  JWT.verify(token, secret);
    return payload; 
}

module.exports = {
    createTokenForUser,
    validateToken
}