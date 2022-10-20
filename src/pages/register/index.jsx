import { Link, useNavigate } from "react-router-dom";
import UseUser from '../../hooks/useUser';
import api from "../../services/api";
import { setItem } from '../../utils/storage';
import './style.css';

function Register() {
    const { nome, setNome, email, setEmail, senha, setSenha, confirmation, setConfirmation, mensageErro, setMensageErro } = UseUser()

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
            return setTimeout(() => {
                setMensageErro();
            }, 2000);
        }
        return setTimeout(() => {
            setMensageErro("")
            navigate("/main");
        }, 2000);

    }

    return (
        <div className='container_register' >

            <form className='container_register_form' onSubmit={handleSubmit}>
                <h1>Cadastre-se</h1>
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

                <strong className='document_strong'>{mensageErro} </strong>
                <button
                    onClick={(e) => handleSubmit(e)}
                >
                    Cadastrar
                </button>
                <Link className="link" to="../signin/">ja tem cadastro? clique aqui</Link>
            </form>

        </div>
    );
}

export default Register;