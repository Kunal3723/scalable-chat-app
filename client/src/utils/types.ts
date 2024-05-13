export const USER_CONNECTED = 'user connected'
export const USER_DISCONNECTED = 'user disconnected'
export const SESSION = 'session'
export const USERS = 'users'
export const SEND_TYPING_STATUS = 'send typing status'
export const PRIVATE_MESSAGE = 'private message'
export const MESSAGE_SEEN = 'message seen'
export const MESSAGE_SENT = 'message sent'
export const MESSAGE_SENDING = 'message sending'
export const MESSAGE_DELIVERED = 'message delivered'
export const CONNECTION = 'connection'
export const DISCONNECT = 'disconnect'
export const SEND_ALL_UNSENT_MESSAGES = 'send_all_unsent_messages'
export const CONNECT_ERROR = 'connect_error'


export interface Message {
    id: string;
    content: string;
    from: string | null;
    to: string | undefined;
    seen?: 'message sent' | 'message seen' | 'message delivered' | 'message sending'
}

export interface users {
    userID: string,
    username: string,
    hasUnreadMessages: number,
    connected: boolean,
    lastSeen?: number;
    isTyping?: boolean
}

export interface MessagesState {
    [userID: string]: Message[];
}
