const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            return res.send({ message: 'Email already exists' });
        }

        const result = await teacher.save();
        await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const validated = await bcrypt.compare(req.body.password, teacher.password);
        if (!validated) {
            return res.send({ message: 'Invalid password' });
        }

        teacher = await teacher.populate('teachSubject', 'subName sessions')
                                  .populate('school', 'schoolName')
                                  .populate('teachSclass', 'sclassName');
        teacher.password = undefined;
        res.send(teacher);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ school: req.params.id })
            .populate('teachSubject', 'subName')
            .populate('teachSclass', 'sclassName');

        if (!teachers.length) {
            return res.send({ message: 'No teachers found' });
        }

        const modifiedTeachers = teachers.map((teacher) => ({ ...teacher._doc, password: undefined }));
        res.send(modifiedTeachers);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate('teachSubject', 'subName sessions')
            .populate('school', 'schoolName')
            .populate('teachSclass', 'sclassName');

        if (!teacher) {
            return res.send({ message: 'No teacher found' });
        }

        teacher.password = undefined;
        res.send(teacher);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId, { teachSubject }, { new: true }
        );
        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });
        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );
        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        if (!deletionResult.deletedCount) {
            return res.send({ message: 'No teachers found to delete' });
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });
        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map((teacher) => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        if (!deletionResult.deletedCount) {
            return res.send({ message: 'No teachers found to delete' });
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });
        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map((teacher) => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) => a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance,
};
