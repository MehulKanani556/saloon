const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const updateMissingIds = async () => {
    try {
        await connectDB();
        
        const users = await User.find({ customId: { $exists: false } });
        console.log(`Analyzing ${users.length} unique identities for SKU conversion...`);

        const prefixMap = {
            'Admin': 'ADM',
            'Staff': 'STF',
            'User': 'CLI'
        };

        for (const user of users) {
             const prefix = prefixMap[user.role] || 'USR';
             const namePart = (user.name || 'USER').replace(/[^a-zA-Z]/g, '').padEnd(4, 'X').substring(0, 4).toUpperCase();
             
             // Ensure uniqueness by checking candidate
             let finalId;
             let collision = true;
             while(collision) {
                const randomPart = Math.floor(1000 + Math.random() * 9000);
                finalId = `${prefix}-${namePart}-${randomPart}`;
                const existing = await User.findOne({ customId: finalId });
                if(!existing) collision = false;
             }
             
             user.customId = finalId;
             await user.save();
             console.log(`[IDENTITY_SYNC] Rebranded ${user.name} -> ${user.customId}`);
        }

        console.log('SKU rebrand operation successful.');
        process.exit();
    } catch (err) {
        console.error('Operational failure:', err.message);
        process.exit(1);
    }
};

updateMissingIds();
