import { Outlet, useLocation } from "react-router-dom";
import Button from './Button.jsx';
import avatar from '../assets/country-explorer-avatar.png';

export default function Layout() {
    //gives current path (for showing/hiding buttons in nav)
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="app-shell">
            <header className="app-header">
                <h1 className={`app-nav ${isHome ? 'app-title' : 'app-title app-title-other'}`}>Country Explorer</h1>
                <p className="slogan-p">- Do you know your flags? -</p>

            {isHome && (
                <img
                src={avatar}
                alt="Pixel-art globe with flags"
                className="hero-pixel"
                loading="lazy"
              />
            )}
            

            {isHome && (
                <section className="code-block">
                    <code>
                    &lt;<span className="tag">section</span>&gt;{"\n"}
                    {"  "}<span className="comment">// a frontend students journey</span>{"\n"}
                    {"  "}<span className="comment">// with react: </span>
                    <span className="string">"are you proud, mom?"</span>{"\n"}
                    &lt;/<span className="tag">section</span>&gt;
                    </code>
                </section>
            )}
                <hr className={`${isHome ? 'hr-fade' : 'hr-normal'}`} />

                <nav className={`app-nav ${isHome ? 'nav-home' : 'nav-inner'}`}>
                    {location.pathname !== "/" && <Button className={`${isHome ? 'button-nav' : 'button-nav-other'}`} to="/" end>Home</Button>}
                    {location.pathname !== "/countries" && (<Button className={`${isHome ? 'button-nav' : 'button-nav-other'}`} to="/countries">Study</Button>)}
                    {location.pathname !== "/collection" && (<Button className={`${isHome ? 'button-nav' : 'button-nav-other'}`} to="/collection">Collection</Button>)}
                    {location.pathname !== "/quiz" && (<Button className={`${isHome ? 'button-nav button-quiz' : 'button-nav-other button-quiz'}`} to="/quiz">Quiz</Button>)}
                    {location.pathname !== "/leaderboard" && (<Button className={`${isHome ? 'button-nav' : 'button-nav-other'}`} to="/leaderboard">Score</Button>)}
                </nav>
                <hr className={`${isHome ? 'hr-fade' : 'hr-normal'}`} />
            </header>

            <main className="app-main">
                {/* Outlet is the slot where the active page is rendered*/}
                <Outlet />
            </main>

            <footer className="app-footer">
                <code>
                    <span className="keyword">export default</span> <span className="string">"thanks for visiting!"</span><br />{"\n"}
                    <span className="comment">// built with ☕️ and an obession over VSC themes</span>
                </code>
            </footer>
        </div>
    );
}