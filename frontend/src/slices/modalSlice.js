import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: null,
  currentChannel: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, { payload: { type, item } }) => {
      state.show = true;
      state.type = type;
      state.currentChannel = item;
    },
    hideModal: (state) => {
      state.show = false;
      state.type = null;
    },
  },

});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
