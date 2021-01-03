import OAuth2Server from 'oauth2-server';

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauth = new OAuth2Server({
  model: {
    getAccessToken: async (): Promise<any> => {
      const date = new Date();
      // add 1hr
      date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
      return {
        accessToken: 'some-token',
        accessTokenExpiresAt: date,
        // refreshToken: string;
        // refreshTokenExpiresAt: Date;
        // scope: string | string[];
        // client: Client;
        // user: User;
        // [key: string]: any;
        user: {
          id: 1,
          uuid: 'some-uuid',
          email: 'myemail@email.com',
        },
      };
    },

    // // Or, calling a Node-style callback.
    // getAuthorizationCode: function (done: (...args: any[]) => any): any {
    //   done(null, 'works!');
    // },

    // Or, using generators.
    getClient: function* (): any {
      // yield somethingAsync();
      yield 'asd';
      return 'works!';
    },

    // Or, async/wait (using Babel).
    getUser: async function (): Promise<any> {
      // await somethingAsync();
      return 'works!';
    },

    saveToken: function (): any {
      //
    },

    verifyScope: function (): any {
      //
    },
  },
});

const main = async (): Promise<void> => {
  try {
    const request = new Request({
      method: 'GET',
      query: {},
      headers: { Authorization: 'Bearer foobar' },
    });
    const response = new Response();
    const { accessToken, accessTokenExpiresAt, user } = await oauth.authenticate(request, new Response());
    response.body.accessToken = accessToken;
    accessTokenExpiresAt && (response.body.accessTokenExpiresAt = accessTokenExpiresAt.getTime().toString());
    response.body.user = JSON.stringify(user);
    console.log('access token:', accessToken);
    console.log('access token expires at:', accessTokenExpiresAt);
    console.log('user:', user);
    console.log('response:', response);
    // The request was successfully authenticated.
  } catch (err) {
    console.error('e', err);
    // The request failed authentication.
  }

  // oauth.authorize()
  // oauth.token()
};

main();
