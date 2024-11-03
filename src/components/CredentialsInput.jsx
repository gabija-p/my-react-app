const CredentialsInput = ({inputType, inputValue, handleChange}) => {
    return(
        <input
            className="border font-serif border-slate-600 p-1 rounded-md w-full outline-none focus:outline-gray-600 focus:border-transparent dark:bg-dark-mode-gray-200"
            type={inputType}
            value={inputValue}
            onChange={handleChange}
        />
    );
}

export default CredentialsInput;