const Complain = require('../models/complainSchema');

const complainCreate = async (req, res) => {
    try {
        const newComplain = new Complain(req.body);
        const result = await newComplain.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        const complains = await Complain.find({ school: req.params.id })
            .populate('user', 'name');

        if (complains.length > 0) {
            res.send(complains);
        } else {
            res.send({ message: 'No complaints found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    complainCreate,
    complainList,
};
