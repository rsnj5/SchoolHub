import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    noticesList: [],
    loading: false,
    error: null,
    response: null,
};

const noticeSlice = createSlice({
    name: 'notice',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.noticesList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteRequest: (state) => {
            state.loading = true;
        },
        deleteSuccess: (state, action) => {
            if (action.payload) { // For single notice deletion
                state.noticesList = state.noticesList.filter(
                    notice => notice._id !== action.payload
                );
            } else { // For all notices deletion
                state.noticesList = [];
            }
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        deleteFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    deleteRequest,
    deleteSuccess,
    deleteFailed
} = noticeSlice.actions;

export const noticeReducer = noticeSlice.reducer;