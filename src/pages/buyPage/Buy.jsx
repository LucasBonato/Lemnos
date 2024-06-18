/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { RiShoppingCartLine } from 'react-icons/ri';
import { BsTruck } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa6';
import { PiFileMagnifyingGlass } from 'react-icons/pi';
import { IoCart } from 'react-icons/io5';
import ModalCompleted from './components/ModalCompleted';
import './buy.scss';
import AuthService from '../../services/authService';
import { listarCarrinho } from '../../services/apiProductService';
import { getCliente, getProdutoById } from '../../services/ApiService';

const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function BuyPage() {
    const [isModalCompleted, setIsModalCompleted] = useState(false);
    const [pedido, setPedido] = useState(null);
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState({});
    const [clienteEndereco, setClienteEndereco] = useState({});
    const [valorCompra, setValorCompra] = useState(0);
    const [desconto, setDesconto] = useState(0);

    async function fetchPedido() {
        try {
            if (AuthService.isLoggedIn()) {
                const pedidoResponse = await listarCarrinho();
                const clienteResponse = await getCliente();

                setValorCompra(pedidoResponse.valorTotal);
                setPedido(pedidoResponse);
                setCliente(clienteResponse || {});
                setClienteEndereco(clienteResponse.endereco || {});

                if (
                    pedidoResponse &&
                    Array.isArray(pedidoResponse.itens) &&
                    pedidoResponse.itens.length > 0
                ) {
                    const carrinhoDetalhado = await Promise.all(
                        pedidoResponse.itens.map(async (item) => {
                            const detalhesProduto = await getProdutoById(
                                item.id
                            );
                            return { ...item, ...detalhesProduto };
                        })
                    );
                    setCarrinho(
                        Array.isArray(carrinhoDetalhado)
                            ? carrinhoDetalhado
                            : []
                    );
                } else {
                    setCarrinho([]);
                }
            }
        } catch (error) {
            console.error('Erro ao obter itens do pedido:', error);
        }
    }

    useEffect(() => {
        fetchPedido();
    }, []);

    const handleOpenModal = () => {
        setIsModalCompleted(!isModalCompleted);
    };

    return (
        <>
            <main>
                <div className="statusOrder">
                    <div className="status">
                        <IoCart className="iconStatus" />
                        <p>Carrinho</p>
                    </div>
                    <span></span>
                    <div className="status">
                        <FaCreditCard className="iconStatus" />
                        <p>Pagamento</p>
                    </div>
                    <span></span>
                    <div className="status">
                        <FaCheckCircle className="iconStatus" />
                        <p>Confirmação</p>
                    </div>
                </div>
                <div className="loadingDelivery"></div>
                <section className="sectionOrder">
                    <div className="divOrder">
                        <div className="personalData">
                            <div className="titleContainers">
                                <MdInfoOutline className="iconOrder" />
                                <h3>Dados do Cliente</h3>
                            </div>
                            <hr className="hrTitle" />
                            <div className="dataContainer">
                                <div>
                                    <h4 className="titleData">
                                        Dados Pessoais
                                    </h4>
                                    <div className="dataPerson">
                                        <p>Nome: {cliente.nome || ''}</p>
                                        <p>CPF: {cliente.cpf || ''}</p>
                                        <p>Email: {cliente.email || ''}</p>
                                    </div>
                                </div>
                                <hr className="hrData" />
                                <div>
                                    <h4 className="titleData">Endereço</h4>
                                    <div className="dataEnd">
                                        <p>CEP: {clienteEndereco.cep || ''}</p>
                                        <p>
                                            Logradouro:{' '}
                                            {clienteEndereco.logradouro || ''}
                                        </p>
                                        <p>
                                            Estado:{' '}
                                            {clienteEndereco.estado || ''}
                                        </p>
                                        <p>
                                            Bairro:{' '}
                                            {clienteEndereco.bairro || ''}
                                        </p>
                                        <p>
                                            Cidade:{' '}
                                            {clienteEndereco.cidade || ''}
                                        </p>
                                        <p>
                                            Número:{' '}
                                            {clienteEndereco.numero || ''}
                                        </p>
                                        <p>
                                            Complemento:{' '}
                                            {clienteEndereco.complemento || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shippingCart">
                            <div className="cart">
                                <div className="titleContainers">
                                    <RiShoppingCartLine className="iconOrder" />
                                    <h3>Carrinho</h3>
                                </div>
                                <hr className="hrTitle" />
                                <ul>
                                    {carrinho.map((item, index) => (
                                        <li key={index}>
                                            <div className="dataProduct">
                                                <img
                                                    src={item.imagem}
                                                    alt={item.nome}
                                                />
                                                <p>{item.nome}</p>
                                            </div>
                                            <p>{item.quantidade}</p>
                                            <p>{BRL.format(item.preco)}</p>
                                        </li>
                                    ))}
                                    <hr />
                                </ul>
                            </div>
                            <div className="delivery">
                                <hr className="hrTitle" />
                                <div className="titleContainers">
                                    <BsTruck className="iconOrder" />
                                    <h3>Frete</h3>
                                </div>
                                <hr className="hrTitle" />
                                <div className="dataDelivery">
                                    <p>
                                        Sedex:{' '}
                                        <span>Chegará até 23/06/2024</span>
                                        <p className="term">
                                            Prazo de entrega: em até 7 dias.
                                        </p>
                                    </p>
                                    <p>{BRL.format(26)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="orderSummary">
                        <div className="titleContainers">
                            <PiFileMagnifyingGlass className="iconOrder" />
                            <h3>Resumo</h3>
                        </div>
                        <hr className="hrTitle" />
                        <div className="dataResume">
                            <div className="lineOrder">
                                <p>Valor do Produto:</p>
                                <p>{BRL.format(valorCompra)}</p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Desconto:</p>
                                <p className="discount">
                                    -{BRL.format(desconto)}
                                </p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Frete:</p>
                                <p>{BRL.format(26)}</p>
                            </div>
                            <hr className="hrResume" />
                            <div className="lineOrder">
                                <p>Forma de Pagamento:</p>
                                <p>Boleto</p>
                            </div>
                            <hr className="hrResume" />
                            <h2>{BRL.format(valorCompra - desconto + 26)}</h2>
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="confirmOrder"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            {isModalCompleted && <ModalCompleted onClose={handleOpenModal} />}
        </>
    );
}
