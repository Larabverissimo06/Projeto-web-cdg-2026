
// Lista de alojamentos com filtros por tipo.
(function () {
  const { t, aoMudar } = window.idiomas;

  const grelha = document.getElementById("alojamentos-grid");
  const mensagem = document.getElementById("mensagem-lista");
  const botoes = document.querySelectorAll("#filtros button");

  let alojamentos = [];
  let carregado = false;
  let falhou = false;
  let filtro = new URLSearchParams(location.search).get("tipo") || "todos";
  
  // Cartões fixos do HTML (para quando o site abre sem servidor)
  const cartoesFixos = [...grelha.children];

  // Coração dos favoritos nos cartões fixos
  cartoesFixos.forEach((cartao) => {
    const caixaImagem = cartao.firstElementChild;
    caixaImagem.classList.add("relative");
    caixaImagem.appendChild(window.botaoFavorito(Number(cartao.dataset.id)));
  });

  // Cartão dos espaços comuns
  function cartaoEspacosComuns() {
    const cartao = document.createElement("article");
    cartao.className = "alojamento-card group flex flex-col overflow-hidden rounded-3xl border border-[#e8e1d7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl";

    cartao.innerHTML = `
      <div class="h-64 overflow-hidden md:h-72">
        <img
          src="imagens/alojamentos/espacos_comuns_millennium/4.jpeg"
          alt="Terraço dos Espaços Comuns do Millennium"
          loading="lazy"
          class="size-full object-cover transition duration-500 group-hover:scale-105"
        >
      </div>

      <div class="flex grow flex-col px-6 pb-7 pt-6">
        <h3 class="mb-4 font-['Georgia',serif] text-2xl leading-snug text-[#14245d]">Espaços Comuns (Cozinha e Terraço)</h3>

        <p class="mb-6 text-sm leading-relaxed text-[#666]">
          Acesso exclusivo aos hóspedes de alojamentos selecionados.
        </p>

        <a href="espacos-comuns-millennium.html" class="mt-auto inline-flex w-fit items-center gap-2 border-b border-[#14245d] pb-1 text-xs tracking-wider text-[#14245d] transition-all hover:gap-3.5 hover:border-[#b49468] hover:text-[#b49468]">
          VER ESPAÇOS
          ${window.icone("seta", "size-4")}
        </a>
      </div>
    `;

    return cartao;
  }

  function desenhar() {
    grelha.replaceChildren();

    botoes.forEach((botao) => {
      const ativo = botao.dataset.filtro === filtro;
      botao.classList.toggle("ativo", ativo);
      botao.setAttribute("aria-pressed", ativo ? "true" : "false");
    });

    // Sem servidor: fica o cartão fixo do HTML
    // Sem servidor: usa os cartões fixos do HTML; com servidor: os da base de dados
    const semServidor = falhou || !carregado;
    const lista = semServidor
      ? cartoesFixos.map((cartao) => ({ id: Number(cartao.dataset.id), tipologia: cartao.dataset.tipologia, cartao }))
      : alojamentos;

    const visiveis = lista.filter((a) => {
      if (filtro === "favoritos") return window.favoritos.tem(a.id);
      return filtro === "todos" || a.tipologia === filtro;
    });

    // Primeiro aparecem os alojamentos normais
    visiveis.forEach((alojamento) => {
      grelha.appendChild(
        semServidor ? alojamento.cartao : window.cartaoAlojamento("alojamento", alojamento)
      );
    });

    // Só aparece nos Quartos e sempre no final
    if (filtro === "Quarto") {
      grelha.appendChild(cartaoEspacosComuns());
    }

    mensagem.textContent = filtro === "favoritos"
      ? t("aloj.sem_favoritos")
      : t("aloj.vazio");
    mensagem.hidden = visiveis.length > 0 || filtro === "Quarto";
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      filtro = botao.dataset.filtro;
      desenhar();
    });
  });

  // Atualizar os favoritos
  document.addEventListener("favoritos-mudaram", () => {
    if (filtro === "favoritos") desenhar();
  });  

  fetch("api/alojamentos.php")
    .then((resposta) => {
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      return resposta.json();
    })
    .then((dados) => {
      alojamentos = (dados.alojamentos || [])
        .filter((alojamento, indice, lista) =>
          indice === lista.findIndex(
            (item) => item.nome === alojamento.nome
          )
        )
        .sort((a, b) => a.id - b.id);

      carregado = true;
      desenhar();
    })
    .catch((erro) => {
      console.error("Erro ao carregar os alojamentos:", erro);
      falhou = true;
      desenhar();
    });

  aoMudar(desenhar);
})();
