import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    channels: [],
    activeChannelId: 1,
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
    },

});

export const { setChannels, setActiveChannelId, addChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
