import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ALL_POSTS } from "../graphql/post/queries";
import {
  setLoading,
  setPosts,
  setCount,
} from "../app/features/posts/allPostsSlice";
import BtnLoader from "./BtnLoader";
import PostItem from "./PostItem";

const PostList = () => {
  const postListRef = useRef("");
  const dispatch = useDispatch();
  const { posts, category, count, total } = useSelector(
    state => state.allPosts
  );

  const [getAllPosts, { data, loading }] = useLazyQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getAllPosts({ variables: { count, category } });
  }, [getAllPosts, category, count]);

  useEffect(() => {
    data?.result?.posts && dispatch(setPosts(data.result));
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [dispatch, loading]);

  return (
    <div className="posts" ref={postListRef}>
      <div className="post-list">
        {loading ? (
          new Array(posts?.length || 1).fill({})?.map((post, idx) => {
            return <PostItem key={idx} post={post} />;
          })
        ) : posts?.length ? (
          posts.map((post, idx) => {
            return <PostItem key={post?._id || idx} post={post} />;
          })
        ) : (
          <p className="noData text-danger">No posts</p>
        )}
      </div>

      {count < total ? (
        <button
          id="loadMorePosts"
          className="btn btn-dark"
          onClick={() => (!loading ? dispatch(setCount()) : undefined)}
        >
          {loading ? <BtnLoader text={"Loading"} /> : "Load More"}
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default PostList;
