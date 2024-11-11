import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../assets/css/Info.css'
import { faEdit, faHammer, faHandFist, faShield, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
const Info = () =>{
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    return(
        <>
        <div className="info-container">
    <h1 className="text-white text-center pt-3 fw-bold">Info</h1>
    {/* <h1 className="text-white text-center pt-3 fw-bold">Nabil</h1> */}
    <div className="col d-flex justify-content-center ">
        <div className="info-col col-sm-12 bg-dark p-2 rounded">

        <p className="text-white text-center mb-0"><b>Kurokami</b> adalah Aplikasi Baca Manhwa dan Manga <b>Gratis</b> yang mudah digunakan. Tanpa perlu login, cukup buka dan langsung mulai membaca. Terdapat sedikit <b>Iklan</b> dalam aplikasi, namun tidak menggangu dalam membaca</p>

        </div>
    </div>
   <div className="d-flex gap-1 justify-content-center">
   <a class="btn btn-dark m-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    <FontAwesomeIcon icon={faHammer} /> DMCA
  </a>
    <a class="btn btn-dark m-0" type="button" data-bs-toggle="collapse" data-bs-target="#privacy" aria-expanded="false" aria-controls="collapseExample">
    <FontAwesomeIcon icon={faShield} /> Privacy Policy
  </a>
    <a class="btn btn-dark m-0" type="button" data-bs-toggle="collapse" data-bs-target="#dev" aria-expanded="false" aria-controls="collapseExample">
    <FontAwesomeIcon icon={faEdit} /> Saran
  </a>
   </div>

  <div class="collapse" id="collapseExample">
        <div className="col bg-dark m-2 rounded p-2">
            <p className="text-white">
            The content available in the <b>Kurokami</b> app is sourced directly from the website  <b>komikstation.co</b> . We do not host, store, or own any of the content provided within our application. All content remains the property of its respective owners, and our app simply aggregates this content for easy access. If you have any concerns regarding the content, please refer to the original source at  <b>komikstation.co</b> .
            </p>
        </div>
</div>

  <div class="collapse" id="privacy">
        <div className="col bg-dark m-2 rounded p-2">
        <h6 class="card-subtitle mb-2 text-white fw-bold">1. Informasi yang Kami Kumpulkan</h6>
        <p className="text-white">Kurokami adalah aplikasi baca manhwa dan Manga yang sepenuhnya gratis dan tidak memerlukan fitur login. Oleh karena itu, kami tidak mengumpulkan, menyimpan, atau menggunakan data pribadi pengguna. Kami tidak meminta informasi apa pun dari Anda, termasuk nama, alamat email, atau data pribadi lainnya.</p>

        <h6 class="card-subtitle mb-2 text-white fw-bold">2. Penggunaan Data</h6>
        <p className="text-white">Karena kami tidak mengumpulkan data pribadi, kami tidak menggunakan data Anda untuk tujuan apa pun. Aplikasi ini hanya memungkinkan Anda untuk membaca manhwa dan Manga tanpa perlu login atau mendaftar.</p>
        <h6 class="card-subtitle mb-2 text-white fw-bold">3. Keamanan</h6>
        <p className="text-white">Meskipun kami tidak mengumpulkan data pribadi, kami tetap berkomitmen untuk menjaga keamanan aplikasi dan melindungi pengalaman pengguna dari potensi ancaman. Kami menggunakan langkah-langkah keamanan standar untuk menjaga aplikasi tetap aman.</p>
        <h6 class="card-subtitle mb-2 text-white fw-bold">4. Pembaruan Kebijakan</h6>
        <p className="text-white">Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan apa pun akan diumumkan melalui aplikasi, dan kebijakan privasi yang diperbarui akan berlaku segera setelah diposting.</p>

        <h6 class="card-subtitle mb-2 text-white fw-bold">5. Kontak</h6>
        <p className="text-white">Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi kami di <a className="text-white fw-bold">agungcakra888@gmail.com</a></p>
        </div>
</div>

<div class="collapse" id="dev">
        <div className="col text-center bg-dark m-2 rounded p-2">
           <b className="text-white text-center">Saran & Masukan</b>
           <p className="text-white">Untuk Sementara, Jika ada Saran dan Masukan silahkan hubungi <a className="text-white fw-bold">agungcakra888@gmail.com</a></p>
        </div>
</div>
       <p class="text-center text-white pt-5">© 2024 Cakra Jaya. All right reserved</p>

</div>

        </>
    )
}
export default Info;