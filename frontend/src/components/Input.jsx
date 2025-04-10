function Input({ placeholder = "Type here...", type = "text", label = "", error = "", onChange, value, name }) {
    const Label = () => {
        if (label.length == 0) {
            return null
        }

        return (
            <label className="block mb-2 text-md text-left px-5 font-light font-poppins text-gray-500">
                {label}
            </label>
        )
    }

    const Error = () => {
        if (error.length == 0) {
            return null
        }

        return (
            <p className="flex items-center mt-2 text-xs text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-5 h-5 mr-1.5">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                {error}
            </p>
        )
    }

    return (
        <div className="w-full max-w-sm min-w-[200px]">
            <Label />
            <input
                name={name}
                onChange={(e) => onChange(e)}
                value={value}
                type={type}
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-md rounded-full px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
                placeholder={placeholder}
            />
            <Error />
        </div>
    )
}

export default Input
