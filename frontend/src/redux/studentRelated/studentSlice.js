import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },
        getSuccess: (state, action) => {
            state.studentsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "idle";
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
            state.statestatus = "idle";
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.statestatus = "idle";
        },
        underStudentControl: (state) => {
            state.loading = false;
            state.response = null;
            state.error = null;
            state.statestatus = "idle";
        },
        removeStudent: (state, action) => {
            state.studentsList = state.studentsList.filter(
                student => student._id !== action.payload
            );
            state.statestatus = "removed";
        },
        clearStudents: (state) => {
            state.studentsList = [];
            state.statestatus = "cleared";
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    underStudentControl,
    stuffDone,
    removeStudent,
    clearStudents
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;