const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { error } = require('console');
const { createTokenForUser, validateToken } = require('../services/authentication')

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        default: '/images/user.png'
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    }
},{
    timestamps: true,
});

userSchema.pre("save", function (next){
    const user = this;
    if(!user.isModified("password")) return;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    
    next();
});
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({email});
    if(!user) throw new error("no user found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");
    if(hashedPassword !== userProvidedHash) throw new error("Incorrect pasword");

    const token = createTokenForUser(user);
    // console.log("in model :- ",token);
    return token;
})

const user = model("user", userSchema);

module.exports = user

