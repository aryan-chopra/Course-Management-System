import landingImage from "../assets/landing_image.jpg"
import OutlineButton from "../components/OutlineButton.jsx"
import PrimaryButton from "../components/PrimaryButton.jsx"

function LandingPage() {
    return (
        <div className="w-screen h-screen max-w-full max-h-screen flex flex-row">
            <div className="basis-1/3 flex flex-col gap-6 items-center justify-center">
                <span className="font-mono text-6xl font-bold text-left">
                    Your Time Matters
                </span>

                <span className="font-mono text-left font-light text-gray-600">
                    Access organized and labeled resources in a single click
                </span>

                <div className="w-full flex justify-start gap-5">
                    <PrimaryButton className="basis-1/3" content={"Sign In"}/> 

                    <OutlineButton className="basis-1/3" content={"Sign Up"}/>
                </div>
            </div>
            <div className="basis-2/3 flex items-center justify-center">
                <img className="object-cover" src={landingImage} alt="loading..." />
            </div>
        </div>
    )
}

export default LandingPage
