import {NavLink} from "react-router";

function NavBar() {
    return (
        <div id="nav-bar">
            <NavLink to={'/'}>
                <button>Home</button>
            </NavLink>
            <NavLink to={'/search'}>
                <button>Search</button>
            </NavLink>
            <NavLink to={'/favorites'}>
                <button>Favorites</button>
            </NavLink>
        </div>
    )
}

export default NavBar;