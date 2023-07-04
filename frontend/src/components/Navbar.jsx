import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {logout} = useLogout();
  const {user} = useContext(AuthContext);

  // handle the logout button
  const handleLogout = () => {
    logout();
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Rogerus</h1>
        </Link>
        <nav>
        {user ? 
          <div>
            <span>{user.tag}</span>
            <button onClick={handleLogout}>Log out</button>
          </div> 
          :
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        }
        </nav>
      </div>
    </header>
  )
}

export default Navbar;