import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import CredentialsInput from "../components/CredentialsInput";


const LogInScreen = () => {
    const { logIn } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    const handleLogIn = (e) => {    
        e.preventDefault();

        if(username === "janeDoe" && password === "strongPassword123")
        {
            setShowError(false);
            logIn({ username }, 10 * 60 * 1000);
            navigate("/table");
        }
        else{
            setShowError(true);
        }
    }

    return(
        <form 
            className="flex flex-col mx-auto font-serif md:w-1/2"
            onSubmit={handleLogIn}
        >
            <label className="text-start text-slate-800 dark:text-white">Username</label>
            <CredentialsInput
                inputType={"text"}
                inputValue={username}
                handleChange={(e) => setUsername(e.target.value)}
            />
            <label className="mt-3 text-start text-slate-800 dark:text-white">Password</label>
            <CredentialsInput
                inputType={"password"}
                inputValue={password}
                handleChange={(e) => setPassword(e.target.value)}
            />
            { showError ? <div className="mt-1 mb-5 text-red-500 dark:text-red-400">Username or password is incorrect.</div> : <div className="mt-12"></div>}                
            <button
                className="rounded-md border text-white border-slate-700 bg-slate-600 p-1 active:bg-slate-200 disabled:bg-slate-300 dark:bg-dark-mode-gray-200 dark:disabled:bg-dark-mode-gray-100 dark:hover:bg-dark-mode-gray-100 dark:active:bg-dark-mode-gray-100"
                type="submit"
            >
                Log In
            </button>
        </form>
    );
}

export default LogInScreen;