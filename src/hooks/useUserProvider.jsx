import { useState } from "react";
import { useLocalStorage } from "react-use";

function useUseProvider() {
    const [token, setToken, removeToken] = useLocalStorage('token', '');
    const [openModal, setOpenModal] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [mensageErro, setMensageErro] = useState('');
    const [summary, setSummary] = useState([]);

    return {
        openModal, setOpenModal, token, setToken, removeToken, nome, setNome, email, setEmail, senha, setSenha, confirmation, setConfirmation, mensageErro, setMensageErro, summary, setSummary
    }
}

export default useUseProvider;
