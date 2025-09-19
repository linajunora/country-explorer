
import {NavLink } from 'react-router-dom';

//childre, onClick etc are PROPS the Button accepts, written using object destructuring
// children: whatever you put bewtween the <Button> ... </Button>, usually the button text
export default function Button({ children, to, onClick, type = 'button', className = ''}) {
    //components return JSX (HTML-like markup) that React turns into real DOM
    if (to) {
        return (
            <NavLink to={to} className={({ isActive }) => `btn ${className} ${isActive ? "active" : ""}`}>
                {children}
            </NavLink>  
        );
    }
    
    return (
        <button 
        type={type} 
        onClick={onClick} 
        className={`btn ${className}`}
        >
            {children}
        </button>
    );
}