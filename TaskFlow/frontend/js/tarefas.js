// URL base da API. Ajuste caso a porta do backend seja diferente.
const API_URL = "http://localhost:5000/api/tarefas";

const form = document.getElementById("tarefaForm");
const prioridadeInput = document.getElementById("prioridade")
const tarefaIdInput = document.getElementById("tarefaId");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const concluidaInput = document.getElementById("concluida");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const listaTarefas = document.getElementById("listaTarefas");
const alertContainer = document.getElementById("alertContainer");
const filtroBtns = document.querySelectorAll(".filtro-btn");

let filtroAtual = "todas";

// ---------- Utilidades ----------

function mostrarAlerta(mensagem, tipo = "success") {
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  setTimeout(() => {
    const alertEl = alertContainer.querySelector(".alert");
    if (alertEl) alertEl.remove();
  }, 4000);
}

//Aqui estamos criando uma funçao para formatar a data de acordo com a data atual dia/mês/ano hora:minuto
function formatarData(dataIso) {
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

//Cria uma função para voltar o formulário ao estado inicial.
function resetarFormulario() {
  form.reset(); //Limpa/restaura os campos do formulário.
  tarefaIdInput.value = "";
  formTitle.textContent = "Nova tarefa";
  submitBtn.innerHTML = '<i class="bi bi-plus-lg"></i> Adicionar tarefa';
  cancelEditBtn.classList.add("d-none");
}

// ---------- Chamadas à API ---------- 
//

async function listarTarefas() {
  try {
    let url = API_URL;
    if (filtroAtual === "pendentes") url += "?concluida=false";
    if (filtroAtual === "concluidas") url += "?concluida=true";
   
    //Aqui ele busca GEt
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Erro ao buscar tarefas."); //Verifica se a API respondeu corretamente.
    console.log(resposta)
    const tarefas = await resposta.json();  //Pega o JSON enviado pelo backend.
    renderizarTarefas(tarefas);//Essa função vai colocar as tarefas na tela.
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("Não foi possível carregar as tarefas. Verifique se a API está rodando.", "danger");
  }
}
//recebe os dados da nova tarefa.
async function criarTarefa(dados) {
  const resposta = await fetch(API_URL, {
    method: "POST", //Criar um novo recurso.
    headers: { "Content-Type": "application/json" }, //Aqui tranforma o objeto javaScript em json
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) throw new Error("Erro ao criar tarefa."); //Se a API falhar, lança erro.
  return resposta.json(); //Retorna a resposta do backend.
}

async function atualizarTarefa(id, dados) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PUT", //Retorna a resposta do backend.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) throw new Error("Erro ao atualizar tarefa.");
  return resposta.json();
}

async function alternarConclusao(id) {
  const resposta = await fetch(`${API_URL}/${id}/concluir`, { method: "PATCH" }); //ficaria assim na URL PATCH /api/tarefas/5/concluir
  if (!resposta.ok) throw new Error("Erro ao atualizar status da tarefa.");
  return resposta.json(); //Retorna a tarefa atualizada.
}

async function excluirTarefa(id) { //Recebe o ID.
  const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" }); //DELETE /api/tarefas/5 ("Backend, exclua a tarefa 5.")
  if (!resposta.ok) throw new Error("Erro ao excluir tarefa.");
}

// ---------- Renderização ----------

//Essa função recebe as tarefas vindas da API e transforma os dados em HTML.
function renderizarTarefas(tarefas) {
  listaTarefas.innerHTML = "";

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-inbox fs-1"></i>
        <p class="mt-2">Nenhuma tarefa encontrada.</p>
      </div>`;
    return;
  }

  tarefas.forEach((tarefa) => { //Percorrendo cada tarefa
    const item = document.createElement("div");
    item.className = `list-group-item tarefa-item ${tarefa.concluida ? "concluida" : ""}`;
    const prioridade = infoPrioridade(tarefa.prioridade); 
    item.innerHTML = `
      <div>
        <div class="tarefa-titulo">${escapeHtml(tarefa.titulo)}</div>
        ${tarefa.descricao ? `<div class="tarefa-descricao">${escapeHtml(tarefa.descricao)}</div>` : ""}
        <div class="tarefa-data">Criada em ${formatarData(tarefa.dataCriacao)}</div>
      </div>
      <div class="tarefa-acoes d-flex align-items-start">
        <button class="btn btn-sm btn-outline-success" title="Concluir/Reabrir" data-acao="concluir" data-id="${tarefa.id}">
          <i class="bi bi-check2-circle"></i>
        </button>
        <button class="btn btn-sm btn-outline-primary" title="Editar" data-acao="editar" data-id="${tarefa.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" title="Excluir" data-acao="excluir" data-id="${tarefa.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    listaTarefas.appendChild(item);
  });
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function infoPrioridade(valor) {
  switch (valor) {
    case 2: return { label: "Alta", classe: "bg-danger" };
    case 1: return { label: "Média", classe: "bg-warning text-dark" };
    default: return { label: "Baixa", classe: "bg-success" };
  }
}

// ---------- Eventos ----------
//"Essa parte controla os eventos do sistema: criar, editar, excluir, concluir tarefas e 
// filtrar a lista. Ela captura as ações do usuário, chama as funções da API e atualiza a interface."

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    titulo: tituloInput.value.trim(),
    descricao: descricaoInput.value.trim(),
    concluida: concluidaInput.checked,
    prioridade: parseInt(prioridadeInput.value, 10) 
  };

  if (!dados.titulo) {
    mostrarAlerta("O título é obrigatório.", "warning");
    return;
  }

  try {
    const id = tarefaIdInput.value;
    if (id) {
      await atualizarTarefa(id, dados);
      mostrarAlerta("Tarefa atualizada com sucesso!");
    } else {
      await criarTarefa(dados);
      mostrarAlerta("Tarefa criada com sucesso!");
    }
    resetarFormulario();
    listarTarefas();
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("Ocorreu um erro ao salvar a tarefa.", "danger");
  }
});

cancelEditBtn.addEventListener("click", resetarFormulario);

listaTarefas.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-acao]");
  if (!btn) return;

  const id = btn.dataset.id;
  const acao = btn.dataset.acao;

  try {
    if (acao === "excluir") {
      if (confirm("Deseja realmente excluir esta tarefa?")) {
        await excluirTarefa(id);
        mostrarAlerta("Tarefa excluída.");
        listarTarefas();
      }
    } else if (acao === "concluir") {
      await alternarConclusao(id);
      listarTarefas();
    } else if (acao === "editar") {
      const resposta = await fetch(`${API_URL}/${id}`);
      const tarefa = await resposta.json();

      tarefaIdInput.value = tarefa.id;
      tituloInput.value = tarefa.titulo;
      descricaoInput.value = tarefa.descricao || "";
      concluidaInput.checked = tarefa.concluida;
      prioridadeInput.value = tarefa.prioridade; 

      formTitle.textContent = "Editar tarefa";
      submitBtn.innerHTML = '<i class="bi bi-save"></i> Salvar alterações';
      cancelEditBtn.classList.remove("d-none");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("Ocorreu um erro ao processar a ação.", "danger");
  }
});

filtroBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtroAtual = btn.dataset.filtro;
    listarTarefas();
  });
});

// ---------- Inicialização ----------

listarTarefas();
