/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import imgBanner1 from '../../../../assets/banners/banner1.svg';
import imgBanner2 from '../../../../assets/banners/banner2.svg';
import imgBanner3 from '../../../../assets/banners/banner3.svg';
import imgBanner4 from '../../../../assets/banners/banner4.svg';
import imgBanner5 from '../../../../assets/banners/banner5.svg';
import imgBannerMob1 from '../../../../assets/banners/bannerMob1.svg';
import imgBannerMob2 from '../../../../assets/banners/bannerMob2.svg';
import imgBannerMob3 from '../../../../assets/banners/bannerMob3.svg';
import imgBannerMob4 from '../../../../assets/banners/bannerMob4.svg';
import imgBannerMob5 from '../../../../assets/banners/bannerMob5.svg';
import './carousel.scss';
import { Link } from 'react-router-dom';

const ImageWithLoadingEffect = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, []);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            style={{
                width: '100%',
                height: 'auto',
                filter: isLoaded ? 'none' : 'blur(10px)',
                transition: 'filter 1s ease-out',
            }}
            onLoad={() => setIsLoaded(true)}
        />
    );
};

export default function Slide() {
    const [isHovered, setIsHovered] = useState(false);
    const splideRef = useRef(null);
    const [autoplayPaused, setAutoplayPaused] = useState(false);
    const [splideOptions, setSplideOptions] = useState({
        type: 'loop',
        perPage: 1,
        pauseOnHover: false,
        speed: 1000,
        rewind: true,
        gap: 1,
    });

    const nextSlide = () => {
        const splide = splideRef.current.splide;
        splide.go('+1');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!autoplayPaused) {
                nextSlide();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [autoplayPaused]);

    return (
        <section className="carousel">
            <Splide
                options={splideOptions}
                ref={splideRef}
                onMouseEnter={() => {
                    setIsHovered(true);
                    setAutoplayPaused(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setTimeout(() => setAutoplayPaused(false), 100);
                }}
            >
                <SplideSlide>
                    <ImageWithLoadingEffect
                        src={imgBanner1}
                        alt="Slide 1"
                        className="slide"
                    />
                    <ImageWithLoadingEffect
                        src={imgBannerMob1}
                        alt="Slide 1"
                        className="slideMob"
                    />
                </SplideSlide>
                <SplideSlide>
                    <Link to={'/product/7736f553-4a12-4266-b0b3-1e71fb9483e2'}>
                        <ImageWithLoadingEffect
                            src={imgBanner2}
                            alt="Slide 2"
                            className="slide"
                        />
                        <ImageWithLoadingEffect
                            src={imgBannerMob2}
                            alt="Slide 2"
                            className="slideMob"
                        />
                    </Link>
                </SplideSlide>
                <SplideSlide>
                    <Link to={'/product/3cdae211-9711-4246-90dd-43773f22cec6'}>
                        <ImageWithLoadingEffect
                            src={imgBanner3}
                            alt="Slide 3"
                            className="slide"
                        />
                        <ImageWithLoadingEffect
                            src={imgBannerMob3}
                            alt="Slide 3"
                            className="slideMob"
                        />
                    </Link>
                </SplideSlide>
                <SplideSlide>
                    <Link to={'/product/8ce57ef2-40bf-4b86-81b0-e0056c2f7e47'}>
                        <ImageWithLoadingEffect
                            src={imgBanner4}
                            alt="Slide 4"
                            className="slide"
                        />
                        <ImageWithLoadingEffect
                            src={imgBannerMob4}
                            alt="Slide 4"
                            className="slideMob"
                        />
                    </Link>
                </SplideSlide>
                <SplideSlide>
                    <Link to={'/product/63325fae-cf36-4bdf-9844-a51b3696919b'}>
                        <ImageWithLoadingEffect
                            src={imgBanner5}
                            alt="Slide 5"
                            className="slide"
                        />
                        <ImageWithLoadingEffect
                            src={imgBannerMob5}
                            alt="Slide 5"
                            className="slideMob"
                        />
                    </Link>
                </SplideSlide>
            </Splide>
        </section>
    );
}