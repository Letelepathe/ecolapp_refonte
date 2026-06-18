import React from "react";
// import { Link } from "react-router-dom";
const FooterUser = () => {
    const currentYear = new Date().getFullYear(); 
    return(
        <div>
            <div class="container-fluid pt-4 px-4">
                <div class="bg-white shadow py-3 rounded-top p-4">
                    <div class="row">
                        <div class="col-12 col-sm-6 text-center text-sm-start">
                            &copy; <a href="https://www.ecolapp.com" target="_blank"rel="nooper noreferrer">ecolapp</a>, Tous droits réservés. <br/>
                        </div>
                        <div class="col-12 col-sm-6 text-center text-sm-end">
                            &copy;   <span class="small">{currentYear}</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default FooterUser;