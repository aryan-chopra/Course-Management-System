import { InvalidIdException } from "../exceptions/idException.js";
import Student from "../models/student.js";
import Group from "./group.js";

Student.createStudent = async (studentDoc) => {
    const student = new Student(studentDoc)

    await student.save()
}

Student.readStudent = async (rollnumber) => {
    const student = await Student.findOne({ rollnumber: rollnumber })

    if (student == null) {
        throw new InvalidIdException("student")
    }

    return student
}

Student.readCourses = async (semester, group) => {
    const resources = Group.readCourses(semester, group)
    return resources
}

export default Student
