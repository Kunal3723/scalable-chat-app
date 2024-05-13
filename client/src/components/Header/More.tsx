import { IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react'
import { MdOutlineMenu } from "react-icons/md";
import Popup from '../ReplaceConvo';
import React from 'react';
type Props = {
    userID: string
}

const More = ({ userID }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Popup isOpen={isOpen} onClose={onClose} userID={userID} />
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<MdOutlineMenu size={20} />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem onClick={onOpen}>
                        Replace Convo
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default More