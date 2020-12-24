import { PostRetrieve } from '@app/api/queries/post-retrieve';
import { RegisterUserHandler } from '@app/api/commands/register-user-handler';
import { UpdateUserHandler } from '@app/api/commands/update-user-handler';
import { AuthUserHandler } from '@app/api/commands/auth-user-handler';
import { TaskUserHandler } from '@app/api/commands/task-user-handler';
import { AllUsersQuery } from '@app/api/queries/all-users-query';
import { UserRetrieve } from '@app/api/queries/user-retrieve';
import { AllCountriesQuery } from '@app/api/queries/all-countries-query';
import { AllPostsQuery } from '@app/api/queries/all-posts-query';
import { AllCategoriesQuery } from '@app/api/queries/all-categories-query';
import { StorePostHandler } from '@app/api/commands/store-post-handler';
import { CategoryRetrieve } from '@app/api/queries/category-retrieve';

const handlers = {
  country: {
    query: { 'get-all': AllCountriesQuery },
  },
  post: {
    store: StorePostHandler,
    query: { 'get-all': AllPostsQuery },
    retrieve: PostRetrieve,
  },
  category: { retrieve: CategoryRetrieve, query: { 'get-all': AllCategoriesQuery } },
  user: {
    store: RegisterUserHandler,
    update: UpdateUserHandler,
    query: { 'get-all': AllUsersQuery },
    retrieve: UserRetrieve,
    auth: AuthUserHandler,
    task: { 'user-hello-task': TaskUserHandler },
  },
};

export { handlers };
