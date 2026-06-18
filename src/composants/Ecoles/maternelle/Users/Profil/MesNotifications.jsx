import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";


const MesNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost/ecole-app/apis/getNotifications.php', {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setNotifications(response.data.notifications);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Erreur lors de la récupération des notifications.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            const response = await axios.post(
                'http://localhost/ecole-app/apis/markNotificationsAsRead.php',
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                setNotifications((prev) =>
                    prev.map((notification) => ({ ...notification, lu: 1 }))
                );
            } else {
                console.error('Erreur:', response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error.message);
        }
    };

    if (loading) {
        return <div>Chargement des notifications...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div>
            <Helmet>
                <title>Mes notifications</title>
                <link rel="icon" href="https://rudless.com/img/logorudless.jpeg" />
            </Helmet>
            <div className="container-fluid position-relative bg-white d-flex p-0">
                <SidebarLeft />
                <div className="content">
                    <NavbarTop />
                    <div className="container my-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Notifications</h4>
                            <button className="btn btn-primary" onClick={markAllAsRead}>
                                Tout marquer comme lu
                            </button>
                        </div>
                        <ul className="list-group">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={`list-group-item d-flex justify-content-between align-items-start ${
                                        notification.lu === 0 ? 'bg-light' : ''
                                    }`}
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{notification.sujet}</div>
                                        <p>{notification.msg}</p>
                                        <small className="text-muted">{new Date(notification.date_envoi).toLocaleString()}</small>
                                    </div>
                                    {notification.lu === 0 && (
                                        <span className="badge bg-warning rounded-pill">Non lu</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesNotifications;
