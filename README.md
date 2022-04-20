# UKL Dokumentasi - Indonesian

Dokumentasi projek laundry untuk UKL menggunakan framework (Node JS Express React MySQL)

### Preparation

membuat folder dengan dua folder di dalamnya, folder pertama untuk backend dan folder kedua untuk frontend.

laundry/
├─ api/
├─ web/

karena akan membuat api terlebih dahulu, pindah direktori ke api dan lakukan inisialisasi dengan npm init - y

### Membuat Database

> Teknologi yang digunakan adalah sequelize(cli) dan mysql

- buka dan nyalakan xampp agar mysql dapat diakses
- install sequelize dan mysql (tambahkan juga nodemon agar tidak perlu run manual setiap kali ada perubahan)
  `npm -i nodemon sequelize mysql2`
- lakukan inisialisasi sequelize dengan `sequelize init`
- buka folder config dan file config

  ├───config
  ├───migrations
  ├───models

  ubah database pada development sesuai nama database yang telah dibuat
  "development": {
  "username": "root",
  "password": null,
  "database": " _laundry_ ",
  "host": "127.0.0.1",
  "dialect": "mysql"
  },

- selanjutnya buka file index pada folder models, tambahkan kode dibawah agar nama tabel dalam database tidak menjadi plural
  `sequelize = new Sequelize("sqlite::memory:", { define: { freezeTableName: true, }, });`

- membuat tabel sesuai dengan yang diminta, dapat dibuat menggunakan cli seperti dibawah

  - sequelize model:create --name member --attributes nama:string, alamat:text, jenis_kelamin:enum, tlp:string

  - sequelize model:create --name outlet --attributes nama:string, alamat:text, tlp:string

  - sequelize model:create --name user --attributes nama:string, username:string, password:text, id_outlet:integer, role:enum

  - sequelize model:create --name transaksi --attributes id_outlet:integer, kode_invoice:string id_member:integer, tgl:date, batas_waktu:date, tgl_bayar:date, biaya_tambahan:integer, diskon:double, pajak:integer, status:enum, dibayar:enum, id_user:integer

  - sequelize model:create --name paket --attributes id_outlet:integer, jenis:enum, nama_paket:string, harga:integer

  - sequelize model:create --name detail_transaksi --attributes id_transaksi:integer, id_paket:integer, qty:double, keterangan:text

- tabel sudah terbuat, selanjutnya buka file migration dan buat relasi pada tiap-tiap tabel yang ada di database (silahkan lihat bagaimana caranya membuat relasi di source code). Jangan lupa untuk set ukuran dan juga memasukkan nilai enum.

- Membuat relasi juga dilakukan pada file models, silahkan lihat source code untuk melihat cara membuat relasi

- terakhir, migrate database dengan command `sequelize db:migrate`. untuk melihat apakah berhasil atau tidak, bisa dilihat pada phpmyadmin

### Membuat server

- Install dependencies yang dibutuhkan yaitu:
  `npm i --save express body-parser cors bcrypt dotenv`
  - Express
    Membuat web server baik file maupun REST
  - Body-parser
    Untuk menangkap file, nilai atau apapun yang diberikan pada server
  - Cors
    Untuk membuat server web api yang kita buat dapat diakses oleh semua orang
  - Bcrypt
    Melakukan enkripsi
  - Dotenv
    Menampung sebuah key seperti api key, port dan lain-lain
- Buat file index.js pada root dan buat server yang dapat running di port 8000. Sebelum itu, tambahkan file config.js pada folder config. (semua source code dapat dilihat)
