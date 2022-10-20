import './style.css';
import Logo from "../../assets/Logo.png";


export default function Header() {
    return (
        <div>
            <header>
                <img src={Logo} alt='Logo' />
            </header>
        </div>
    )
}