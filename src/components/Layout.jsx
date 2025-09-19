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
                <h1 className="app-title">Country Explorer</h1>

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
                <hr className="hr-fade" />

                <nav className={`app-nav ${isHome ? 'nav-home' : 'nav-inner'}`}>
                    {location.pathname !== "/" && <Button className="button-nav" to="/" end>Home</Button>}
                    {location.pathname !== "/countries" && (<Button className="button-nav" to="/countries">Study</Button>)}
                    {location.pathname !== "/collection" && (<Button className="button-nav" to="/collection">Collection</Button>)}
                    {location.pathname !== "/quiz" && (<Button className="button-nav button-quiz" to="/quiz">Quiz</Button>)}
                    {location.pathname !== "/leaderboard" && (<Button className="button-nav" to="/leaderboard">Leaderboard</Button>)}
                </nav>
                <hr className="hr-fade" />
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