import { searchTermState } from "@/atoms/searchState";
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
import { useRecoilState } from "recoil";

type SearchInputProps = {
  user?: User | null ;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) =>{ 
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState)
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  console.log(searchTerm)
  return (
  <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
      >
        <SearchIcon color="gray.400" mb={1} />
      </InputLeftElement>

      <Input
        type="tel"
        placeholder="Search Guide Me"
        fontSize="14px"
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
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </InputGroup>
  </Flex>
);}
export default SearchInput;
