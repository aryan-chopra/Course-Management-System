function OutlineButton({ content, className, onClick }) {
    return (
        <button className={`bg-white rounded-md border border-slate-300 py-2 px-4 text-center text-lg transition-all shadow-sm hover:shadow-lg text-slate-600 hover:bg-accent-100 focus:bg-accent-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${className}`} type="button" onClick={onClick}>
            {content}
        </button>
    )
}

export default OutlineButton
