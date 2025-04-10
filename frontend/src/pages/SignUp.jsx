import ImageSplitView from "../components/ImageSplitView.jsx"
import signupImage from "../assets/signup_image.png"
import Input from "../components/Input.jsx"
import PrimaryButton from "../components/PrimaryButton.jsx"
import { createContext, useContext, useState } from "react"
import OutlineButton from "../components/OutlineButton.jsx"

const DataContext = createContext("")

const Inputs = () => {
    const {inputType, instituteName, setInstituteName, adminName, setAdminName} = useContext(DataContext)

    let inputArray = []

    if (inputType === "name") {
        inputArray = [
            <Input
                key={"Institution Name"}
                onChange={setInstituteName}
                value={instituteName}
                label="Institution Name"
                placeholder="Enter institution name"
            />,
            <Input
                key={"Admin Name"}
                value={adminName}
                onChange={setAdminName}
                label="Admin Name"
                placeholder="Enter admin's name"
            />
        ]
    } else {
        inputArray = [
            <Input
                key={"Admin Email"}
                value={adminEmail}
                placeholder="Enter admin's Email"
                label="Admin Email"
            />,
            <Input
                label="Admin Password"
            />,
            <Input
                label="Confirm Password"
                placeholder=""
            />
        ]
    }

    return (
        <div className="flex flex-col gap-7">
            {inputArray}
        </div>
    )
}

const Buttons = () => {
    const {inputType, instituteName, adminName, setInputType} = useContext(DataContext)

    if (inputType === "name") {
        return (
            <PrimaryButton
                onClick={() => goToAdmin(instituteName, adminName, setInputType)}
                className={"rounded-full"}
                content={"Next"}
            />
        )
    } else {
        return (
            <div className="flex justify-around">
                <OutlineButton
                    onClick={() => goBack(setInputType)}
                    className={"basis-1/3 rounded-md"}
                    content={"Back"}
                />
                <PrimaryButton
                    className={"basis-1/3 rounded-md"}
                    content={"Sign Up"} />
            </div>
        )
    }
}

const SignupForm = () => {

    return (
        <div className="flex flex-col gap-15">
            <div className="flex flex-col gap-5">
                <span className="text-6xl font-poppins text-center font-semibold text-gray-800">Sign Up</span>
                <span className="font-poppins font-light text-gray-600">Let's register your institute!</span>
            </div>

            <Inputs />

            <Buttons />
        </div>
    )
}

function SignUp() {
    const [inputType, setInputType] = useState("name")

    const [instituteName, setInstituteName] = useState("")
    const [instituteNameError, setInstituteNameError] = useState("")

    const [adminName, setAdminName] = useState("")
    const [adminNameError, setAdminNameError] = useState("")

    const [adminEmail, setAdminEmail] = useState("")
    const [adminEmailError, setAdminEmailError] = useState("")

    return (
        <DataContext.Provider value={{
            inputType,
            setInputType,
            instituteName,
            setInstituteName,
            instituteNameError,
            setInstituteNameError,
            adminName,
            setAdminName,
            adminNameError,
            setAdminNameError
        }}>
            <ImageSplitView src={signupImage} className="bg-linear-to-t from-background-100 to-white">
                <SignupForm />
            </ImageSplitView>
        </DataContext.Provider>
    )
}

function goToAdmin(instituteName, adminName, setInputType) {
    setInputType("admin")
    console.log(instituteName, adminName)
}

function goBack(setInputType) {
    setInputType("name")
}

export default SignUp
