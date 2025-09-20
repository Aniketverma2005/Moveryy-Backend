import { parse } from "dotenv";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME || "moveryy_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "Aniket@2005",
    {
        host: process.env.host || "localhost",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        dialect: "mysql",
        logging: false,
    }
);


(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully.");
    }catch(err) {
        console.error("Database connection failed: ", err.message);
    }
})();

export default sequelize;