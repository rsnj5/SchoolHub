const Sclass = require('../models/sclassSchema');
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');

const sclassCreate = async (req, res) => {
    try {
        const { sclassName, adminID } = req.body;

        const existingSclass = await Sclass.findOne({ sclassName, school: adminID });

        if (existingSclass) {
            return res.send({ message: 'Sorry, this class name already exists' });
        }

        const newSclass = new Sclass({ sclassName, school: adminID });
        const result = await newSclass.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ school: req.params.id });

        if (sclasses.length > 0) {
            res.send(sclasses);
        } else {
            res.send({ message: 'No classes found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassDetail = async (req, res) => {
    try {
        let sclass = await Sclass.findById(req.params.id).populate('school', 'schoolName');

        if (sclass) {
            res.send(sclass);
        } else {
            res.send({ message: 'No class found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({ sclassName: req.params.id });

        if (students.length > 0) {
            const modifiedStudents = students.map(student => ({
                ...student._doc,
                password: undefined
            }));
            res.send(modifiedStudents);
        } else {
            res.send({ message: 'No students found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);

        if (!deletedClass) {
            return res.send({ message: 'Class not found' });
        }

        await Student.deleteMany({ sclassName: req.params.id });
        await Subject.deleteMany({ sclassName: req.params.id });
        await Teacher.deleteMany({ teachSclass: req.params.id });

        res.send(deletedClass);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });

        if (deletedClasses.deletedCount === 0) {
            return res.send({ message: 'No classes found to delete' });
        }

        await Student.deleteMany({ school: req.params.id });
        await Subject.deleteMany({ school: req.params.id });
        await Teacher.deleteMany({ school: req.params.id });

        res.send(deletedClasses);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    sclassCreate,
    sclassList,
    getSclassDetail,
    getSclassStudents,
    deleteSclass,
    deleteSclasses
};
