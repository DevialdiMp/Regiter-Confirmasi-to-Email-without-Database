const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users = [];

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_APP,
    },
});

const registerUser = (req, res) => {
    const { email, name, password } = req.body;

    const token = jwt.sign({ email, name, password }, process.env.JWT_SECRET);

    users.push({ email, name, password, isActive: false });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Konfirmasi Pendaftaran",
        text: `Halo ${name}, silahkan konfirmasi pendaftaran anda dengan klik link di bawah ini.`,
        html: `<p>Halo ${name},</p><p>Silahkan klik link berikut untuk mengaktifkan akun anda:</p>
               <a href="http://localhost:3000/api/users/activate/${token}">Konfirmasi Akun</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error detail:", err);
            return res.status(500).json({ message: "Gagal mengirim email konfirmasi." });
        }
        console.log(`Pengguna berhasil mendaftar: \n Nama: ${name} \n Email: ${email}`);
        res.status(200).json({ message: "Registrasi berhasil! Silahkan cek email untuk konfirmasi." });
    });
};

const activateUser = (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token tidak valid atau sudah kedaluwarsa.");
            return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
        }

        const user = users.find(u => u.email === decoded.email);

        if (!user) {
            return res.status(400).json({ message: "Pengguna tidak ditemukan." });
        }

        user.isActive = true;
        console.log(`Akun dengan email ${decoded.email} berhasil diaktifkan.`);
        res.status(200).json({ message: "Akun berhasil diaktifkan!" });
    });
};

module.exports = { registerUser, activateUser };
