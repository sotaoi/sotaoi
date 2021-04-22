import { Helper } from '@sotaoi/api/helper';
import _ from 'lodash';
import { UserModel } from '@app/api/models/user-model';
import { AddressModel } from '@app/api/models/address-model';
import { CountryModel } from '@app/api/models/country-model';
import { GenericModel } from '@sotaoi/api/models/generic-model';
import { Job } from '@sotaoi/api/job';

class InitialSeed extends Job {
  public async handle(): Promise<void> {
    function fillUuid(array: string[], q: number): void {
      for (let i = 0; i < q; i++) {
        array.push(Helper.uuid());
      }
    }

    const emailValue = 'user@gmail.com';
    const passwordValue = 'pass';

    const categoryNames: string[] = ['poetry', 'reviews'];
    const categories: { name: string; uuid: string }[] = [];

    const countryNames: string[] = ['Romania', 'Germany', 'France', 'USA'];
    const countryCodes: string[] = ['RO', 'GE', 'FR', 'US'];
    const countries: { name: string; code: string; uuid: string }[] = [];

    const posts: { uuid: string; title: string; content: string; createdBy: string; category: string }[] = [];

    const addressUuids: string[] = [];
    const countryUuids: string[] = [];
    const userUuids: string[] = [];
    const categoryUuids: string[] = [];

    const nrCountries = 4;
    const nrUsers = 1;
    const nrAddresses = 1;
    const nrCategories = 2;

    const user = new UserModel();
    const address = new AddressModel();
    const country = new CountryModel();
    const category = new GenericModel('category');
    const post = new GenericModel('post');
    const accessToken = new GenericModel('access-token');

    await user.db().deleteMany({});
    await address.db().deleteMany({});
    await country.db().deleteMany({});
    await category.db().deleteMany({});
    await post.db().deleteMany({});
    await accessToken.db().deleteMany({});

    fillUuid(countryUuids, nrCountries);
    fillUuid(addressUuids, nrAddresses);
    fillUuid(userUuids, nrUsers);
    fillUuid(categoryUuids, nrCategories);

    for (let i = 0; i < nrCountries; i++) {
      countries.push({
        name: countryNames[i],
        code: countryCodes[i],
        uuid: countryUuids[i],
      });
    }
    for (let i = 0; i < nrCategories; i++) {
      categories.push({
        name: categoryNames[i],
        uuid: categoryUuids[i],
      });
    }

    await user.db().insertMany({
      uuid: userUuids[0],
      email: emailValue,
      password: passwordValue,
      address: JSON.stringify({ repository: 'address', uuid: _.sample(addressUuids) }),
      avatar: null,
    });

    await country.db().insertMany(countries);

    await address.db().insertMany([
      {
        uuid: _.sample(addressUuids) as string,
        street: 'Blogger Avenue 42',
        country: JSON.stringify({ repository: 'country', uuid: _.sample(countryUuids) as string }),
      },
    ]);

    await category.db().insertMany(categories);

    await post.db().insertMany(posts);
  }
}

export { InitialSeed };
