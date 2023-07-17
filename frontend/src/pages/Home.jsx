import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { MessageContext } from "../context/MessageContext";

const Home = () => {
    const {user} = useContext(AuthContext);
    const {dispatch} = useContext(MessageContext);
    const navigate = useNavigate();
    const [contact_tag, set_contact_tag] = useState('');
    const [msg_tag, set_msg_tag] = useState('');
    const [msg, set_msg] = useState('');

    useEffect(() => {
        if(!user.pKey) {
            navigate('/pin');
        }
    }, [])

    const save_test = async (e) => {
        e.preventDefault();
        dispatch({type: 'SAVE', payload: {pKey: user.pKey, tag: user.tag}});
    }

    const read_test = async (e) => {
        e.preventDefault();
        dispatch({type: 'LOGIN', payload: {pKey: user.pKey, tag: user.tag}});
    }

    const logout_test = async (e) => {
        e.preventDefault();
        dispatch({type: 'LOGOUT'});
    }

    const handleAddContact = async (e) => {
        e.preventDefault();
        dispatch({type: 'ADD_CONTACT', payload:{tag: contact_tag, key: "placeholderkey", messages: []}})
    }

    const handleAddMessage = async (e) => {
        e.preventDefault();
        dispatch({type: 'ADD_MESSAGE', payload:{tag: msg_tag, message: {date: "dateplaceholder", content: msg}}})
    }

    return (
        <div className="home">
            <h1>Home</h1>

            <button onClick={save_test}>
                Encrypt and Save
            </button>

            <button onClick={read_test}>
                Decrypt and Read
            </button>

            <button onClick={logout_test}>
                Logout
            </button>

            <form className="add_contact" onSubmit={handleAddContact}>
                <h3>Add Contact</h3>

                <label>Tag:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_contact_tag(e.target.value)}}
                    value={contact_tag}
                />

                <button>Add</button>
            </form>

            <form className="add_message" onSubmit={handleAddMessage}>
                <h3>Add Message</h3>

                <label>Tag:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_msg_tag(e.target.value)}}
                    value={msg_tag}
                />

                <label>Message:</label>
                <input 
                    type="text"
                    onChange={(e) => {set_msg(e.target.value)}}
                    value={msg}
                />

                <button>Add</button>
            </form>
        </div>
    )
}

export default Home;