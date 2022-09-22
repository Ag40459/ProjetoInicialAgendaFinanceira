import { useState } from 'react';
import iconClose from '../../assets/iconClose.png';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import './style.css';

function AddRecord({ modalClose, setModalClose, listCategory, setDetailTransaction }) {
    const token = getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [selectType, setSelectType] = useState(true);
    const [mensageErro, setMensageErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault()
        if (!description || !value || !date || category == 'Selecionar' || category == false) {
            return setMensageErro("Preencha todos os campos!");
        }
        try {

            const newTransaction = {
                descricao: description,
                valor: (value * 100),
                data: date,
                categoria_id: category,
                tipo: selectType ? 'entrada' : 'saida'
            }
            await api.post('/transacao', newTransaction, {
                headers
            });
            const response = await api.get('/transacao', {
                headers
            })
            setMensageErro("Cadastro efetuado com sucesso!");
            setTimeout(() => {
                setModalClose(!modalClose)
            }, 1000);
            return setDetailTransaction(response.data);
        } catch (e) {
            return setMensageErro(e.request.response.data);
        }
    }

    function handleCategory(event) {
        setCategory(event.target.value)
    }

    return (
        <div className='modal_addRecord' >

            <div className='card_modal_addRecord'>
                <div className='card_modal_addRecord_title'>
                    <h1>Adicionar Registro </h1>
                    <img
                        onClick={() => setModalClose(!modalClose)} src={iconClose} alt="Incone fechar" />
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
                <form onSubmit={handleSubmit}>

                    <label htmlFor="valor">Valor</label>
                    <input
                        type='number'
                        placeholder='Valor'
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        id='valor' />

                    <label htmlFor="categoria">Categoria</label>

                    <div>
                        <select
                            onChange={handleCategory} >
                            <option >Selecionar</option>
                            {listCategory.map((selectCategory) => {
                                return (
                                    <option
                                        key={selectCategory.id}
                                        value={selectCategory.id}>{selectCategory.descricao}</option>
                                )
                            })}
                        </select>
                    </div>

                    <label htmlFor="data">Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        id='data' />

                    <label htmlFor="descricao">Descrição</label>

                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        id='descricao' />
                    <strong>{mensageErro}</strong>
                    <button type='submit' onChange={(event) => handleAddCategory(event)} >Confirmar</button>
                </form>
            </div>
        </div>

    )
}

export default AddRecord;