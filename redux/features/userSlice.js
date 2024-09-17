import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  sellerType: null,
  sellerId: null,
  email: null,
  isVerified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
