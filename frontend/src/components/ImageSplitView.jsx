function ImageSplitView(props) {
    console.log(props.children[0])

    return (
        <div className={`p-32 w-screen h-screen max-w-full max-h-screen flex flex-row overflow-hidden ${props.className}`}>
            <div className="basis-1/3 flex flex-col gap-6 items-center justify-center">
                {props.children}
            </div>
            <div className="basis-2/3 flex items-center justify-center">
                <img className="object-cover" src={props.src} alt="loading..." />
            </div>
        </div>
    )
}

export default ImageSplitView
