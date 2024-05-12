// messagesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Message } from '../utils/types';
import { getMessages, getUnseenMessages } from '../services/database';

interface MessagesState {
  [userID: string]: Message[];
}

export interface unseenMessagesState {
  [userID: string]: Message[]
}

interface FinalState {
  value: MessagesState,
  unseenMessagesIDs: unseenMessagesState
}

const initialState: FinalState = { value: { 'userID': [] }, unseenMessagesIDs: { 'userID': [] } };

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (userID: string) => {
    const data = await getMessages(userID)
    return { userID, data }
  }
)

export const fetchUnseenMessages = createAsyncThunk(
  'messages/fetchUnseenMessages',
  async () => {
    const data = await getUnseenMessages();
    return data
  }
)

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
    addMessage(state, action: PayloadAction<{ userID: string; message: Message }>) {
      const { userID, message } = action.payload;
      if (!state.value[userID]) state.value[userID] = [];
      state.value[userID] = [...state.value[userID], message];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      const { userID, data } = action.payload;
      if (data)
        state.value[userID] = data;
    })
    builder.addCase(fetchUnseenMessages.fulfilled, (state, action) => {
      const data = action.payload;
      if (data)
        state.unseenMessagesIDs = data;
    })
  },
});

export const { updateMessages, addMessage, pushUnseenMessagesIds, clearUnseenMessagesIds } = messagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages.value;
export const selectUnseenMessages = (state: RootState) => state.messages.unseenMessagesIDs;
export default messagesSlice.reducer;