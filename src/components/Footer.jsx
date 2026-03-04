import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t border-typo-border mt-12 py-12 bg-typo-bg">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <NavLink to="/" className="flex items-center gap-2">
                    <h2 className="text-lg font-serif italic tracking-tight text-typo-text">DDoS Shield.</h2>
                </NavLink>

                <div className="flex gap-8">
                    <a className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light hover:text-typo-text transition-colors" href="#">
                        Privacy Policy
                    </a>
                    <a className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light hover:text-typo-text transition-colors" href="#">
                        Terms of Service
                    </a>
                    <a className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light hover:text-typo-text transition-colors" href="#">
                        Contact Support
                    </a>
                </div>

                <div className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-risk-ok animate-pulse"></span>
                    © 2024 System Status: Online
                </div>
            </div>
        </footer>
    );
}
