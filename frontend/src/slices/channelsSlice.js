/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const defaultChannelId = '1';

const initialState = {
  channels: [],
  activeChannelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload: { newChannels } }) => {
      state.channels = newChannels;
    },
    setActiveChannelId: (state, { payload: { activeChannelId } }) => {
      state.activeChannelId = activeChannelId;
    },
    addChannel: (state, { payload: { newChannel } }) => {
      state.channels = [...state.channels, newChannel];
    },
    removeChannel: (state, { payload: { channel } }) => {
      state.channels = state.channels.filter((chann) => chann.id !== channel.id);
      if (state.activeChannelId === channel.id) {
        state.activeChannelId = defaultChannelId;
      }
    },
    renameChannel: (state, { payload: { id, name } }) => {
      state.channels.map((channel) => {
        if (channel.id === id) {
          channel.name = name;
          return channel;
        }
        return channel;
      });
    },
  },
});

export const {
  setChannels, setActiveChannelId, addChannel, removeChannel, renameChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
