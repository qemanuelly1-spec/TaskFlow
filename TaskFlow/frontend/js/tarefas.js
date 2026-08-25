// URL base da API. Ajuste caso a porta do backend seja diferente.
const API_URL = "http://localhost:5000/api/tarefas";

const form = document.getElementById("tarefaForm");
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

function resetarFormulario() {
  form.reset();
  tarefaIdInput.value = "";
  formTitle.textContent = "Nova tarefa";
  submitBtn.innerHTML = '<i class="bi bi-plus-lg"></i> Adicionar tarefa';
  cancelEditBtn.classList.add("d-none");
}

// ---------- Chamadas à API ----------

async function listarTarefas() {
  try {
    let url = API_URL;
    if (filtroAtual === "pendentes") url += "?concluida=false";
    if (filtroAtual === "concluidas") url += "?concluida=true";

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Erro ao buscar tarefas.");

    const tarefas = await resposta.json();
    renderizarTarefas(tarefas);
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("Não foi possível carregar as tarefas. Verifique se a API está rodando.", "danger");
  }
}

async function criarTarefa(dados) {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) throw new Error("Erro ao criar tarefa.");
  return resposta.json();
}

async function atualizarTarefa(id, dados) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  if (!resposta.ok) throw new Error("Erro ao atualizar tarefa.");
  return resposta.json();
}

async function alternarConclusao(id) {
  const resposta = await fetch(`${API_URL}/${id}/concluir`, { method: "PATCH" });
  if (!resposta.ok) throw new Error("Erro ao atualizar status da tarefa.");
  return resposta.json();
}

async function excluirTarefa(id) {
  const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!resposta.ok) throw new Error("Erro ao excluir tarefa.");
}

// ---------- Renderização ----------

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

  tarefas.forEach((tarefa) => {
    const item = document.createElement("div");
    item.className = `list-group-item tarefa-item ${tarefa.concluida ? "concluida" : ""}`;

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

// ---------- Eventos ----------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    titulo: tituloInput.value.trim(),
    descricao: descricaoInput.value.trim(),
    concluida: concluidaInput.checked
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
