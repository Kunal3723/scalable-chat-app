import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../services/auth';
import { auth } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, Button, Flex, Heading } from '@chakra-ui/react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user]);

  return (
    loading ? null : (
      <Flex align="center" justify="center" minH="100vh" bgGradient="linear(to-br, purple.500, pink.500, red.500)">
        <Box bg="white" p="8" rounded="md" shadow="md">
          <Heading as="h2" size="2xl" fontWeight="bold" mb="6" textAlign="center" color="gray.800">Login To Chat</Heading>
          <Flex direction="column" align="center">
            <Button
              bg="blue.500"
              color="white"
              px="4"
              py="2"
              rounded="md"
              _hover={{ bg: 'blue.600' }}
              onClick={googleLogin}
            >
              Google Login
            </Button>
          </Flex>
        </Box>
      </Flex>
    )
  );
};

export default Login;
