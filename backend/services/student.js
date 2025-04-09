import { InvalidIdException } from "../exceptions/idException.js";
import Student from "../models/student.js";
import Group from "./group.js";
import User from "../models/user.js";

Student.createStudent = async (studentDoc) => {
    const student = new Student(studentDoc)

    await student.save()
}

Student.readStudent = async (institute, rollnumber) => {
    const student = await Student.findOne({ _institute: institute, rollnumber: rollnumber })

    if (student == null) {
        throw new InvalidIdException("student")
    }

    return student
}

Student.getStudentByEmail = async (email) => {
    const userId = await User.getId(email)

    const student = await Student.findOne(
        {
            userId: userId
        }
    )

    return student
}

Student.readResources = async (user) => {
    const student = await Student.getStudentByEmail(user.email)

    console.log("Student:")
    console.log(student)

    const resources = await Group.readResources(student._institute, student.semester, student.groupNumber)
    return resources
}

Student.deleteStudent = async (id) => {
    await Student.deleteOne({ userId: id })
}

export default Student
