import { useState } from "react"
import { useSignup } from "../hooks/useSignup";
import { isNumber } from "../scripts/isNumber";

const Signup = () => {
    const [tag, set_tag] = useState('');
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [pin, set_pin] = useState('');
    const {signup, error, isLoading} = useSignup()

    async function handleSubmit(e) {
        e.preventDefault();

        await signup(tag, username, password, pin);
    }

    return(
        <div className="signup-container">
            <form className="signup" onSubmit={handleSubmit}>
                <h3>Sign up</h3>

                {/* Tag */}
                <label>Tag:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_tag(e.target.value)}}
                    value={tag}
                    //style={{borderColor: "#f55a4c"}}
                />
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
                <label>8 Digit PIN:</label>
                <input 
                    type="text"
                    // limit the entry type to only numbers and below 8 digits
                    onChange={(e) => {if (e.target.value.length < 9 && isNumber(e.nativeEvent.data)) {set_pin(e.target.value)}}}
                    value={pin}
                />

                {/* Disable button if the request is loading */}
                <button disabled={isLoading}>Sign up</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Signup;