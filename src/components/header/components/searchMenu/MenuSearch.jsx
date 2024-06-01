import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './menuSearch.scss';
import { RiSearch2Line } from 'react-icons/ri';

export default function MenuSearch() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const baseUri = "http://localhost:8080/api";

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get(`${baseUri}/produto`, {
                    timeout: 10000,
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Erro ao listar Produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setFilteredProducts([]);
            setShowResults(false);
            return;
        }

        const filteredResults = products.filter(product =>
            product.nome.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredProducts(filteredResults);
        setShowResults(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/productFilter?search=${searchTerm}`);
    };

    const handleSearchResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchTerm('');
        setFilteredProducts([]);
        setShowResults(false);
    };

    return (
        <div className="searchContainer">
            <form onSubmit={handleSearch} className="inputSearch">
                <input
                    type="text"
                    placeholder="Search..."
                    name="search"
                    id="inputSearch"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button type="submit">
                    <RiSearch2Line className="searchIcon" />
                </button>
            </form>
            {showResults && filteredProducts.length > 0 && (
                <ul className="searchResults">
                    {filteredProducts.map(product => (
                        <Link
                            to={`/product/${product.id}`}
                            className="itemSearch"
                            key={product.id}
                            onClick={() => handleSearchResultClick(product.id)}
                        >
                            <div className="containerVisual">
                                <img src={product.imagemPrincipal} alt={product.nome} />
                                <h4>{product.nome}</h4>
                            </div>
                            <p>{BRL.format(product.valorComDesconto)}</p>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}