import ImageSplitView from "../components/ImageSplitView.jsx"
import landingImage from "../assets/landing_image.jpg"
import OutlineButton from "../components/OutlineButton.jsx"
import PrimaryButton from "../components/PrimaryButton.jsx"
import { useNavigate } from "react-router"

function LandingPage() {
    const navigate = useNavigate()

    const LeftContent = () => {
        return (
            <>
                <span className="font-poppins text-6xl font-semibold text-left">
                    Your Time Matters
                </span>

                <span className="font-poppins text-left font-light text-gray-600">
                    Access organized and labeled resources in a single click
                </span>

                <div className="w-full flex justify-start gap-5">
                    <PrimaryButton className="basis-1/3 rounded-md" content={"Sign In"} />

                    <OutlineButton className="basis-1/3 rounded-md" content={"Sign Up"} onClick={() => signup(navigate)} />
                </div>
            </>
        )
    }

    return (
        <ImageSplitView src={landingImage}>
            <LeftContent/>
        </ImageSplitView>
    )
}

function signup(navigate) {
    navigate('/signup')
}

export default LandingPage
