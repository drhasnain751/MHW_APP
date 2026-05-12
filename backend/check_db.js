import { sequelize } from './config/db.js';
import User from './models/User.js';

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('--- DATABASE REPORT ---');
    
    const count = await User.count();
    console.log(`Total Registered Users: ${count}`);
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    
    console.log('\nUser List:');
    console.table(users.map(u => u.toJSON()));
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
