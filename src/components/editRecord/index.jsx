import { useEffect, useState } from 'react';
import iconClose from '../../assets/iconClose.png';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import '../addRecord/style.css';
import { dayWeek } from '../../utils/date';

function EditRecord({ listCategory, modalCloseEdit, setModalCloseEdit, dateEdit, detailTransaction, setDetailTransaction }) {
    const token = getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [selectType, setSelectType] = useState();
    const [mensageErro, setMensageErro] = useState('');

    async function handleSubmitUpdate(e) {
        e.preventDefault();
        if (!description || !value || !date || category == 'Selecionar' || category == false) {
            return setMensageErro('Preencha todos os campos');
        }
        try {
            const newTransaction = {
                descricao: description,
                valor: (value * 100),
                data: date,
                categoria_id: category,
                tipo: selectType ? 'entrada' : 'saida'
            }
            await api.put(`/transacao/${dateEdit.id} `, newTransaction, {
                headers
            });
            const response = await api.get('/transacao', {
                headers
            })
            setMensageErro('Atualização efetuada com sucesso!')
            setTimeout(() => {
                setModalCloseEdit(!modalCloseEdit)
            }, 1000);
            return setDetailTransaction(response.data);

        } catch (e) {
            setMensageErro(e.message);
            return setTimeout(() => {
                setMensageErro();
            }, 2000);
        }
    }

    async function loadTodos() {
        if (dateEdit.tipo === 'saida') {
            setSelectType(false)
        } else {
            setSelectType(true)
        }
        setDescription(dateEdit.descricao);
        setValue(((dateEdit.valor) / 100).toFixed(2));
        setCategory(dateEdit.categoria_id);
        const testeData = new Date(dateEdit.data);
        setDate(testeData.toLocaleDateString());
    }

    useEffect(() => {
        dayWeek
        loadTodos()
    }, []);

    function handleCategory(event) {
        setCategory(event.target.value)
    }

    return (
        <div className='modal_addRecord' >

            <div className='card_modal_addRecord'>
                <div className='card_modal_addRecord_title'>

                    <h1>Editar Registro </h1>
                    <img onClick={() => setModalCloseEdit(!modalCloseEdit)} src={iconClose} alt="Incone fechar" />
                </div>
                <div className='select_type'>
                    <button
                        onClick={() => setSelectType(true)}
                        className='select_type_prohibited'
                        style={selectType ? { backgroundColor: '#3A9FF1' } : { backgroundColor: '#B9B9B9' }}
                    >Entrada
                    </button>
                    <button
                        onClick={() => setSelectType(false)}
                        className='select_type_exit'
                        style={selectType ? { backgroundColor: '#B9B9B9' } : { backgroundColor: '#FF576B' }}
                    >Saida
                    </button>
                </div>
                <form >

                    <label htmlFor="valor">Valor</label>
                    <input
                        type='number'
                        placeholder='Valor'
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        id='valor' />

                    <label htmlFor="categoria">Categoria</label>
                    <div>
                        <select id="categoria" >
                            <option >{dateEdit.categoria_nome}
                            </option>
                            {listCategory.map((selectCategory) => {
                                return (
                                    <option
                                        key={selectCategory.id}
                                        value={selectCategory.id}
                                        name={selectCategory.descricao}
                                    >
                                        {selectCategory.descricao}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <label htmlFor="data">Data</label>
                    <input
                        type="text"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        id='data' />

                    <label htmlFor="descricao">Descrição</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        id='descricao' />
                    <strong >{mensageErro}</strong>
                    <button onClick={handleSubmitUpdate} type='submit'  >Confirmar</button>
                </form>
            </div>
        </div >

    )
}

export default EditRecord;