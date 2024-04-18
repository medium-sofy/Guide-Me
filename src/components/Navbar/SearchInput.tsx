import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { User } from "firebase/auth";
import React from "react";

type SearchInputProps = {
  user?: User | null ;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => (
  <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.400" mb={1} />}
      />

      <Input
        type="tel"
        placeholder="Search Guide Me"
        fontSize="10px"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        height="34px"
        bg="gray.50"
      />
    </InputGroup>
  </Flex>
);
export default SearchInput;
