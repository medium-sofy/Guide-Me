import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import { handleClientScriptLoad } from "next/script";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "@/atoms/postsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },

  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [profanityError, setProfanityError] = useState(false);

  const Filter = require("bad-words");
  const filter = new Filter();
  const arabicInsults = ["خخخخ", "احا", "تبا", "اللعنة"];

  const handleCreatePost = async () => {
    // can add the text of both title and body fields to a single array 
    //and loop through that to save a for loop
    for (const word of textInputs.title.split(" ")) {
      if (arabicInsults.includes(word)) {
        setProfanityError(true);
        setLoading(false);
        return;
        // Exit the loop if profanity is found
      }
    }

    for (const word of textInputs.body.split(" ")) {
      if (arabicInsults.includes(word)) {
        setProfanityError(true);
        setLoading(false);
        return;
        // Exit the loop if profanity is found
      }
    }

    if(filter.isProfane(textInputs.title) || filter.isProfane(textInputs.body)){
      setProfanityError(true);
        setLoading(false);
        return;
    }
    const { communityId } = router.query;
    // create new post object => type post3
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || "",
      creatorId: user?.uid,
      creatorsDisplayName: user.email!.split("@")[0],
      // title: textInputs.title ? filter.clean(textInputs.title) : textInputs.title,
      // body: textInputs.body ? filter.clean(textInputs.body) : textInputs.body,
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    setLoading(true);
    try {
      // store the post on db

      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      // check for selected file
      if (selectedFile) {
        // store in storage => getDownloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        // update post doc by adding URL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect the user back to the community page
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }
    setLoading(false);
  };
  console.log(profanityError)
  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}

      {/* // need to display the bad words error based on error.message, set it at the top.
    // Create another error with the message: Error creating post, Please remove any inappropriate words. */}

      {profanityError && (
        <Alert status="error">
          <AlertIcon />
          <Text>
            Error creating post, Please remove any inappropriate words.
          </Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
