function PrimaryButton({ content, className, onClick }) {
    return (
            <button onClick={onClick} className={` bg-primary-500 py-2 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-primary-700 focus:shadow-none hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${className}`}>
                {content}
            </button>
    )
}

export default PrimaryButton
