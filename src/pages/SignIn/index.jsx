import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import api from "../../services/api";
import { getItem, setItem } from "../../utils/storage";
import './style.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensageError, setMensageError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const token = getItem("token");
        if (token) {
            navigate("/main");
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!email || !senha) {
                setMensageError("Preencha todos os campos!")
                return setTimeout(() => {
                    setMensageError()
                }, 2000);
            }
            setMensageError()

            const response = await api.post("/login", {
                email,
                senha
            })
            const { token, usuario } = response.data;

            setItem("nome", usuario.nome);
            setItem("token", token);
            setMensageError('Login efetuado com sucesso!')


        } catch (error) {
            console.log(error);
            setMensageError(error.response.data.mensage)
            return setTimeout(() => {
                setMensageError()
            }, 1000);
        }

        setTimeout(() => {
            navigate("/main");
        }, 1000);
    }
    return (
        <div className='container_login'>

            <div className='container_aside_login'>

                <div className='container_aside'>
                    <h1>Controle suas <span>finanças</span>,<br></br>
                        sem planilha chata. </h1>
                    <p>Organizar as suas finanças nunca foi tão fácil,<br></br>
                        com o DINDIN, você tem tudo num único lugar<br></br>
                        e em um clique de distância.</p>

                    <button onClick={() => navigate("/")}>
                        Cadastre-se
                    </button>
                </div>
                <div className="card">
                    <form className="card_form">
                        <h1>Login</h1>
                        <div className="card_form_card">
                            <label>E-mail</label>
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Password</label>
                            <input
                                type='password'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                        <strong>
                            {mensageError}
                        </strong>

                        <button
                            type='button'
                            onClick={(e) => handleSubmit(e)}>
                            Entrar
                        </button>
                        <Link className="link_signin" to="/">Não tem cadastro? Clique Aqui</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
