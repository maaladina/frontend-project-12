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
    },

});

export const { setChannels, setActiveChannelId } = channelsSlice.actions;

export default channelsSlice.reducer;
