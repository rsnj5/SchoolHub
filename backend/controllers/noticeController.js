const Notice = require('../models/noticeSchema');

const noticeCreate = async (req, res) => {
    try {
        const newNotice = new Notice({
            ...req.body,
            school: req.body.adminID,
        });

        const result = await newNotice.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        const notices = await Notice.find({ school: req.params.id });

        if (notices.length > 0) {
            res.send(notices);
        } else {
            res.send({ message: 'No notices found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, 
            { $set: req.body },
            { new: true }
        );

        res.send(updatedNotice);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotice = async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        res.send(deletedNotice);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id });

        if (result.deletedCount === 0) {
            res.send({ message: 'No notices found to delete' });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { 
    noticeCreate,
    noticeList,
    updateNotice,
    deleteNotice,
    deleteNotices 
};