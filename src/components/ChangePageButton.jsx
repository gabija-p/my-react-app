const ChangePageButton = ({name, disabledFunc, onClickFunc}) => {
    return(
        <button 
            disabled={disabledFunc}
            onClick={onClickFunc}
            className="font-serif rounded-md border border-gray-300 p-1 mr-1 disabled:text-gray-400 active:bg-slate-200 dark:bg-dark-mode-gray-200 dark:hover:bg-dark-mode-gray-100 dark:active:bg-dark-mode-gray-100"
        >{name}</button>   
    );
}

export default ChangePageButton;