import mongoose from 'mongoose';
import { Helper } from '@sotaoi/api/helper';
import { GenericModel } from '@sotaoi/api/models/generic-model';
import { ModelOperations } from './models/model-operations';

const main = async (): Promise<void> => {
  try {
    console.log('\nstarting script...\n');

    const userModelHandler = new GenericModel('users');

    mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

    // const User = mongoose.model('users', new mongoose.Schema({}, { strict: false }));
    const User = ModelOperations.get('users');

    await userModelHandler.cleanupDocs();

    // todo here: automatically generate mongoose models
    const user = new User({
      uuid: Helper.uuid(),
      name: 'Zildjian',
      createdAt: new Date(),
    });
    await user.save();
    console.log('user created\n');

    const users = await userModelHandler.standardize((await User.find({})).map((record) => record.toObject()));
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
