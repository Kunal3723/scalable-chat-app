export const USER_CONNECTED = 'user connected'
export const USER_DISCONNECTED = 'user disconnected'
export const SESSION = 'session'
export const USERS = 'users'
export const SEND_TYPING_STATUS = 'send typing status'
export const PRIVATE_MESSAGE = 'private message'
export const MESSAGE_SEEN = 'message seen'
export const MESSAGE_SENT = 'message sent'
export const MESSAGE_DELIVERED = 'message delivered'
export const CONNECTION = 'connection'
export const DISCONNECT = 'disconnect'
export const SEND_ALL_UNSENT_MESSAGES = 'send_all_unsent_messages'
export const CONNECT_ERROR = 'connect_error'

export const USER_CONNECTED2 = 'user connected2'
export const USER_DISCONNECTED2 = 'user disconnected2'
export const SESSION2 = 'session2'
export const USERS2 = 'users2'
export const SEND_TYPING_STATUS2 = 'send typing status2'
export const PRIVATE_MESSAGE2 = 'private message2'
export const MESSAGE_SEEN2 = 'message seen2'
export const MESSAGE_SENT2 = 'message sent2'
export const MESSAGE_DELIVERED2 = 'message delivered2'
export const CONNECTION2 = 'connection2'
export const DISCONNECT2 = 'disconnect2'
export const SEND_ALL_UNSENT_MESSAGES2 = 'send_all_unsent_messages2'


export interface Message {
    id: string;
    content: string;
    from: string | null;
    to: string | undefined;
    seen?: 'message sent' | 'message seen' | 'message delivered'
}

export interface users {
    userID: string,
    username: string,
    hasUnreadMessages: number,
    connected: boolean,
    lastSeen?: number;
    isTyping?: boolean
}
