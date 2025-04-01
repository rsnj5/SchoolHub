const Admin = require('../models/adminSchema');

const adminRegister = async (req, res) => {
    try {
        const admin = new Admin({ ...req.body });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            return res.send({ message: 'Email already exists' });
        }

        if (existingSchool) {
            return res.send({ message: 'School name already exists' });
        }

        const result = await admin.save();
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.send({ message: 'User not found' });
        }

        if (password === admin.password) {
            admin.password = undefined;
            return res.send(admin);
        }

        res.send({ message: 'Invalid password' });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAdminDetail = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.send({ message: 'No admin found' });
        }

        admin.password = undefined;
        res.send(admin);
    } catch (err) {
        res.status(500).json(err);
    }
};


module.exports = { adminRegister, adminLogIn, getAdminDetail };
