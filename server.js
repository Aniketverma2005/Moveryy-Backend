import express from 'express';
import dotenv from 'dotenv';
import sequelize from './src/database/db.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

sequelize.sync({alter: true})
    .then(() => {
        console.log("All models were synchronized successfully.");
    })
    .catch((err) => {
        console.error("Model synchronization failed: ", err.message);
    });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


