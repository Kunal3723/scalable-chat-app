import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    VStack,
    Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import PopupBody from './PopupBody';
import { useDispatch } from 'react-redux';
import { fetchMessages, setChat } from '../../store/messagesSlice';
import { arr } from '../../utils';
import React from 'react';
type Props = {
    isOpen: boolean;
    onClose: () => void;
    userID: string;
}

const Popup = ({ isOpen, onClose, userID }: Props) => {
    const [password, setPassword] = useState('');
    const [flag, setFlag] = useState(false);
    const [value, setValue] = useState('Original');
    const dispatch = useDispatch();

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size={'sm'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Replace your conversation</DrawerHeader>

                    <DrawerBody>
                        <VStack alignItems={'flex-start'}>
                            <Text textAlign={'left'} fontSize={'md'}>Enter password to move ahead</Text>
                            <Input type='password' value={password} placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
                            <Button colorScheme='blue' size='sm' onClick={() => {
                                if (password === '123456') setFlag(true)
                            }}>Done</Button>
                        </VStack>
                        {
                            flag ?
                                <PopupBody value={value} setValue={setValue} />
                                : <></>
                        }
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={() => {
                            if (value !== 'Original') {
                                dispatch(setChat({ userID, chat: arr[value] }))
                            }
                            else {
                                dispatch(fetchMessages(userID))
                            }
                            localStorage.setItem('Type', JSON.stringify({ [userID]: value }));
                            onClose();
                            setPassword('');
                            setFlag(false);
                        }
                        }>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Popup