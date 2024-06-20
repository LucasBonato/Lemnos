/* eslint-disable react/prop-types */
import './card.scss';
import './cardOffer.scss';
import { Link, useNavigate } from 'react-router-dom';
import iconAddCart from '../../assets/icons/iconAddCart.svg';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import {
    adicionarFavorito,
    adicionarProdutoCarrinho,
    desfavoritarProduto,
    listarProdutosFavoritos,
} from '../../services/UsuarioProdutoService';

export default function Card({ produto }) {
    const navigate = useNavigate();
    const BRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const setInfo = async () => {
            if (
                AuthService.isLoggedIn() &&
                AuthService.getRole() == 'CLIENTE'
            ) {
                try {
                    const favorites = await listarProdutosFavoritos();
                    const isFavorited = favorites.some(
                        (fav) => fav.id === produto.id
                    );
                    setIsFavorite(isFavorited);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        setInfo();
    }, [produto.id]);

    async function handleAddToCart() {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarProdutoCarrinho(produto, 1);
                toast.success('Produto adicionado ao carrinho!');
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
                toast.error('Erro ao adicionar produto ao carrinho.');
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/login');
        }
    }

    const handleAddToFavorites = async (produto, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (AuthService.isLoggedIn() && AuthService.getRole() == 'CLIENTE') {
            try {
                await adicionarFavorito(produto);
                setIsFavorite(true);
                toast.success('Produto adicionado aos favoritos!');
            } catch (error) {
                console.log('Erro ao adicionar produto aos favoritos.');
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/login');
        }
    };

    const handleRemoveFavorite = async (produto, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (AuthService.isLoggedIn() && AuthService.getRole() == 'CLIENTE') {
            try {
                const success = await desfavoritarProduto(produto);
                if (success) {
                    setIsFavorite(false);
                    toast.success('Produto removido dos favoritos!');
                }
            } catch (error) {
                toast.error('Erro ao remover produto dos favoritos.');
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/login');
        }
    };

    const hasDiscount = produto.desconto > 0;

    return (
        <>
            <div className="descont">
                <div className={hasDiscount ? 'offerCard' : 'productCard'}>
                    <Link
                        to={`/product/${produto.id}`}
                        className={hasDiscount ? 'offerLink' : 'productLink'}
                    >
                        {hasDiscount && (
                            <p className="offerDescont">{produto.desconto}%</p>
                        )}
                        {isFavorite ? (
                            <MdFavorite
                                className="iconFav"
                                onClick={(e) =>
                                    handleRemoveFavorite(produto, e)
                                }
                            />
                        ) : (
                            <MdFavoriteBorder
                                className="iconFav"
                                onClick={(e) =>
                                    handleAddToFavorites(produto, e)
                                }
                            />
                        )}
                        <img
                            src={produto.imagemPrincipal}
                            alt={produto.nome}
                            className={
                                hasDiscount ? 'offerImage' : 'productImage'
                            }
                        />
                        <div
                            className={
                                hasDiscount ? 'offerDetails' : 'productDetails'
                            }
                        >
                            <h2
                                className={
                                    hasDiscount ? 'offerName' : 'productName'
                                }
                            >
                                {produto.nome}
                            </h2>
                            {hasDiscount ? (
                                <>
                                    <p className="offerPrice">
                                        {BRL.format(produto.valorTotal)}
                                    </p>
                                    <p className="offerPriceDescont">
                                        À vista <br />
                                        <span>
                                            {BRL.format(
                                                produto.valorComDesconto
                                            )}
                                        </span>{' '}
                                        <br />
                                        no PIX com 15% de desconto
                                    </p>
                                </>
                            ) : (
                                <p className="productPrice">
                                    À vista <br />
                                    <span>
                                        {BRL.format(produto.valorTotal)}
                                    </span>{' '}
                                    <br />
                                    no PIX com 15% de desconto
                                </p>
                            )}
                        </div>
                    </Link>
                    <button
                        type="button"
                        className="btnAdd"
                        onClick={handleAddToCart}
                    >
                        Adicionar ao Carrinho
                        <img
                            src={iconAddCart}
                            alt="icone adicionar carrinho"
                            className="iconAdd"
                        />
                    </button>
                </div>
            </div>
        </>
    );
}
