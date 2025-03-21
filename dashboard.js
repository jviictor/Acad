// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Verificar se o usuário está logado
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html"; // Redireciona para login se não estiver autenticado
    } else {
        carregarTreinos(user.uid); // Carrega os treinos do usuário logado
    }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
});

// Adicionar treino
document.getElementById("treino-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;

    if (data.trim() === "" || descricao.trim() === "") return;

    try {
        await addDoc(collection(db, "treinos"), {
            userId: user.uid,
            data,
            descricao,
            timestamp: new Date()
        });

        document.getElementById("treino-form").reset();
        carregarTreinos(user.uid); // Recarrega a lista de treinos após adicionar um novo
    } catch (error) {
        console.error("Erro ao adicionar treino: ", error);
    }
});

// Função para carregar e exibir os treinos
async function carregarTreinos(userId) {
    const tabelaTreinos = document.querySelector("#tabela-treinos tbody");
    const contador = document.getElementById("contador");

    // Limpa a tabela antes de carregar os treinos
    tabelaTreinos.innerHTML = "";

    try {
        const q = query(collection(db, "treinos"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // Converte os documentos para um array
        const treinos = [];
        querySnapshot.forEach((doc) => {
            treinos.push({ id: doc.id, ...doc.data() });
        });

        // Ordena os treinos por data (do mais antigo para o mais recente)
        treinos.sort((a, b) => new Date(a.data) - new Date(b.data));

        // Atualiza o contador de treinos
        contador.textContent = treinos.length;

        // Exibe os treinos na tabela
        treinos.forEach((treino) => {
            const row = document.createElement("tr");

            // Coluna de Data (formatada)
            const dataCell = document.createElement("td");
            dataCell.textContent = formatarData(treino.data); // Formata a data
            row.appendChild(dataCell);

            // Coluna de Descrição
            const descricaoCell = document.createElement("td");
            descricaoCell.textContent = treino.descricao;
            row.appendChild(descricaoCell);

            // Coluna de Ações (Editar e Excluir)
            const acoesCell = document.createElement("td");

            // Botão de Editar
            const editarBtn = document.createElement("button");
            editarBtn.textContent = "Editar";
            editarBtn.classList.add("editar"); // Adiciona classe para estilização
            editarBtn.addEventListener("click", () => editarTreino(treino.id, treino));
            acoesCell.appendChild(editarBtn);

            // Botão de Excluir
            const excluirBtn = document.createElement("button");
            excluirBtn.textContent = "Excluir";
            excluirBtn.classList.add("excluir"); // Adiciona classe para estilização
            excluirBtn.addEventListener("click", () => excluirTreino(treino.id));
            acoesCell.appendChild(excluirBtn);

            row.appendChild(acoesCell);
            tabelaTreinos.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar treinos: ", error);
    }
}

// Função para editar um treino
async function editarTreino(id, treino) {
    const novaData = prompt("Editar data:", treino.data);
    const novaDescricao = prompt("Editar descrição:", treino.descricao);

    if (novaData && novaDescricao) {
        try {
            await updateDoc(doc(db, "treinos", id), {
                data: novaData,
                descricao: novaDescricao
            });

            alert("Treino atualizado com sucesso!");
            carregarTreinos(auth.currentUser.uid); // Recarrega a lista de treinos
        } catch (error) {
            console.error("Erro ao editar treino: ", error);
        }
    }
}

// Função para excluir um treino
async function excluirTreino(id) {
    if (confirm("Tem certeza que deseja excluir este treino?")) {
        try {
            await deleteDoc(doc(db, "treinos", id));
            alert("Treino excluído com sucesso!");
            carregarTreinos(auth.currentUser.uid); // Recarrega a lista de treinos
        } catch (error) {
            console.error("Erro ao excluir treino: ", error);
        }
    }
}