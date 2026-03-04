import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'Live Map' },
    { to: '/ip-analyzer', label: 'IP Analyzer' },
    { to: '#', label: 'Intelligence' },
    { to: '#', label: 'Reports' },
];

export default function Navbar() {
    return (
        <header className="bg-typo-bg border-b border-typo-border sticky top-0 z-50">
            <div className="flex items-center justify-between mx-auto w-full px-6 py-4 max-w-[1600px]">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-12">
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <div className="size-5 text-typo-text">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 12L12 17L22 12" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-serif font-medium tracking-tight text-typo-text">DDoS Shield.</h2>
                    </NavLink>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    `text-xs uppercase tracking-widest transition-colors ${isActive
                                        ? 'text-typo-text border-b border-typo-text pb-0.5 font-medium'
                                        : 'text-typo-text-light hover:text-typo-text'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right: Search, notification, avatar */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center border-b border-typo-border pb-1">
                        <input
                            className="w-48 bg-transparent text-typo-text text-sm border-none p-0 focus:ring-0 focus:outline-none placeholder:text-typo-text-light placeholder:font-serif placeholder:italic"
                            placeholder="Search parameters..."
                            type="text"
                        />
                        <span className="material-symbols-outlined text-[16px] text-typo-text">search</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-typo-text hover:opacity-70 transition-opacity relative">
                            <span className="material-symbols-outlined text-[20px] font-light">notifications</span>
                            <span className="absolute -top-1 -right-1 size-1.5 bg-risk-critical rounded-full"></span>
                        </button>
                        <div className="size-8 rounded-full bg-typo-text/10 border border-typo-border flex items-center justify-center text-xs font-medium">
                            JS
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
