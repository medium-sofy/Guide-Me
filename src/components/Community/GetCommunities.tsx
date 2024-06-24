import { Community } from "@/atoms/communitiesAtom";
import { searchTermState } from "@/atoms/searchState";
import { firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilValue } from "recoil";

const GetCommunities: React.FC = () => {
  const [communities, setCommunites] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const searchTerm = useRecoilValue(searchTermState);
  const getAllCommunities = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc")
        // add limit here: limit(5)
      );

      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommunites(communities as Community[]);
    } catch (error) {
      console.log("getAllCommunities error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllCommunities();
  }, []);

  return (
    // top communities container
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
    >
      {/* Top communities header */}
      <Flex
        align="flex-end"
        bg="blue.500"
        color="white"
        p="6px 10px"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={700}
      >
        <Text color="white.400">All Communities</Text>
      </Flex>
      {/* Top communities list items */}
      <Flex direction="column">
        {loading ? (
          // loader
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities
              .filter((community) => {
                return searchTerm.toLowerCase() === ""
                  ? community
                  : community.id.toLowerCase().includes(searchTerm);
              })
              .map((item, index) => {
                const isJoined = !!communityStateValue.mySnippets.find(
                  (snippet) => snippet.communityId === item.id
                );
                return (
                  <Link key={item.id} href={`/c/${item.id}`}>
                    <Flex
                      align="center"
                      fontSize="10pt"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      p="10px 12px"
                      position="relative"
                    >
                      <Flex width="80%" align="center">
                        <Flex width="15%">
                          <Text>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="80%">
                          {item.imageURL ? (
                            <Image
                              src={item.imageURL}
                              borderRadius="full"
                              boxSize="28px"
                              mr={2}
                            />
                          ) : (
                            <Icon
                              as={FaReddit}
                              fontSize={30}
                              color="brand.100"
                              mr={2}
                            />
                          )}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {`c/${item.id}`}
                          </span>
                        </Flex>
                      </Flex>
                      <Box position="absolute" right="10px">
                        <Button
                          height="22px"
                          fontSize="8pt"
                          variant={isJoined ? "outline" : "solid"}
                          onClick={(event) => {
                            event.preventDefault();
                            onJoinOrLeaveCommunity(item, isJoined);
                          }}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
            {/* <Box p='10px 20px'>
                <Button height='30px' width='100%'>View All</Button>
            </Box> */}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default GetCommunities;
