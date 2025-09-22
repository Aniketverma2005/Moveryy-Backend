import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




const userSchema = sequelize.define("users", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255],
            notNull: { msg: "Password is required" }
        }
    },
    role: {
        type: DataTypes.ENUM ("user", "admin", "transport"),
        allowNull: false,
        defaultValue: "user"
    }

}, {
    timestamps: true,
});

// Hash the password before saving the user
userSchema.beforeCreate(async (user) => {
    if(user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

//Hash the password before updating the password of the user
userSchema.beforeUpdate(async (user) => {
    if(user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

// Generate JWT Token
userSchema.prototype.jwtGenerateToken = async function() {
    return jwt.sign(
        {id: this.id, firstName: this.firstName, lastName: this.lastName, email: this.email, role: this.role},
        process.env.JWT_SECRET || "moveryysecret",
        {expiresIn: process.env.JWT_EXPIRE || "7d"}
    );
};

// Check whether the password is correct or not
userSchema.prototype.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default userSchema;
