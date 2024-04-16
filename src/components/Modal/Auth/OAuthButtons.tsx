import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';

const OAuthButtons:React.FC = () => {
  
  return(
    <Flex direction='column' width='100%'>
      <Button variant='oauth' mb={2}>
        <Image src ='/images/googlelogo.png' height='28px' mr={4}/>
        Continue with Google
      </Button>
    </Flex>
  )
}
export default OAuthButtons;