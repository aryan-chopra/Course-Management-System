import ImageSplitView from "../components/ImageSplitView.jsx"
import signupImage from "../assets/signup_image.png"

function SignUp() {
    console.log("At Signup")

    return (
        <ImageSplitView src={signupImage} className="bg-linear-to-tl from-primary-100 to-white">
            <p>Test</p>
        </ImageSplitView>
    )
}

export default SignUp
