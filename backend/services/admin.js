import { BadRequestException } from "../exceptions/badRequest.js";
import Admin from "../models/admin.js";

Admin.createAdmin = async (adminDoc) => {
    const admin = new Admin(adminDoc)

    await admin.save()
}

Admin.deleteAdmin = async (userId) => {
    const res = await Admin.deleteOne({userId: userId})

    if (res.deletedCount == 0) {
        throw BadRequestException("admin")
    }

    return res.deletedCount
}

export default Admin
