import ImageSplitView from "../components/ImageSplitView.jsx"
import signupImage from "../assets/signup_image.png"
import Input from "../components/Input.jsx"
import PrimaryButton from "../components/PrimaryButton.jsx"
import { createContext, useContext, useState } from "react"
import OutlineButton from "../components/OutlineButton.jsx"

const FormContext = createContext({})

const Inputs = () => {
    const {formState, updateFormState} = useContext(FormContext)

    let inputArray = []

    const formUpdateHelper = (e) => {
        const {name, value} = e.target

        updateFormState(name, value)
    }

    if (formState.inputType === "name") {
        inputArray = [
            <Input
                key={"Institution Name"}
                error={formState.instituteNameError}
                name={"instituteName"}
                onChange={formUpdateHelper}
                value={formState.instituteName}
                label="Institution Name"
                placeholder="Enter institution name"
            />,
            <Input
                key={"Admin Name"}
                error={formState.adminNameError}
                name={"adminName"}
                value={formState.adminName}
                onChange={formUpdateHelper}
                label="Admin Name"
                placeholder="Enter admin's name"
            />
        ]
    } else {
        inputArray = [
            <Input
                key={"Admin Email"}
                error={formState.adminEmailError}
                name={"adminEmail"}
                value={formState.adminEmail}
                onChange={formUpdateHelper}
                label="Admin Email"
                placeholder="Enter admin's Email"
            />,
            <Input
                key={"Admin Password"}
                error={formState.adminPasswordError}
                name={"adminPassword"}
                value={formState.adminPassword}
                onChange={formUpdateHelper}
                label="Admin Password"
                placeholder="Enter admin's password"
            />,
            <Input
                key={"Admin Confirm Password"}
                error={formState.adminConfirmPasswordError}
                name={"adminConfirmPassword"}
                value={formState.adminConfirmPassword}
                onChange={formUpdateHelper}
                label="Confirm Password"
                placeholder="Confirm admin's password"
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
    const {formState, updateFormState} = useContext(FormContext)

    if (formState.inputType === "name") {
        return (
            <PrimaryButton
                onClick={() => goToAdmin(formState, updateFormState)}
                className={"rounded-full"}
                content={"Next"}
            />
        )
    } else {
        return (
            <div className="flex justify-around">
                <OutlineButton
                    onClick={() => goBack(formState, updateFormState)}
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
    const initalState ={
        inputType: "name",
        instituteName: "",
        instituteNameError: "",
        adminName: "",
        adminNameError: "",
        adminEmail: "",
        adminEmailError: "",
        adminPassword: "",
        adminPasswordError: "",
        adminConfirmPassword: "",
        adminConfirmPasswordError: ""
    }

    const [formState, setFormState] = useState(initalState)

    const updateFormState = (name, value) => {
        setFormState({
            ...formState,
            [name]: value
        })
    }

    return (
        <FormContext.Provider value={{
            formState,
            updateFormState
        }}>
            <ImageSplitView src={signupImage} className="bg-linear-to-t from-background-100 to-white">
                <SignupForm />
            </ImageSplitView>
        </FormContext.Provider>
    )
}

function goToAdmin(formState, updateFormState) {
    updateFormState("inputType", "admin")

    console.log(formState.instituteName, formState.adminName)
}

function goBack(formState, updateFormState) {
    updateFormState("inputType", "name")
}

export default SignUp
