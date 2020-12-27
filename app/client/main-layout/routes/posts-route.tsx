import React from 'react';
import { ViewComponent, ViewData, ViewPromises } from '@sotaoi/client/components';
import { RecordEntry, RecordRef } from '@sotaoi/omni/artifacts';
import { getAllCategoriesQuery } from '@app/client/queries/category-queries';
import _ from 'lodash';
import { PostComponent } from '@app/client/components/post-component';
import { Link } from '@sotaoi/client/router';
import { Helper } from '@sotaoi/client/helper';
import { getAllPostsQuery } from '@app/client/queries/post-queries';
import { PostCardView } from '@app/client/components/post-card-view';

// michael::TODO figure out how to display the category on a post with a ref
interface NoProps {}
class PostsRoute extends ViewComponent<NoProps> {
  public promises(): ViewPromises<NoProps> {
    return { posts: getAllPostsQuery(), categories: getAllCategoriesQuery() };
  }

  public init({
    results,
    props,
  }: ViewData<NoProps>): {
    posts: { record: RecordEntry; ref: RecordRef }[];
    categories: { record: RecordEntry; ref: RecordRef }[];
  } {
    const posts = results.posts.result.records.map((post: RecordEntry) => ({
      record: post,
      ref: new RecordRef('post', post.uuid),
    }));
    const categories = results.categories.result.records.map((category: RecordEntry) => ({
      record: category,
      ref: new RecordRef('category', category.uuid),
    }));

    return {
      posts,
      categories,
    };
  }
  //to-do fix grid view ratios
  public web(data: ViewData<NoProps>): null | React.ReactElement {
    const { posts, categories } = this.init(data);
    return (
      <section className="text-gray-700 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {posts.map((post: any) => {
              return <PostComponent uuid={post.record.uuid} />;
            })}
          </div>
        </div>
      </section>
    );
  }

  public mobile(data: ViewData<NoProps>): null | React.ReactElement {
    return null;
    // const { posts, categories } = this.init(data);
    // return (
    //   <ScrollView style={tailwind('text-gray-700 body-font')}>
    //     <View style={tailwind('container px-5 py-24 mx-auto')}>
    //       <View style={tailwind('flex flex-wrap -m-4')}>
    //         {posts.map((post: any) => {
    //           return (
    //             <PostComponent
    //               key={post.record.uuid}
    //               title={post.record.title}
    //               uuid={post.record.uuid}
    //               category={
    //                 _.find(categories, { record: { uuid: JSON.parse(post.record.category).uuid } })?.record.name
    //               }
    //               createdAt={post.record.createdAt}
    //             />
    //           );
    //         })}
    //       </View>
    //     </View>
    //   </ScrollView>
    // );
  }

  public electron(data: ViewData<NoProps>): null | React.ReactElement {
    return null;
  }
}

export { PostsRoute };
