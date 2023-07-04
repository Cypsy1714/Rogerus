import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(username, password);
    }

    return(
        <div className="login-container">
            <form className="login" onSubmit={handleSubmit}>
                <h3>Log in</h3>

                <label>Username:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_username(e.target.value)}}
                    value={username}
                />
                <label>Password:</label>
                <input 
                    type="password"
                    onChange={(e) => {set_password(e.target.value)}}
                    value={password}
                />

                <button disabled={isLoading}>Log in</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Login;