import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const HorizontalSwiper = ({ data }) => {
  return (
    <div className="u-style-69d66e5b">
            <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        modules={[Pagination]} className="u-style-3ac47859">





        
                {data.map((item, index) =>
        <SwiperSlide key={index}>
                        <div className="u-style-4db4a04b">











            
                            <h2>{item.nom} {item.prenom}</h2>
                            <p>Genre : {item.sexe}</p>
                            <p>Email : {item.mail}</p>
                            <p>Téléphone : {item.phone}</p>
                            <p>Pays : {item.pays}</p>
                            <p>Ville : {item.ville}</p>
                            <p>Date d'inscription : {item.date_inscription}</p>
                        </div>
                    </SwiperSlide>
        )}
            </Swiper>
        </div>);

};

export default HorizontalSwiper;
