import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import './style.css';

function LoadSummary({ children }) {
    const token = getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [summary, setSummary] = useState([]);
    const total = (summary.totalEntrada - summary.totalSaida);
    const [mensageErro, setMensageErro] = useState('');

    async function loadSummary() {
        try {
            const response = await api.get("/transaca/extrato", {
                headers
            })
            setSummary(response.data);

        } catch (e) {
            setMensageErro('Falha na Conexão!')
            setTimeout(() => {
                setMensageErro()
            }, 5000);
        }
    }

    useEffect(() => {
        loadSummary()
        setMensageErro()

    }, [summary])

    return (
        <>
            <div className='containerMain_body_rigth_summary'>
                <h2>Resumo  </h2>
                <h5>Entradas
                    <span style={{ color: '#7B61FF' }}>
                        R$ {((summary.totalEntrada) / 100).toFixed(2).replace('.', ',') == 'NaN' ? '0,00' : ((summary.totalEntrada) / 100).toFixed(2).replace('.', ',')}

                    </span></h5>
                <h5>Saídas
                    <span style={{ color: '#FA8C10' }}>
                        R$ {((summary.totalSaida) / 100).toFixed(2).replace('.', ',') == 'NaN' ? '0,00' : ((summary.totalSaida) / 100).toFixed(2).replace('.', ',')}
                    </span> </h5>
                <div className='line'>
                    <strong>{mensageErro}</strong>

                </div>

                <h5>Saldo <span style={total < 0 ? { color: '#FA8C10' } : { color: '#7B61FF' }}>
                    R$ {(((summary.totalEntrada) / 100) - ((summary.totalSaida) / 100)).toFixed(2).replace('.', ',') == 'NaN' ? '0,00' : (((summary.totalEntrada) / 100) - ((summary.totalSaida) / 100)).toFixed(2).replace('.', ',')}
                </span></h5>
            </div>

            {children}
        </>
    )
}

export default LoadSummary;