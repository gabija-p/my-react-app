import React from "react";
import ChangePageButton from "../components/ChangePageButton";
import FilterSelector from "../components/FilterSelector";
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from "react";
import MoreInformationModal from "../components/MoreInformationModal";

const WorkersTableScreen = () => {
    const { logOut } = useAuth();

    const [workers, setWorkers] = useState(null);
    const [workersToShow, setWorkersToShow] = useState([]);
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortBy, setSortBy] = useState('');
    const firstRender = useRef(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [currentListSize, setCurrentListSize] = useState(10);

    const [showMoreInformation, setShowMoreInformation] = useState(false);
    const [currentWorker, setCurrentWorker] = useState(null);

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false;
            return;
        }

        let updatedList = sort();
        updatedList = filterByYear(updatedList);
        updatedList = filterBySearch(updatedList);
        setWorkersToShow(updatedList);
            
    }, [sortBy, yearFilter, search, currentPage, currentListSize])

    useEffect(() => {
        markSearchResults();
    }, [workersToShow])

    useEffect(() => {
        const checkSession = () => {
            const expiry = localStorage.getItem('expiry');
            if (expiry && new Date() > new Date(expiry)) {
                console.log("logging out");
                logOut();
            }
        };

        const interval = setInterval(checkSession, 60000);

        return () => clearInterval(interval);
    }, [logOut]);

    const fetchData = (page=0, size=10) => {
        const cachedData = localStorage.getItem(`${page}-${size}`);
        if (cachedData) {
            const expiryDate = new Date(JSON.parse(cachedData).expiryDate);
            if(new Date() < expiryDate){
                setData(JSON.parse(cachedData).data, page, size);
                return;
            }
        }

        fetch(`https://hiring-api.simbuka.workers.dev/?page=${page}&size=${size}`)
        .then((response) => {
            if (!response.ok) {
              console.error('A problem occurred while retrieving data.');
            }
            return response.json();
          })
        .then((data) => {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 10)

            const item = {
                data,
                expiryDate
            }

            localStorage.setItem(`${page}-${size}`, JSON.stringify(item));
            setData(data, page, size);
          })
        .catch((error) => {
            console.error('Error fetching data: ', error);
          });
    }

    const setData = (data, page, size) => {
        setWorkers(data);
        setWorkersToShow(data);
        setYearFilter("");
        setCurrentPage(page);
        setCurrentListSize(size);
    }

    const handlePreviousPageClick = () => {
        const newPage = parseInt(currentPage) - 1;
        fetchData(newPage, currentListSize);
    }

    const handleNextPageClick = () => {
        const newPage = parseInt(currentPage) + 1;
        fetchData(newPage, currentListSize);
    }

    const handleSizeChange = (event) => {
        fetchData(parseInt(currentPage), event.target.value);
    }

    const handlePageChange = (event) => {
        fetchData(parseInt(event.target.value), currentListSize);
    }

    const handleSort = (event) => {
        setSortBy(event.target.value);
    }

    const handleFilter = (event) => {
        setYearFilter(event.target.value);
    }

    const handleSearch = (event) => {
        setSearch(event.target.value);
    }

    const openMoreInformation = (worker) => {
        setCurrentWorker(worker);
        setShowMoreInformation(true);
    }

    const sort = () => {
        const sortedWorkers = [...workers];

        if(sortBy === 'first-name'){
            sortedWorkers.sort((a, b) => a.firstName.localeCompare(b.firstName));
        }
        else if(sortBy === 'last-name'){

            sortedWorkers.sort((a, b) => a.lastName.localeCompare(b.lastName));
        }
        
        return sortedWorkers;
    }

    const filterByYear = (updatedList) => {
        let filteredWorkers = updatedList;

        if(yearFilter !== ""){
            filteredWorkers = updatedList.filter(worker => worker.birthDate.slice(0, 4) === yearFilter);
        }

        return filteredWorkers;
    }

    const filterBySearch = (updatedList) => {

        const results = [];

        //Clear previous search's highlights.
        const elements = document.querySelectorAll('[id^="worker"]');

        elements.forEach(element => {
            element.innerHTML = element.textContent.replace('<mark">', "");
            element.innerHTML = element.textContent.replace('</mark>', "");
        })

        if(search === "") return updatedList;

        updatedList.forEach(worker => {

            if(worker.firstName.toLowerCase().indexOf(search.toLowerCase()) !== -1 || worker.lastName.toLowerCase().indexOf(search.toLowerCase()) !== -1){
                results.push(worker);
            }

        });

        return results;
    }

    const markSearchResults = () => {
        if(search === "") return;

        const elements = document.querySelectorAll('[id^="worker"]');
        let pattern = new RegExp(search, "gi");

        elements.forEach(worker => {
            worker.innerHTML = worker.textContent.replace(pattern, match => `<mark class="bg-slate-400 text-slate-900 dark:bg-slate-800 dark:text-gray-300">${match}</mark>`); 
        })
    }

    const generateYears = () => {
        const optionElements = [];
        const years = [];

        workers.forEach(worker => {
            const year = worker.birthDate.slice(0, 4);
            if(!years.includes(year))
            {
                years.push(year);
            }

        });

        years.sort();

        years.forEach(year => {
            optionElements.push(
                <option key={`year-${year}`} value={year}>
                    {year}
                </option>
            );
        })

        return optionElements;
    }

    const generatePageSizes = () => {
        const optionElements = [];
        for (let i = 1; i <= 10; i++) {
            optionElements.push(
                <option key={`size-${i}`} value={i}>
                    {i}
                </option>
            );
        }
        return optionElements;
    };
    
    const generatePageButtons = () => {
        const pageButtons = [];
        for (let i = 1; i <= 10; i++) {
            pageButtons.push(
                <button 
                    key={`page-${i}`}
                    disabled={parseInt(currentPage) === i - 1}
                    className="rounded-md border border-gray-300 bg-white w-7 p-1 active:bg-slate-200 disabled:bg-slate-300 dark:bg-dark-mode-gray-200 dark:disabled:bg-dark-mode-gray-100 dark:hover:bg-dark-mode-gray-100 dark:active:bg-dark-mode-gray-100"
                    onClick={handlePageChange}
                    value={i - 1}
                >
                    {i}
                </button>
            );
        }
        return pageButtons;
    }

    return (
        <React.Fragment key={"list-page"}>
            <MoreInformationModal 
                openModal={showMoreInformation}
                onClose={() => setShowMoreInformation(false)}
                worker={currentWorker}
            />
            <div className="font-serif flex justify-between md:ml-20 md:mr-20">
                <div className="justify-start mb-5"><span className="font-bold mr-1">Logged in:</span>{JSON.parse(localStorage.getItem('user')).username}</div>
                <button 
                    className="mb-5 rounded-md border border-gray-300 p-1 mr-1 disabled:text-gray-400 active:bg-slate-200 dark:bg-dark-mode-gray-200 dark:hover:bg-dark-mode-gray-100 dark:active:bg-dark-mode-gray-100"
                    onClick={logOut}
                >Log Out</button>
            </div>
            { workers != null ? <div className="md:w-2/3 w-full mx-auto">
                <div className="block text-left w-full md:justify-start md:flex">
                    <div className="font-serif">
                        Sort by: 
                        <FilterSelector
                            id={"sort"}
                            handleChange={handleSort}
                            options={<>
                                <option value="" disabled hidden>–</option>
                                <option value='first-name'>First name</option>
                                <option value='last-name'>Last name</option>
                            </>}
                        />          
                    </div>
                    <div className="mt-1 font-serif md:ml-2 md:mt-0">
                        Year of birth:
                        <FilterSelector
                            id={"yearFilter"}
                            handleChange={handleFilter}
                            options={<>
                                <option value="">–</option>
                                {generateYears()}
                            </>}
                        />  
                    </div>   
                </div>
                <div className="md:flex md:justify-start pt-2 pb-2 w-full">
                    <input 
                        type="text"
                        className="border font-serif border-gray-300 p-1 rounded-md w-full md:w-2/3 outline-none focus:outline-gray-600 focus:border-transparent dark:bg-dark-mode-gray-200"
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                </div>
                <table 
                    id="table"
                    className="overflow-hidden rounded-lg w-full table-fixed"
                >
                    <thead className="bg-slate-400 dark:bg-slate-800">
                        <tr key={'table-header'}>
                            <th className="border-r border-b font-serif text-center">First name</th>
                            <th className="border-r border-b font-serif text-center">Last name</th>
                            <th className="border-b w-1/3 lg:w-1/4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-300 dark:bg-slate-700">
                        {workersToShow.map((worker, index) => {
                            return (
                                <WorkerRow
                                    key={`row-${worker.id}`}
                                    worker={worker}
                                    isLast={workersToShow.length - 1 == index}
                                    onMoreInformationClick={() => openMoreInformation(worker)}
                                />
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex justify-between w-full mt-1">
                    <div className="">
                        <ChangePageButton 
                            name={"Previous"}
                            disabledFunc={parseInt(currentPage) === 0}
                            onClickFunc={handlePreviousPageClick}
                        />
                        <ChangePageButton
                            name={"Next"}
                            disabledFunc={parseInt(currentPage) === 9}
                            onClickFunc={handleNextPageClick}
                        />
                    </div>
                    <div className="font-serif h-full">
                    Items per page:                     
                        <select 
                            className="ml-1 p-2 font-serif h-full rounded-md border border-gray-300 bg-white cursor-pointer dark:bg-dark-mode-gray-200"
                            onChange={handleSizeChange}
                            defaultValue={10}
                        >
                            {generatePageSizes()}
                        </select>
                    </div>
                </div>
                <div className="font-serif h-full mt-5">
                    {generatePageButtons()}
                </div>
            </div> : <div>There is no data to be shown</div>}
        </React.Fragment>
    );
}

const WorkerRow = ({worker, isLast, onMoreInformationClick}) => {
    return (
    <tr 
        key={`item-${worker.id}`}
        className="h-full"
    >
        <td 
            id={`worker-first-${worker.id}`}
            className={`${isLast ? "" : "border-b"} border-r p-2 font-serif text-left`}
        >{worker.firstName}</td>
        <td 
            id={`worker-last-${worker.id}`}
            className={`${isLast ? "" : "border-b"} border-r last:border-b-0 p-2 font-serif text-left`}
        >{worker.lastName}</td>
        <td
            className={`${isLast ? "" : "border-b"} h-full font-serif text-left`}
        >
            <button 
                className="w-full h-full bg-slate-200 hover:bg-slate-300 hover:border-gray-400 md:active:bg-slate-300 font-serif text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-700"
                onClick={onMoreInformationClick}
            >
                More information
            </button>
        </td>
    </tr>
    );
}


export default WorkersTableScreen;