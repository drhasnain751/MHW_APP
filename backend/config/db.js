import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For Vercel, we use process.cwd() to find the root directory
const dbPath = path.resolve(process.cwd(), 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Database Connected.');
    } catch (error) {
        console.error(`Error connecting to SQLite: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;


