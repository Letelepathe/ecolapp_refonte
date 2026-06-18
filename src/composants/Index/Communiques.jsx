import React from 'react';
import { Helmet } from 'react-helmet';

import Header2 from './Header2';
import Footer from './Footer';

import ImageEcole1 from '../../static/static1/img/college7.jpeg';


const Communiques = () => {
  return (
    <div>
      <Helmet>
        <title>Ecole-App | Communiqués</title>
        <meta name="description" content="Bienvenue sur notre plateforme de gestion scolaire." />
        <link rel="icon" href='https://rudless.com/img/logorudless.jpeg'/>
      </Helmet>
      <Header2 />
      <main id='main'>
        <section id="recent-blog-posts" className="recent-blog-posts" style={{marginTop:'120px'}}>
          <div className="container">
            <header className="section-header">
              <h2>Forum</h2>
              <p>Récents communiqués</p>
            </header>
            <div className="row">
              <div className="col-lg-4">
                <div className="post-box">
                  <div className="post-img">
                    <img src={ImageEcole1} class="img-fluid" alt=""/>
                  </div>
                  <span className="post-date">Jeudi, Septembre 15</span>
                  <h3 className="post-title">Aimer son prochain comme soi-même</h3>
                  <a href="" className="readmore stretched-link mt-auto"><span>Lire plus</span><i class="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="post-box">
                  <div className="post-img">
                    <img src={ImageEcole1} class="img-fluid" alt=""/>
                  </div>
                  <span className="post-date">Jeudi, Septembre 15</span>
                  <h3 className="post-title">Aimer son prochain comme soi-même</h3>
                  <a href="" className="readmore stretched-link mt-auto"><span>Lire plus</span><i class="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="post-box">
                  <div className="post-img">
                    <img src={ImageEcole1} class="img-fluid" alt=""/>
                  </div>
                  <span className="post-date">Jeudi, Septembre 15</span>
                  <h3 className="post-title">Aimer son prochain comme soi-même</h3>
                  <a href="" className="readmore stretched-link mt-auto"><span>Lire plus</span><i class="bi bi-arrow-right"></i></a>
                </div>
              </div>

            </div>

          </div>
        </section>
      </main>
      <Footer />
 </div>
  );
};

export default Communiques;
