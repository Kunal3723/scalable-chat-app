// messagesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Message, MESSAGE_SEEN } from '../utils/types';

interface MessagesState {
  [userID: string]: Message[];
}

interface unseenMessagesState {
  [userID: string]: Message[]
}

interface FinalState {
  value: MessagesState,
  unseenMessagesIDs: unseenMessagesState
}

const initialState: FinalState = { value: JSON.parse(localStorage.getItem('chats') || '{}') || { 'userID': [] }, unseenMessagesIDs: JSON.parse(localStorage.getItem('unseen_chats') || '{}') || { 'userID': [] } };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    updateMessages(state, action: PayloadAction<{ userID: string; messageID: string; value: 'message sent' | 'message seen' | 'message delivered' }>) {
      const { userID, messageID, value } = action.payload;
      const messages = state.value[userID];
      if (messages) {
        const messageIndex = messages.findIndex(message => message.id === messageID);
        if (messageIndex !== -1) {
          state.value[userID][messageIndex] = {
            ...state.value[userID][messageIndex],
            seen: value,
          };
        }
      }
    },
    pushUnseenMessagesIds(state, action: PayloadAction<{ userID: string, message: Message }>) {
      const { userID, message } = action.payload;
      if (!state.unseenMessagesIDs[userID]) state.unseenMessagesIDs[userID] = [];
      state.unseenMessagesIDs[userID] = [...state.unseenMessagesIDs[userID], message];
    },
    clearUnseenMessagesIds(state, action: PayloadAction<{ userID: string, messageID: string }>) {
      const { userID, messageID } = action.payload;
      state.unseenMessagesIDs[userID] = state.unseenMessagesIDs[userID].filter(msg => msg.id !== messageID);
    },
    setMessagesSeen(state, action: PayloadAction<{ userID: string }>) {
      const { userID } = action.payload;
      const messages = state.value[userID];
      if (messages) {
        for (let i = 0; i < messages.length; i++) {
          if (state.value[userID][i].seen !== MESSAGE_SEEN) {
            state.value[userID][i] = {
              ...state.value[userID][i], seen: MESSAGE_SEEN
            }
          }
        }
      }
    },
    addMessage(state, action: PayloadAction<{ userID: string; message: Message }>) {
      const { userID, message } = action.payload;
      if (!state.value[userID]) state.value[userID] = [];
      state.value[userID] = [...state.value[userID], message];
    }
  },
});

export const { updateMessages, addMessage, setMessagesSeen, pushUnseenMessagesIds, clearUnseenMessagesIds } = messagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages.value;
export const selectUnseenMessages = (state: RootState) => state.messages.unseenMessagesIDs;
export default messagesSlice.reducer;