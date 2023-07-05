import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(!user.pKey) {
            navigate('/pin');
        }
    }, [])
    return (
        <div className="home">
            <h1>Home</h1>
        </div>
    )
}

export default Home;