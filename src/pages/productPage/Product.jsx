/* eslint-disable react-hooks/exhaustive-deps */
import './product.scss';
import Loading from '../../components/loading/Loading';
import OfferList from '../../components/lists/OfferList';
import iconAddCart from '../../assets/icons/iconAddCart.svg';
import AuthService from '../../services/AuthService';
import { toast } from 'react-toastify';
import { getProdutoById } from '../../services/ProdutoService';
import { useParams, useNavigate } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import {
    adicionarFavorito,
    adicionarProdutoCarrinho,
    avaliarProduto,
    desfavoritarProduto,
    listarProdutosFavoritos,
} from '../../services/UsuarioProdutoService';
import React, { useState, useEffect } from 'react';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [productRating, setProductRating] = useState(0);

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (product) {
            setInfo();
        }
    }, [product]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getProdutoById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/Error404');
        } finally {
            setLoading(false);
        }
    };

    const setInfo = async () => {
        setLoading(true);
        try {
            setMainImage(product.imagemPrincipal);
            setProductRating(Math.ceil(product.avaliacao));
            if (
                AuthService.isLoggedIn() &&
                AuthService.isClienteRole()
            ) {
                const favorites = await listarProdutosFavoritos();
                const isFavorited = favorites.some(
                    (fav) => fav.id === product.id
                );

                if (!favorites) {
                    navigate('/login');
                }
                setIsFavorite(isFavorited);
            }
        } catch (error) {
            toast.error('Erro ao setar as informações do produto');
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleAddToCart = async () => {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarProdutoCarrinho(product, 1);
                toast.success('Produto adicionado ao carrinho!');
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos ao carrinho.'
            );
            navigate('/login');
        }
    };

    const handleAddToFavorites = async () => {
        if (AuthService.isLoggedIn()) {
            try {
                await adicionarFavorito(product);
                toast.success('Produto adicionado aos favoritos!');
                setIsFavorite(true);
            } catch (error) {
                console.error(
                    'Erro ao adicionar produto aos favoritos:',
                    error
                );
            }
        } else {
            toast.warning(
                'Você precisa estar logado para adicionar produtos aos favoritos.'
            );
            navigate('/login');
        }
    };

    const handleRemoveToFavorites = async () => {
        if (AuthService.isLoggedIn() && AuthService.isClienteRole()) {
            try {
                await desfavoritarProduto(product);
                toast.success('Produto removido dos favoritos');
                setIsFavorite(false);
            } catch (error) {
                console.error('Erro ao remover produto dos favoritos:', error);
            }
        } else {
            toast.warning(
                'Você precisa estar logado para remover produtos dos favoritos.'
            );
            navigate('/login');
        }
    };

    const handleProductRating = async (rating) => {
        if (AuthService.isLoggedIn()) {
            try {
                await avaliarProduto(product, rating);
                toast.success('Produto avaliado!');
                setProductRating(rating);
            } catch (error) {
                console.error('Erro ao avaliar o produto:', error);
                toast.error('Erro ao avaliar o produto');
            }
        } else {
            toast.warning('Você precisa estar logado para avaliar produtos.');
            navigate('/login');
        }
    };

    const hasDiscount = product && product.desconto > 0;

    return (
        <main className="productContainer">
            <hr />
            {loading ? (
                <div className="loadingProduct">
                    <Loading />
                </div>
            ) : (
                <section className="containerMain">
                    <section className="productMain">
                        <div className="containerImages">
                            <img
                                src={mainImage}
                                alt={product.nome}
                                className="imageMain"
                            />
                            {hasDiscount && (
                                <p className="offerDescont">
                                    {product.desconto}%
                                </p>
                            )}
                            <div className="optionsImages">
                                <img
                                    src={product.imagemPrincipal}
                                    alt={product.nome}
                                    onClick={() =>
                                        handleImageClick(
                                            product.imagemPrincipal
                                        )
                                    }
                                />
                                {product.imagens &&
                                    product.imagens.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`img${index}`}
                                            onClick={() =>
                                                handleImageClick(image)
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                        <div className="containerInfos">
                            <div className="sectionIcons">
                                <div className="rating">
                                    <p className="productNote">
                                        ({Math.ceil(product.avaliacao)})
                                    </p>
                                    {[1, 2, 3, 4, 5].reverse().map((index) => (
                                        <React.Fragment key={index}>
                                            <input
                                                type="radio"
                                                id={`star-${index}`}
                                                name={`star-rating-${id}`}
                                                value={index}
                                                checked={
                                                    index ===
                                                    Math.ceil(productRating)
                                                }
                                                onChange={() =>
                                                    handleProductRating(index)
                                                }
                                            />
                                            <label htmlFor={`star-${index}`}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className={
                                                        index <=
                                                        Math.ceil(productRating)
                                                            ? 'filled'
                                                            : ''
                                                    }
                                                >
                                                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                                                </svg>
                                            </label>
                                        </React.Fragment>
                                    ))}
                                </div>
                                {isFavorite ? (
                                    <MdFavorite
                                        className="iconFav"
                                        onClick={handleRemoveToFavorites}
                                    />
                                ) : (
                                    <MdFavoriteBorder
                                        className="iconFav"
                                        onClick={handleAddToFavorites}
                                    />
                                )}
                            </div>
                            <h3 className="productName">{product.nome}</h3>
                            {hasDiscount && (
                                <p className="priceOrigin">
                                    {BRL.format(product.valorTotal)}
                                </p>
                            )}
                            <p className="productPrice">
                                À vista <br />
                                <span>
                                    {BRL.format(product.valorComDesconto)}
                                </span>{' '}
                                <br />E no PIX com 15% de desconto
                            </p>
                            <p className="priceFees">
                                Ou no Cartão <br />
                                Em até 12x de{' '}
                                <span>
                                    {BRL.format(product.valorComDesconto / 12)}
                                </span>{' '}
                                sem juros
                            </p>
                            <button
                                className="addCart"
                                onClick={handleAddToCart}
                            >
                                Adicionar ao Carrinho
                                <img
                                    src={iconAddCart}
                                    alt="icon add Cart"
                                    className="iconAdd"
                                />
                            </button>
                        </div>
                    </section>
                    <section className="containerDetails">
                        <div className="containerDescription">
                            <h3>Descrição do Produto</h3>
                            <p>{product.descricao}</p>
                        </div>
                        <div className="containerSpecifications">
                            <p className="specification">
                                <strong>Nome:</strong>
                                <span>{product.nome}</span>
                            </p>
                            <p className="specification">
                                <strong>Marca:</strong>
                                <span>{product.fabricante}</span>
                            </p>
                            <p className="specification">
                                <strong>Categoria:</strong>
                                <span>{product.categoria}</span>
                            </p>
                            <p className="specification">
                                <strong>SubCategoria:</strong>
                                <span>{product.subCategoria}</span>
                            </p>
                            <p className="specification">
                                <strong>Comprimento:</strong>
                                <span>{product.comprimento}cm</span>
                            </p>
                            <p className="specification">
                                <strong>Altura:</strong>
                                <span>{product.altura}cm</span>
                            </p>
                            <p className="specification">
                                <strong>Largura:</strong>
                                <span>{product.largura}cm</span>
                            </p>
                            <p className="specification">
                                <strong>Peso:</strong>
                                <span>{product.peso}kg</span>
                            </p>
                        </div>
                    </section>
                </section>
            )}
            <section className="offers">
                <h2>Produtos Similares</h2>
                <OfferList />
            </section>
        </main>
    );
}
