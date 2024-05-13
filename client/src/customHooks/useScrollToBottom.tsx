import { useEffect } from 'react';

function useScrollToBottom(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: "smooth" })
            console.log(ref.current);
        }, 1)
    }, [ref]);
}

export default useScrollToBottom;