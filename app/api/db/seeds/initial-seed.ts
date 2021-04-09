import { Helper } from '@sotaoi/api/helper';
import _ from 'lodash';

function fillUuid(array: string[], q: number): void {
  for (let i = 0; i < q; i++) {
    array.push(Helper.uuid());
  }
}

export async function seed(dbConnection: any): Promise<void> {
  await dbConnection('user').delete();
  await dbConnection('address').delete();
  await dbConnection('access-token').delete();
  await dbConnection('category').delete();

  await dbConnection('country').delete();
  await dbConnection('post').delete();

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

  await dbConnection('user').insert({
    uuid: userUuids[0],
    email: emailValue,
    password: passwordValue,
    address: JSON.stringify({ repository: 'address', uuid: _.sample(addressUuids) }),
    avatar: null,
  });

  await dbConnection('country').insert(countries);

  await dbConnection('address').insert({
    uuid: _.sample(addressUuids) as string,
    street: 'Blogger Avenue 42',
    country: JSON.stringify({ repository: 'country', uuid: _.sample(countryUuids) as string }),
  });

  await dbConnection('category').insert(categories);

  await dbConnection('post').insert(posts);
}
