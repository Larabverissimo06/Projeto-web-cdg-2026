(function () {
  const lista = document.getElementById("lista-avaliacoes");
  const mediaNumero = document.getElementById("media-numero");
  const mediaEstrelas = document.getElementById("media-estrelas");
  const total = document.getElementById("total-avaliacoes");
  const barras = document.getElementById("barras-avaliacoes");

  let avaliacoes = [];
  let filtro = 0;

  // Mostrar avaliações
  function mostrar(estrelas) {
    filtro = estrelas;
    lista.replaceChildren();

    avaliacoes
      .filter((avaliacao) => !estrelas || Number(avaliacao.classificacao) === estrelas)
      .forEach((avaliacao) => lista.appendChild(window.cartaoAvaliacao(avaliacao, true)));

    barras.querySelectorAll("button").forEach((botao) => {
      botao.setAttribute("aria-pressed", Number(botao.dataset.estrelas) === estrelas);
    });
  }

  fetch("api/avaliacoes.php")
    .then((resposta) => resposta.json())
    .then((dados) => {
      if (dados.total === 0) {
        document.getElementById("resumo").remove();
        document.getElementById("sem-avaliacoes").hidden = false;
        return;
      }

      avaliacoes = dados.avaliacoes;

      const arredondada = Math.round(dados.media);
      mediaNumero.textContent = dados.media.toLocaleString("pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      mediaEstrelas.innerHTML = window.estrelas(arredondada, "size-7");
      total.textContent = `${dados.total} ${dados.total === 1 ? "avaliação" : "avaliações"}`;

      // Uma barra por número de estrelas
      for (let n = 5; n >= 1; n--) {
        const quantas = avaliacoes.filter((avaliacao) => Number(avaliacao.classificacao) === n).length;

        const botao = document.createElement("button");
        botao.type = "button";
        botao.dataset.estrelas = n;
        botao.className = "grid w-full grid-cols-[2.5rem_1fr_2rem] items-center gap-4 rounded-full px-4 py-2 text-left text-sm text-[#14245d] transition-colors hover:bg-white aria-pressed:bg-white disabled:opacity-40 disabled:hover:bg-transparent";
        botao.disabled = quantas === 0;
        botao.innerHTML = `<span class="inline-flex items-center gap-1">${n} ${window.icone("estrela-cheia", "size-3.5")}</span>
          <span class="h-2 overflow-hidden rounded-full bg-[#e8e1d7]"><span class="block h-full rounded-full bg-[#b49468]" style="width: ${(quantas / dados.total) * 100}%"></span></span>
          <span class="text-right text-[#666]">${quantas}</span>`;

        botao.addEventListener("click", () => mostrar(filtro === n ? 0 : n));

        const item = document.createElement("li");
        item.appendChild(botao);
        barras.appendChild(item);
      }

      mostrar(0);
    })
    // Sem servidor: mostra a mensagem de quando ainda não há avaliações
    .catch(() => {
      document.getElementById("resumo").remove();
      document.getElementById("sem-avaliacoes").hidden = false;
    });
})();