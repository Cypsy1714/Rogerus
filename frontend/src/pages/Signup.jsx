import { useState } from "react"
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [tag, set_tag] = useState('');
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(tag, username, password)
    }

    return(
        <div className="signup-container">
            <form className="signup" onSubmit={handleSubmit}>
                <h3>Sign up</h3>

                <label>Tag:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_tag(e.target.value)}}
                    value={tag}
                />
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

                <button disabled={isLoading}>Sign up</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Signup;