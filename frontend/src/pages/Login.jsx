import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { isNumber } from "../scripts/isNumber";

const Login = () => {
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [pin, set_pin] = useState('');
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(username, password, pin);
    }

    return(
        <div className="login-container">
            <form className="login" onSubmit={handleSubmit}>
                <h3>Log in</h3>

                {/* Username */}
                <label>Username:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_username(e.target.value)}}
                    value={username}
                />
                {/* Password */}
                <label>Password:</label>
                <input 
                    type="password"
                    onChange={(e) => {set_password(e.target.value)}}
                    value={password}
                />
                {/* PIN */}
                <label>PIN:</label>
                <input 
                    type="text"
                    // limit the entry type to only numbers and below 8 digits
                    onChange={(e) => {if (e.target.value.length < 9 && isNumber(e.nativeEvent.data)) {set_pin(e.target.value)}}}
                    value={pin}
                />

                <button disabled={isLoading}>Log in</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Login;