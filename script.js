// Importe o Firebase usando a sintaxe de módulos ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDy7s70ofsNhqcfQ82UCo-qLmJ40pASGXA",
    authDomain: "acad-38ac2.firebaseapp.com",
    projectId: "acad-38ac2",
    storageBucket: "acad-38ac2.firebasestorage.app",
    messagingSenderId: "603287682292",
    appId: "1:603287682292:web:37811f0ebeac016e88b2a1",
    measurementId: "G-J1M9PFEBLX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const message = document.getElementById("message");

    // Função para exibir mensagens
    function showMessage(msg, isError = true) {
        message.style.color = isError ? "red" : "green";
        message.textContent = msg;
    }

    // Cadastro de usuário
    registerBtn.addEventListener("click", function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Por favor, preencha todos os campos.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                showMessage("Cadastro realizado com sucesso!", false);
                setTimeout(() => window.location.href = "dashboard.html", 2000);
            })
            .catch((error) => {
                console.error("Erro no cadastro:", error);
                showMessage(error.message);
            });
    });

    // Login do usuário
    loginBtn.addEventListener("click", function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Por favor, preencha todos os campos.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showMessage("Login bem-sucedido! Redirecionando...", false);
                setTimeout(() => window.location.href = "dashboard.html", 2000);
            })
            .catch((error) => {
                console.error("Erro no login:", error);
                showMessage(error.message);
            });
    });
});