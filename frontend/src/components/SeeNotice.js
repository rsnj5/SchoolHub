import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Paper, CircularProgress, Typography, Box } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
    const dispatch = useDispatch();
    const { currentUser, currentRole } = useSelector((state) => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentUser?._id && currentRole) {
            const noticeOwnerId = currentRole === "Admin" 
                ? currentUser._id 
                : currentUser.school?._id;
            
            if (noticeOwnerId) {
                dispatch(getAllNotices(noticeOwnerId, "Notice"));
            }
        }
    }, [dispatch, currentRole, currentUser]);

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = React.useMemo(() => {
        return noticesList?.map((notice) => {
            const date = new Date(notice.date);
            const dateString = date.toString() !== "Invalid Date" 
                ? date.toISOString().substring(0, 10) 
                : "Invalid Date";
            return {
                title: notice.title,
                details: notice.details,
                date: dateString,
                id: notice._id,
            };
        }) || [];
    }, [noticesList]);

    if (error) {
        return (
            <Box sx={{ marginTop: '50px', textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    Error loading notices. Please try again later.
                </Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px',
                marginTop: '50px'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ marginTop: '50px', marginRight: '20px' }}>
            {noticeRows.length > 0 ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Notices
                    </Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
                    </Paper>
                </>
            ) : (
                <Typography variant="h6" textAlign="center">
                    No notices available at the moment
                </Typography>
            )}
        </Box>
    );
};

export default SeeNotice;