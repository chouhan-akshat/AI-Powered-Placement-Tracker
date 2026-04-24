import 'dotenv/config';
import mongoose from 'mongoose';

const uri = "mongodb://akshatchouhan656_db_user:Akshat_123@ac-6ffbgdg-shard-00-00.rfpst5v.mongodb.net:27017,ac-6ffbgdg-shard-00-01.rfpst5v.mongodb.net:27017,ac-6ffbgdg-shard-00-02.rfpst5v.mongodb.net:27017/placement_tracker?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri).then(async () => {
  console.log('Connected!');
  const status = await mongoose.connection.db.admin().command({ isMaster: 1 });
  console.log('Replica Set:', status.setName);
  await mongoose.disconnect();
}).catch(e => console.error(e));
