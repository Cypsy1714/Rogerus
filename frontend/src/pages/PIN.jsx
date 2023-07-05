import { useEffect, useState } from "react";
import { isNumber } from "../scripts/isNumber";
import { useNavigate } from 'react-router-dom';
import { usePin } from "../hooks/usePin";

const PIN = () => {
    const [pin, set_pin] = useState('');
    const {enterPin, isLoading, error, success} = usePin();
    const navigate = useNavigate();

    useEffect(() => {
        // navigate to home page when pin is entered
        if(success) {
            navigate('/');
        }
    }, [success])

    async function handleSubmit(e) {
        e.preventDefault();

        await enterPin(pin);
    }

    return(
        <div className="pin-container">
            <form className="pin" onSubmit={handleSubmit}>

                {/* PIN */}
                <label>PIN:</label>
                <input 
                    type="text"
                    // limit the entry type to only numbers and below 8 digits
                    onChange={(e) => {if (e.target.value.length < 9 && isNumber(e.nativeEvent.data)) {set_pin(e.target.value)}}}
                    value={pin}
                />

                {/* display the error message */}
                <button disabled={isLoading}>Log in</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default PIN;