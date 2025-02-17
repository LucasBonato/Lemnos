/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { IoList } from 'react-icons/io5';
import { HiSquares2X2 } from 'react-icons/hi2';
import { listarProdutosFiltrados } from '../../services/ProdutoService';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DoubleInputRange from '../../components/inputs/doubleInput/DoubleInput';
import Loading from '../../components/loading/Loading';
import AuthService from '../../services/AuthService';
import Card from '../../components/card/Card';
import './productFilter.scss';

const BRANDS = [
    'Acer', 'AMD', 'Apple', 'Asus', 'Dell', 'Gigabyte', 'Logitech', 'Intel',
    'JBL', 'Lenovo', 'LG', 'Microsoft', 'NVIDIA', 'Philips', 'Positivo',
    'Samsung', 'Sony', 'Xiaomi',
];

const CATEGORIES = [
    'Casa Inteligente', 'Computadores', 'Eletrônicos', 'Hardware', 'Kits', 'Monitores',
    'Notebooks e Portáteis', 'Periféricos', 'Realidade Virtual', 'Redes e wireless', 'Video Games',
];

const SUBCATEGORIES = {
    'Casa Inteligente': ['Assistente Virtual', 'Controles Smarts', 'Lâmpadas Inteligentes', 'Sensores'],
    'Computadores': ['Computadores Gamers', 'Computadores Workstation'],
    'Eletrônicos': ['Acessórios de Console', 'Carregadores', 'Refrigeração', 'Smart Box'],
    'Hardware': ['Armazenamento', 'Coolers', 'Fonte', 'Memória RAM', 'Placa de Vídeo', 'Placa Mãe', 'Processadores'],
    'Kits': ['Gamer', 'Periféricos', 'Upgrade'],
    'Monitores': ['Monitores Gamers', 'Monitores Workstation'],
    'Notebooks e Portáteis': ['Notebooks', 'Smartphones', 'Tablets'],
    'Periféricos': ['Caixa de Som', 'Fone de Ouvido', 'Microfone', 'Mouse', 'Mousepad', 'Teclado'],
    'Realidade Virtual': ['Óculos de VR', 'Periféricos de VR'],
    'Redes e wireless': ['Access Point', 'Adaptadores', 'Cabos', 'Cabos de Redes', 'Roteadores', 'Switches'],
    'Video Games': ['Console de Mesa', 'Portátil'],
};

export default function ProductFilter() {
    const navigate = useNavigate();
    const { category } = useParams();
    const [filteredData, setFilteredData] = useState([]);
    const [cardList, setCardList] = useState(AuthService.getCard() === 'true');
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';
    const endOfPageRef = useRef();
    const observer = useRef();

    const [filters, setFilters] = useState({
        brand: localStorage.getItem('selectedBrand') || '',
        evaluation: localStorage.getItem('selectedEvaluation') || '',
        category: localStorage.getItem('category') || category || '',
        subCategory: localStorage.getItem('selectedSubCategory') || '',
        minPrice: parseInt(localStorage.getItem('minPrice')) || 0,
        maxPrice: parseInt(localStorage.getItem('maxPrice')) || 50000,
        searchTerm: localStorage.getItem('searchTerm') || search || '',
    });

    const [calculatedMaxPrice, setCalculatedMaxPrice] = useState(filters.maxPrice);

    const saveFiltersToLocalStorage = () => {
        localStorage.setItem('selectedBrand', filters.brand);
        localStorage.setItem('selectedEvaluation', filters.evaluation);
        localStorage.setItem('category', filters.category);
        localStorage.setItem('selectedSubCategory', filters.subCategory);
        localStorage.setItem('minPrice', filters.minPrice.toString());
        localStorage.setItem('maxPrice', filters.maxPrice.toString());
        localStorage.setItem('searchTerm', filters.searchTerm);
    };

    const calculateMaxPrice = async () => {
        try {
            const filtro = {
                nome: filters.searchTerm ?? null,
                categoria: filters.category ?? null,
                subCategoria: filters.subCategory ?? null,
                marca: filters.selectedBrand ?? null,
                menorPreco: null,
                maiorPreco: null,
                avaliacao: filters.selectedEvaluation
                    ? parseInt(filters.selectedEvaluation, 10)
                    : null,
            };
    
            const produtosFiltrados = await listarProdutosFiltrados(filtro, 0, 1000);
            
            const novoMaxPrice = produtosFiltrados.reduce((max, produto) => 
                produto.valorComDesconto > max ? produto.valorComDesconto : max
            , 0);
    
            setCalculatedMaxPrice(novoMaxPrice);
    
            setFilters(prev => ({
                ...prev,
                maxPrice: novoMaxPrice
            }));
        } catch (error) {
            console.error('Erro ao calcular o maior preço:', error);
        }
    };
    
    const applyFilters = async (pageToLoad = 0) => {
        setLoading(true);
        saveFiltersToLocalStorage();
        try {
            const filtro = {
                nome: filters.searchTerm ?? null,
                categoria: filters.category ?? null,
                subCategoria: filters.subCategory ?? null,
                marca: filters.selectedBrand ?? null,
                menorPreco: filters.minPrice ?? 0,
                maiorPreco: filters.maxPrice ?? 50000,
                avaliacao: filters.evaluation
                    ? parseInt(filters.evaluation, 10)
                    : null,
            };

            const produtosFiltrados = await listarProdutosFiltrados(
                filtro,
                pageToLoad,
                24
            );

            if (pageToLoad === 0) {
                setFilteredData(produtosFiltrados);
            } else {
                setFilteredData((prevData) => [
                    ...prevData,
                    ...produtosFiltrados,
                ]);
            }
            setHasMore(produtosFiltrados.length === 24);
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateMaxPrice();
    }, [
        filters.selectedBrand,
        filters.category,
        filters.selectedSubCategory,
        filters.searchTerm,
        filters.selectedEvaluation,
    ]);

    useEffect(() => {
        applyFilters(0);
    }, [
        filters.selectedBrand,
        filters.category,
        filters.selectedSubCategory,
        filters.minPrice,
        filters.maxPrice,
        filters.searchTerm,
        filters.selectedEvaluation,
    ]);

    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                setPage((prev) => prev + 1);
            }
        };

        if (endOfPageRef.current) {
            observer.current = new IntersectionObserver(handleObserver);
            observer.current.observe(endOfPageRef.current);
        }

        return () => {
            if (observer.current && endOfPageRef.current) {
                observer.current.unobserve(endOfPageRef.current);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (page > 0) {
            applyFilters(page);
        }
    }, [page]);

    const handleClearFilters = () => {
        setFilters(prev => ({
            ...prev,
            selectedBrand: '',
            selectedSubCategory: '',
            setMinPrice: 0,
            setMaxPrice: 50000,
            selectedEvaluation: '',
            searchTerm: '',
            category: ''
        }));
        setPage(0);
        setHasMore(true);
        localStorage.clear();
        navigate(`/productFilter`);
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setFilters(prev => ({...prev, category: newCategory}));

        setPage(0);
    
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get('search') || '';
    
        setTimeout(() => {
            navigate(
                `/productFilter/${newCategory}${searchTerm ? `?search=${searchTerm}` : ''}`
            );
        }, 0);
    };

    const handleProductRating = (rating) => {
        if (rating === filters.selectedEvaluation) {
            setFilters(prev => ({...prev, selectedEvaluation: ''}));
        } else {
            setFilters(prev => ({...prev, selectedEvaluation: rating}));
        }
        setPage(0);
    };

    const handleAlterCardsList = () => {
        setCardList(true);
        AuthService.setCard('true');
        applyFilters();
    };

    const handleAlterCardsSquare = () => {
        setCardList(false);
        AuthService.setCard('false');
        applyFilters();
    };

    return (
        <section className="mainFilters">
            <section className="product-filter-container">
                <div className="containerAlterFilter">
                    <p className="containerChecked">
                        <input
                            type="radio"
                            id="listView"
                            name="view"
                            checked={cardList}
                            onChange={handleAlterCardsList}
                        />
                        <label htmlFor="listView" className="labelIcon">
                            <IoList className="iconAlter" />
                        </label>
                    </p>

                    <p className="containerChecked">
                        <input
                            type="radio"
                            id="gridView"
                            name="view"
                            checked={!cardList}
                            onChange={handleAlterCardsSquare}
                        />
                        <label htmlFor="gridView" className="labelIcon">
                            <HiSquares2X2 className="iconAlter" />
                        </label>
                    </p>
                </div>

                <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Todas as Categorias</option>
                    {CATEGORIES.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>

                <select value={filters.selectedSubCategory} onChange={(e) => setFilters(prev => ({...prev, selectedSubCategory: e.target.value}))}>
                    <option value="">Todas as SubCategorias</option>
                    {SUBCATEGORIES[filters.category]?.map((subcategoria) => (
                        <option key={subcategoria} value={subcategoria}>
                            {subcategoria}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.selectedBrand}
                    onChange={(e) => setFilters(prev => ({...prev, selectedBrand: e.target.value}))}
                >
                    <option value="">Todas as Marcas</option>
                    {BRANDS.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>

                <DoubleInputRange
                    key={filters.maxPrice}
                    minValue={filters.minPrice}
                    maxValue={filters.maxPrice}
                    setMinValue={(minPrice) => setFilters(prev => ({ ...prev, minPrice }))}
                    setMaxValue={(maxPrice) => setFilters(prev => ({ ...prev, maxPrice }))}
                    maxPrice={calculatedMaxPrice}
                />

                <div className="ratingFilter">
                    {[5, 4, 3, 2, 1].map((index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`star-${index}`}
                                name="star-rating"
                                value={index}
                                checked={index === filters.selectedEvaluation}
                                onChange={() => handleProductRating(index)}
                            />
                            <label htmlFor={`star-${index}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={
                                        index <= filters.selectedEvaluation
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
            </section>

            <section className="filtered-data-container">
                <hr className="hrFilter" />

                {loading && page === 0 ? (
                    <Loading />
                ) : (
                    <>
                        {filteredData.length === 0 && (
                            <div className="emptyFilterMessage">
                                <h2 className="textEmpty">
                                    Parece que não há resultados para os filtros
                                    escolhidos. Por favor, revise suas opções e
                                    tente novamente.
                                </h2>
                                <button
                                    type="button"
                                    className="btnBackFilter"
                                    onClick={handleClearFilters}
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}

                        {filteredData.length > 0 && (
                            <>
                                <div
                                    className={`productsList ${cardList ? 'cardList' : ''}`}
                                >
                                    {filteredData.map((produto) => (
                                        <Card
                                            key={produto.id}
                                            produto={produto}
                                        />
                                    ))}
                                </div>
                                {loading && (
                                    <div className="loadingProducts">
                                        <Loading />
                                    </div>
                                )}
                                <div
                                    ref={endOfPageRef}
                                    className="end-of-page"
                                ></div>
                            </>
                        )}
                    </>
                )}
            </section>
        </section>
    );
}