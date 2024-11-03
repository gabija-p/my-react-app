const FilterSelector = ({id, handleChange, options}) => {
    return(
        <select
            id={id}
            onChange={handleChange}
            defaultValue={""}
            className="ml-1 bg-gray-50 border border-gray-300 p-1 rounded-md cursor-pointer dark:bg-dark-mode-gray-200"
        >{options}</select>
    );
}

export default FilterSelector;