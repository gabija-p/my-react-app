import { useRef, useEffect } from "react";

const MoreInformationModal = ({openModal, onClose, worker}) => {
    const dialogRef = useRef();

    useEffect(() => {       
        if (openModal) {
            dialogRef.current.showModal();
        }
        else{
            dialogRef.current.close();
        }
    }, [openModal]);



    return (
        <dialog 
            ref={dialogRef}
            className="rounded-md p-3"
        >
            <button
                onClick={onClose}
                className="flex rounded-md border border-gray-400 p-1 font-serif active:bg-gray-200 dark:hover:bg-dark-mode-gray-100 dark:active:bg-dark-mode-gray-100 dark:bg-dark-mode-gray-200"
            >
                Close
            </button>
            <ul className="list-disc p-5 text-start font-serif">
                <li>
                    {`Identification number: ${worker?.customerIdentificationCode}`}
                </li>
                <li>
                    {`First name: ${worker?.firstName}`}
                </li>
                <li>
                    {`Last name: ${worker?.lastName}`}
                </li>
                <li>
                    {`Birth date: ${worker?.birthDate}`}
                </li>
                <li>
                    {`Gender: ${worker?.gender}`}
                </li>
            </ul>
        </dialog>
    );
}

export default MoreInformationModal;