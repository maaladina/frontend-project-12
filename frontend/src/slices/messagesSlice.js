import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, { payload: { newMessages } }) => {
            state.messages = newMessages;
        },
        addMessage: (state, { payload: { newMessage } }) => {
            state.messages = [...state.messages, newMessage];
        },
    },

});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
