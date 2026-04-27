import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import bcrypt from "bcrypt";

const PendingUser = sequelize.define("pending_users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("user", "admin", "transport"),
        allowNull: false,
        defaultValue: "user"
    },
    emailOTP: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    emailOTPExpires: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
});

// Hash the password before saving
PendingUser.beforeCreate(async (pendingUser) => {
    if (pendingUser.password) {
        pendingUser.password = await bcrypt.hash(pendingUser.password, 10);
    }
});

export default PendingUser;