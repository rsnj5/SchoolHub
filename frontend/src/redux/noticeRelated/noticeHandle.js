import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    deleteRequest,
    deleteSuccess,
    deleteFailed
} from './noticeSlice';

export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const deleteNotice = (id) => async (dispatch) => {
    dispatch(deleteRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Notice/${id}`);
        if (result.data.message) {
            dispatch(deleteFailed(result.data.message));
        } else {
            dispatch(deleteSuccess(id));
            return result.data;
        }
    } catch (error) {
        dispatch(deleteFailed(error.message));
        throw error;
    }
};

export const deleteAllNotices = (userId) => async (dispatch) => {
    dispatch(deleteRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Notices/${userId}`);
        if (result.data.message) {
            dispatch(deleteFailed(result.data.message));
        } else {
            dispatch(deleteSuccess()); 
            return result.data;
        }
    } catch (error) {
        dispatch(deleteFailed(error.message));
        throw error;
    }
};