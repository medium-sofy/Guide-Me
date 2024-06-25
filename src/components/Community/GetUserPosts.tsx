import { Post } from "@/atoms/postsAtom";
import { searchTermState } from "@/atoms/searchState";
import { auth, firestore } from "@/firebase/clientApp";
import { Stack ,Text} from "@chakra-ui/react";
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import PostItem from "../Posts/PostItem";
import PostLoader from "../Posts/PostLoader";
import usePosts from "@/hooks/usePosts";
import { useRouter } from "next/router";

const GetUserPosts: React.FC = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const searchTerm = useRecoilValue(searchTermState);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();
  const router = useRouter()
  const buildUserProfile = async () => {
    setLoading(true);

    try {
      const postQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", user?.uid),
        // should add an "orderBy() argument to this query() if we wanted to order by date,
        // but for some reason it includes posts from other users"
        // add limit here: limit(num)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("buildUserProfile error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(!user) router.push('/')
    buildUserProfile();
  }, [user]);

  return (
    <>
      {/* <CreatePostLink /> */}
      <Text fontSize='12pt' mb={3} paddingLeft = '38px'fontWeight='bold'>User Activity</Text>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts
            .filter((post) => {
              return searchTerm.toLowerCase() === ""
                ? post
                : post.title.toLowerCase().includes(searchTerm);
            })
            .map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
        </Stack>
      )}
    </>
  );
};
export default GetUserPosts;
