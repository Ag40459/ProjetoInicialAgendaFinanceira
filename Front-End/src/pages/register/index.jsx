import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import api from "../../services/api";
import { setItem } from '../../utils/storage';
import './style.css';

function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [mensageErro, setMensageErro] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!email || !nome || !senha || !confirmation) {
                setMensageErro("Preencha todos os campos!")
                setTimeout(() => {
                    setMensageErro()
                }, 2000);
                return;
            }

            if (senha !== confirmation) {
                setMensageErro("Senha nao Confere!")
                setTimeout(() => {
                    setMensageErro()
                }, 2000);
                return;
            }
            setMensageErro()

            await api.post("/usuario", {
                nome,
                email,
                senha,
            })
            const response = await api.post("/login", {
                email,
                senha
            })
            const { token, usuario } = response.data;
            setItem("nome", usuario.nome);
            setItem("token", token);
            setMensageErro("Cadastro Efetuado com Sucesso!!")

        } catch (error) {
            setMensageErro(error.response.data.mensage);
            setTimeout(() => {
                setMensageErro();
            }, 2000);
        }
        return setTimeout(() => {
            navigate("/main");
        }, 2000);

    }
    useEffect(() => {
        document.querySelector("body").style.overflowY = 'hidden';

        return () => {
            document.querySelector("body").style.overflowY = 'auto';
        }
    }, []);
    return (
        <div className='container'>
            <header>
                <img src={Logo} alt='Logo' />
            </header>
            <div className='container_register' >

                <form className='container_register_form' onSubmit={handleSubmit}>
                    <h1>Cadastre-se</h1>
                    <div>


                        <label>Nome</label>
                        <input
                            type='text'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label>E-mail</label>
                        <input
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Senha</label>
                        <input
                            type='password'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}

                        />
                        <label>Confirmacao de senha</label>
                        <input
                            type='password'
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}

                        />
                    </div>

                    <strong className='document_strong'>{mensageErro} </strong>
                    <button
                        onClick={(e) => handleSubmit(e)}
                    >
                        Cadastrar
                    </button>
                    <a className="link" href="../Signin/">ja tem cadastro? clique aqui</a>
                </form>

            </div>
        </div >
    );
}

export default Register;