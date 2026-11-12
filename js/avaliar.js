// Formulário de avaliação das páginas dos alojamentos em destaque
const formAvaliacao = document.getElementById("form-avaliacao");
const mensagemAvaliacao = document.getElementById("mensagem-avaliacao");

function mostrarMensagem(texto, correu) {
  mensagemAvaliacao.textContent = texto;
  mensagemAvaliacao.className = correu ? "mt-3 text-sm text-[#1c5a2b]" : "mt-3 text-sm text-[#8a1c13]";
  mensagemAvaliacao.hidden = false;
}

formAvaliacao.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = new FormData(formAvaliacao);

  try {
    const resposta = await fetch("../api/avaliacoes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alojamento_id: Number(formAvaliacao.dataset.alojamento),
        classificacao: Number(dados.get("classificacao")),
        nome: dados.get("nome"),
        comentario: dados.get("comentario")
      })
    });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(resultado.erro, false);
      return;
    }

    mostrarMensagem(resultado.mensagem, true);
    formAvaliacao.reset();
  } catch (erro) {
    // Sem servidor (site aberto com duplo clique)
    mostrarMensagem("Para guardar a avaliação, abra o site com o servidor PHP (php -S localhost:8000).", false);
  }
});
