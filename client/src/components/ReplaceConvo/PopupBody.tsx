import { Divider, Select, VStack } from '@chakra-ui/react'
import React from 'react'
import Template from './Template';
import { arr } from '../../utils';

type Props = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const PopupBody = ({ value, setValue }: Props) => {

    return (
        <>
            <VStack alignItems={'flex-start'} spacing={4} marginTop={4}>
                <Divider />
                <Select value={value} onChange={(e) => setValue(e.target.value)}>
                    <option value='Original'>Original</option>
                    <option value='Template_1'>Template 1</option>
                    <option value='Template_2'>Template 2</option>
                    <option value='Template_3'>Template 3</option>
                </Select>
                {value !== 'Original' && <Template messages={arr[value]} />}
            </VStack>
        </>
    )
}

export default PopupBody