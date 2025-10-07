import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import './about.scss';
import LogoHorizontalLight from '../../assets/imgLemnos/logoHorizontal.svg';
import LogoHorizontalDark from '../../assets/imgLemnos/logoHorizontalClaro.svg';
import TechFesto from '../../assets/imgLemnos/imgMascote.svg';

export default function About() {
    useEffect(() => {
        ScrollReveal().reveal('.text', {
            origin: 'left',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });

        ScrollReveal().reveal('.logoDark, .logoLight, .imgMascot', {
            origin: 'right',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });

        ScrollReveal().reveal('.item', {
            origin: 'bottom',
            distance: '100px',
            duration: 1000,
            delay: 0,
            easing: 'ease-out',
            opacity: 0,
            scale: 1,
            reset: false,
        });
    }, []);

    return (
        <main>
            <section className="contentAbout">
                <div className="title">
                    <hr />
                    <h2>Sobre</h2>
                    <hr />
                </div>

                <div className="content">
                    <p className="text">
                        Desde sua fundação em 2023, a Lemnos lidera o mercado
                        tecnológico com a sua inovação, oferecendo uma ampla
                        gama de produtos de ponta.
                    </p>
                    <img
                        className="logoDark"
                        src={LogoHorizontalLight}
                        alt="logo"
                    />
                    <img
                        className="logoLight"
                        src={LogoHorizontalDark}
                        alt="logo"
                    />
                </div>
            </section>

            <section className="contentValues">
                <div className="content">
                    <div className="item">
                        <h3>Missão</h3>
                        <p>
                            Buscamos democratizar o acesso à
                            tecnologia através de produtos inovadores a preços
                            acessíveis.
                        </p>
                    </div>
                    <div className="item">
                        <h3>Plataforma</h3>
                        <p>
                            Oferecemos uma vitrine digital
                            intuitiva com uma ampla gama de produtos
                            tecnológicos de ponta.
                        </p>
                    </div>
                    <div className="item">
                        <h3>Valores</h3>
                        <p>
                            Priorizamos a excelência e a satisfação
                            do cliente, oferecendo tecnologia e soluções
                            adaptadas às suas necessidades.
                        </p>
                    </div>
                </div>
            </section>

            <section className="contentMascot">
                <div className="title">
                    <hr />
                    <h2>TechFesto</h2>
                    <hr />
                </div>

                <div className="content">
                    <p className="text">
                        TechFesto, personifica a fusão
                        entre a mitologia antiga e a inovação contemporânea,
                        simbolizando nossa busca pela excelência e progresso
                        tecnológico.
                    </p>
                    <img
                        src={TechFesto}
                        alt="Mascote TechFesto"
                        className="imgMascot"
                    />
                </div>
            </section>
        </main>
    );
}