import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/pagination'; 
import { Pagination } from 'swiper/modules';

const HorizontalSwiper = ({ data }) => {
    return (
        <div style={{ width: '100%' }}>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                style={{
                    width: '100%',
                    padding: '20px',
                    boxSizing: 'border-box'
                }}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px',
                                height: '100%',
                                borderRadius: '8px',
                                background: '#f0f0f0',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <h2>{item.nom} {item.prenom}</h2>
                            <p>Genre : {item.sexe}</p>
                            <p>Email : {item.mail}</p>
                            <p>Téléphone : {item.phone}</p>
                            <p>Pays : {item.pays}</p>
                            <p>Ville : {item.ville}</p>
                            <p>Date d'inscription : {item.date_inscription}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HorizontalSwiper;
