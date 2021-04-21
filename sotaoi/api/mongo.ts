import mongoose from 'mongoose';
import { Helper } from '@sotaoi/api/helper';
import { UserModel } from '@app/api/models/user-model';

const main = async (): Promise<void> => {
  try {
    console.log('\nstarting script...\n');

    mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

    const user = new UserModel();
    await user.cleanupDocs();

    const userRecord = new (user.db())({
      uuid: Helper.uuid(),
      name: 'Zildjian',
      createdAt: new Date(),
    });
    await userRecord.save();
    console.log('user created\n');

    const users = await user.standardize((await user.db().find({})).map((record) => record.toObject()));
    console.log('user list:');
    console.log(users);

    console.log('\ndone\n');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

export {};
