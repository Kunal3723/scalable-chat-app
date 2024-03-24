// messagesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { users } from '../utils/types';

interface UsersState {
    value: users[]
}

const initialState: UsersState = {
    value: []
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addAllUsers(state, action: PayloadAction<{ users: users[], userID: string }>) {
            const { users, userID } = action.payload;
            state.value = users.filter(user => user.userID !== userID)
        },
        addUser(state, action: PayloadAction<{ user: users }>) {
            const { user } = action.payload;
            const userExists = state.value.some(existingUser => existingUser.userID === user.userID);
            if (!userExists) {
                state.value = [...state.value, user];
            }
        },
        removeUser(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload;
            state.value = state.value.filter(user => user.userID !== id && user.userID !== localStorage.getItem('userID'));
        },
        updateLastSeen(state, action: PayloadAction<{ userID: string, lastSeen: number|undefined }>){
            const { userID, lastSeen } = action.payload;
            state.value = state.value.map((user) => {
                if (user.userID === userID) {
                    return { ...user, lastSeen: lastSeen };
                }
                return user;
            })
        },
        updateTypingStatus(state, action: PayloadAction<{ userID: string, status: boolean }>) {
            const { userID, status } = action.payload;
            state.value = state.value.map((user) => {
                if (user.userID === userID) {
                    return { ...user, isTyping: status };
                }
                return user;
            })
        },
        updateOnlineStatus(state, action: PayloadAction<{ userID: string, status: boolean }>) {
            const { userID, status } = action.payload;
            state.value = state.value.map((user) => {
                if (user.userID === userID) {
                    return { ...user, connected: status };
                }
                return user;
            })
        }
    },
});

export const { addAllUsers, addUser, removeUser, updateTypingStatus, updateOnlineStatus,updateLastSeen } = usersSlice.actions;
export const selectUsers = (state: RootState) => state.users.value;
export default usersSlice.reducer;