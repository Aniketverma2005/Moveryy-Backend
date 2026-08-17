import { DataTypes } from "sequelize";
import sequelize from "../../database/db.js";

const ContactUs = sequelize.define("contact_us", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "resolved", "closed"),
        allowNull: false,
        defaultValue: "pending"
    }
}, {
    timestamps: true
});

export default ContactUs;
