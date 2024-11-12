/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  username: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload: { user } }) => {
      state.token = user.token;
      state.username = user.username;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
