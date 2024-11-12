/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';

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
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload: { channel } }) => {
      state.messages = state.messages.filter((message) => message.channelId !== channel.id);
    });
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
