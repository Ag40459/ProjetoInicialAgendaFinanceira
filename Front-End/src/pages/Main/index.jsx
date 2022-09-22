import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import iconCross from "../../assets/iconCross.png";
import iconDown from "../../assets/iconDown.svg";
import goOut from "../../assets/iconGoOut.png";
import iconPen from "../../assets/iconPen.png";
import iconPolygon from "../../assets/iconPolygon.png";
import iconTrash from "../../assets/iconTrash.png";
import iconUp from "../../assets/iconUp.png";
import iconX from "../../assets/iconX.png";
import iconFilter from "../../assets/inconFilter.png";
import Logo from "../../assets/Logo.png";
import avatar from "../../assets/profile.png";
import avatar2 from "../../assets/profile2.png";
import AddRecord from '../../components/addRecord';
import EditRecord from '../../components/editRecord';
import LoadSummary from '../../components/summary';
import api from "../../services/api";
import { currentDateFormatted, dayWeek } from '../../utils/date';
import { getItem, removeItem } from '../../utils/storage';
import './style.css';

function Main() {
    const nome = getItem('nome');
    const token = getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [selectCategory, setSelectCategory] = useState(true);
    const [form, setForm] = useState(false);
    const [listCategory, setlistCategory] = useState([]);
    const [detailTransaction, setDetailTransaction] = useState([]);
    const [modalClose, setModalClose] = useState(false);
    const [modalCloseEdit, setModalCloseEdit] = useState(false);
    const [dateEdit, setDateEdit] = useState(false);
    const [modalCloseDelete, setModalCloseDelete] = useState(false);
    const [mensageErro, setMensageErro] = useState('');
    const [dateFilter, setDateFilter] = useState(false);
    const [filterTransictions, setFilterTransictions] = useState([]);

    useEffect(() => {
        loadCategory()
    }, []);

    useEffect(() => {
        loadTransictions()
        setFilterTransictions([]);
    }, []);

    function logoff() {
        removeItem('nome');
        removeItem('token');
    }

    function handleFilter() {
        setForm(!form);
    }
    function handleClear() {
        setFilterTransictions([]);
        setMensageErro();
        loadTransictions();
    }

    function handleFilterDate() {
        const newListCategory = [...detailTransaction];
        if (dateFilter) {
            newListCategory.sort((a, b) => {
                return a.data.localeCompare(b.data)
            })
        } else if (!dateFilter) {
            newListCategory.sort((a, b) => {
                return b.data.localeCompare(a.data)
            })
        }
        setDateFilter(!dateFilter);
        return setDetailTransaction(newListCategory)
    }
    async function handleApplyFilter() {
        if (filterTransictions.length < 1) {
            setMensageErro('É preciso selecionar um ou mais campos!')
            return setTimeout(() => {
                setMensageErro()
            }, 2000);
        }
        const paramsCategory = filterTransictions.map((category) => { return `filtro[]=${category.descricao}` });

        try {
            const response = await api.get(`/transacao?${paramsCategory.join("&")}`, { headers })
            if (response.data.length < 1) {
                return
            }
            return setDetailTransaction(response.data);

        } catch (e) {
            return setMensageErro(e.request.response.data);
        }
    }

    function handleEdit(select) {
        setDateEdit(select)
        setModalCloseEdit(!modalCloseEdit);
        setModalCloseDelete(false);
    }

    function handleTrash(select) {
        setDateEdit(select)
        setModalCloseDelete(!modalCloseDelete);
    }

    function handleSelectFilter(category) {
        if (filterTransictions.includes(category)) {
            const categoryFilterLocal = [...filterTransictions];
            const categoryFind = categoryFilterLocal.findIndex((selectCategory) => {
                return selectCategory.id == category.id
            })
            categoryFilterLocal.splice(categoryFind, 1)
            return setFilterTransictions(categoryFilterLocal)
        }
        setFilterTransictions([...filterTransictions, category])
        setSelectCategory(!selectCategory);
    }

    async function loadCategory() {
        try {
            const response = await api.get("/categoria", {
                headers
            })
            setlistCategory(response.data);

        } catch (e) {
            return setMensageErro(e.request.response.data);
        }
    }
    async function loadTransictions() {
        try {
            const response = await api.get("/transacao", {
                headers
            })
            setDetailTransaction(response.data);

        } catch (e) {
            return setMensageErro(e.request.response.data);
        }
    }

    async function handleDeleteTransaction(select) {
        try {
            await api.delete(`/transacao/${select.id}`, { headers })
            const transaction = [...detailTransaction]
            const newDetailTransaction = transaction.filter(todo => todo.id !== select.id)
            setDetailTransaction(newDetailTransaction)

        } catch (e) {
            return setMensageErro(e.request.response.data);
        }
        setModalCloseDelete(!modalCloseDelete);
    }

    return (

        <div className='containerMain'>
            {modalClose && <AddRecord listCategory={listCategory} modalClose={modalClose} setModalClose={setModalClose} modalCloseEdit={modalCloseEdit} setDetailTransaction={setDetailTransaction} />}

            {modalCloseEdit && <EditRecord listCategory={listCategory} modalCloseEdit={modalCloseEdit} setModalCloseEdit={setModalCloseEdit} setDetailTransaction={setDetailTransaction} detailTransaction={detailTransaction} dateEdit={dateEdit} />}

            <header>

                <img src={Logo} alt="Logo" />
                <div className='containerMain_user'>

                    <img className='avatar' src={(getItem('nome') == 'Cubos Academy' ? avatar : avatar2)} alt="Perfil" ></img>
                    <strong >{nome} </strong>

                    <NavLink to="/signIn" onClick={logoff} >
                        <img className='goOut' src={goOut} alt="Incone Desconectar" onClick={logoff} />
                    </NavLink>

                </div>
            </header>
            <div className='containerMain_body'>
                <div className='containerMain_body_left'>
                    <span>
                        <img
                            onClick={handleFilter}
                            src={iconFilter}
                            alt="Incone Filtro" ></img>
                        Filtrar
                    </span>

                    <div
                        className='containerMain_body_left_category'
                        style={form ? { display: 'flex' } : { display: 'none' }} >
                        <strong>{mensageErro}</strong>
                        <h6>Categoria</h6>

                        <div className='containerMain_body_left_category_butons'>

                            {listCategory.map((category) => (

                                <div
                                    onClick={() => handleSelectFilter(category)}
                                    key={category.id} >
                                    <button
                                        style={
                                            (filterTransictions.includes(category)) ?
                                                { backgroundColor: '#7B61FF', color: '#fff' } :
                                                { backgroundColor: '#FAFAFA' }}
                                    >
                                        {category.descricao}
                                        <img
                                            value={category.id}
                                            key={category.id}
                                            src={
                                                (filterTransictions.includes(category) ? iconX : iconCross)}
                                            alt="Incone +" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className='containerMain_body_left_category_butons_filter'>
                            <button
                                onClick={handleClear} >
                                Limpar Filtros
                            </button>
                            <button
                                onClick={handleApplyFilter}
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>


                    <div className='containerMain_body_left_detail'>

                        <div className='containerMain_body_left_header'>
                            <div className='containerMain_body_left_content_date'>
                                <h6>Data
                                    <img
                                        onClick={handleFilterDate}
                                        src={`${dateFilter ? iconUp : iconDown}`}
                                        alt="Seta para cima"
                                    />
                                </h6>
                            </div>
                            <div className='flex containerMain_body_left_content_week'><h6>Dia da semana</h6></div>
                            <div className='flex containerMain_body_left_content_description'><h6>Descrição</h6></div>
                            <div className='flex containerMain_body_left_content_category'><h6>Categoria</h6></div>
                            <div className='flex containerMain_body_left_content_value'><h6>Valor</h6></div>
                            <div className='containerMain_body_left_content_img1'><img></img></div>
                            <div className='containerMain_body_left_content_img2'><img></img></div>
                        </div>

                        {detailTransaction.map((select) => (
                            <div className='containerMain_body_left_content' key={select.id} >
                                <div className='containerMain_body_left_content_date'>
                                    <h6>{currentDateFormatted(select.data)}
                                    </h6>
                                </div>
                                <div className='containerMain_body_left_content_week'>
                                    <h6>
                                        {dayWeek(select.data)}
                                    </h6>
                                </div>
                                <div className='flex containerMain_body_left_content_description'><h6>{select.descricao}</h6></div>

                                <div className='flex containerMain_body_left_content_category'>
                                    <h6>{select.categoria_nome} </h6>
                                </div>
                                <div className='flex containerMain_body_left_content_value'><h6 style={(select.tipo === 'saida') ? { color: '#FA8C10' } : { color: '#7B61FF' }}
                                >{`R$ ${((select.valor) / 100).toFixed(2).replace('.', ',')}`}</h6></div>
                                <div className='containerMain_body_left_content_img1'>
                                    <img
                                        key={select.id}
                                        onClick={() => handleEdit(select)}
                                        src={iconPen}
                                        value={select.id}
                                        alt="Incone Caneta" className='containerMain_body_left_content_pen' />
                                </div>
                                <div className='containerMain_body_left_content_img2'>
                                    <img
                                        key={select.id}
                                        onClick={() => handleTrash(select)}
                                        src={iconTrash}
                                        alt="Incone Lixeira" className='containerMain_body_left_content_trash' />

                                    {
                                        dateEdit.id == select.id &&
                                        modalCloseDelete &&
                                        <div
                                            className='modalDelete'>
                                            <img src={iconPolygon} alt="Incone Seta Lixeiro" />
                                            <h1>Apagar item?</h1>
                                            <div className='teste'>
                                                <button
                                                    onClick={() => handleDeleteTransaction(select)}
                                                    style={{ backgroundColor: '#3A9FF1' }}>Sim</button>
                                                <button
                                                    onClick={() => handleTrash(select)}
                                                    style={{ backgroundColor: '#FF576B' }}>Não</button>
                                            </div>
                                        </div>}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                <div className='containerMain_body_rigth'>
                    <LoadSummary >
                        <button
                            onClick={() => setModalClose(!modalClose)}>Adicionar Registro</button>

                    </LoadSummary>
                </div>

            </div>

        </div >

    )
}

export default Main;