// Página de detalhe de um alojamento
(function () {
  const { t, plural, idioma, formatarEuros, formatarData, traduzirComodidade, traduzirDivisao, aoMudar } = window.idiomas;

  function obterId() {

    const parametro = new URLSearchParams(location.search).get("id");

    return parametro ? Number(parametro) : 1;
  }

  const ALOJAMENTO_ID = obterId();

  
  // Voltar à pesquisa
  const pesquisa = new URLSearchParams(location.search);
  pesquisa.delete("id");
  const veioDaPesquisa = pesquisa.has("check_in") && pesquisa.has("check_out");

  if (veioDaPesquisa) {
    const voltar = document.getElementById("voltar-pesquisa");
    voltar.href = "reservar.html?" + pesquisa.toString();
    voltar.hidden = false;
  }

  const galeria = document.getElementById("galeria-fotografias");
  const visualizador = document.getElementById("visualizador");
  const visualizadorImagem = document.getElementById("visualizador-imagem");
  const visualizadorLegenda = document.getElementById("visualizador-legenda");

  let alojamento = null;
  let naoEncontrado = false;
  let fotografias = [];
  let ocupacao = [];
  let indiceAtual = 0;

  // ---------- DESENHAR ----------

  function desenharAlojamento() {
    const nome = document.getElementById("nome-alojamento");

    if (naoEncontrado) {
      nome.textContent = t("det.nao_encontrado");
      return;
    }

    if (!alojamento) return;

    document.title = t("det.titulo_pagina", { nome: alojamento.nome });
    nome.textContent = alojamento.nome
      .trim()
      .replace(/\bDra\.?\s+Ines\b/gi, "Dra. Inês")
      .replace(/^Quarto\s*[–-]\s*(\d+)\s+(\d+)\s+Andar\b/i, "Quarto $1 – $2.º andar")
      .replace(/^Quarto\s*[–-]\s*(\d+)\s+Res\s+Do\s+Chao\b/i, "Quarto $1 – rés do chão")
      .replace(/\b(\d+)\s+Andar\b/gi, "$1.º andar")
      .replace(/\bRes\s+Do\s+Chao\b/gi, "rés do chão")
      .replace(/\bFrente\s+Mar\b/gi, "frente mar")
      .replace(/\s*[–-]\s*/g, " – ")
      .replace(/\s+/g, " ")
      .trim();
    document.getElementById("etiqueta-alojamento").textContent = alojamento.nome.toUpperCase();

    const imagemPrincipal = document.getElementById("imagem-principal");
    imagemPrincipal.src = alojamento.imagem || (fotografias[0] && fotografias[0].caminho) || "";
    imagemPrincipal.alt = alojamento.nome;

    document.getElementById("capacidade").textContent = plural("comum.hospedes", alojamento.capacidade);
    document.getElementById("quartos").textContent = alojamento.quartos;

    const precos = [
      alojamento.preco_baixa,
      alojamento.preco_media,
      alojamento.preco_alta
    ].map(Number).filter(Number.isFinite);

    const precoMinimo = precos.length
      ? Math.min(...precos)
      : Number(alojamento.preco_noite);

    document.getElementById("preco").textContent =
      Number.isFinite(precoMinimo)
        ? `Desde ${formatarEuros(precoMinimo)} / noite`
        : "";

    const listaComodidades = document.getElementById("comodidades");
    listaComodidades.replaceChildren();

    (alojamento.comodidades || []).forEach((comodidade) => {
      const item = document.createElement("li");
      item.className = "flex items-center gap-3";
      item.innerHTML = `<span class="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#e2eaf1] text-[#14245d]">${window.icone("visto", "size-4")}</span>`;

      if (comodidade.toLowerCase().startsWith("espaços comuns")) {
        const ligacao = document.createElement("a");
        ligacao.href = "espacos-comuns-millennium.html";
        ligacao.textContent = traduzirComodidade(comodidade);
        ligacao.insertAdjacentHTML("beforeend", window.icone("seta", "size-4"));
        ligacao.className = "inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#b49468]";
        item.appendChild(ligacao);
      } else {
        item.append(traduzirComodidade(comodidade));
      }
      listaComodidades.appendChild(item);
    });

    
    const listaDetalhes = document.getElementById("detalhes-alojamento");
    listaDetalhes.replaceChildren();

    (alojamento.detalhes || []).forEach((texto) => {
      const item = document.createElement("li");
      item.className = "border-l-4 border-[#1d2d78] bg-white px-4 py-3 font-medium text-[#14245d]";
      item.textContent = texto;
      listaDetalhes.appendChild(item);
    });

    document.getElementById("bloco-detalhes").hidden = listaDetalhes.children.length === 0;

    document.getElementById("morada-alojamento").textContent = alojamento.localizacao || "";

    const linkMapa = document.getElementById("link-mapa");
    linkMapa.href = alojamento.link_mapa || "#";
    linkMapa.hidden = !alojamento.link_mapa;

    const mapa = document.getElementById("mapa-alojamento");

    if (alojamento.localizacao && !mapa.firstChild) {
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(alojamento.localizacao) + "&output=embed";
      iframe.title = "Mapa: " + alojamento.nome;
      iframe.loading = "lazy";
      iframe.className = "h-[300px] w-full border-0";
      mapa.appendChild(iframe);
      mapa.hidden = false;
    }

    const descricao = idioma() === "en"
      ? (alojamento.descricao_en || alojamento.descricao)
      : alojamento.descricao;

    document.getElementById("descricao-alojamento").textContent = descricao || t("det.desc_padrao");
    document.getElementById("informacao-alojamento").textContent = t("det.info_padrao");

    document.getElementById("botao-disponibilidade").href = "reservar.html?alojamento=" + alojamento.id + (veioDaPesquisa ? "&" + pesquisa.toString() : "");
  }

  function desenharOcupacao() {
    const lista = document.getElementById("lista-ocupacao");
    lista.replaceChildren();

    if (!alojamento) return;

    if (ocupacao.length === 0) {
      const item = document.createElement("li");
      item.textContent = t("det.ocupado_vazio");
      lista.appendChild(item);
      return;
    }

    ocupacao.forEach((periodo) => {
      const item = document.createElement("li");

      item.textContent = t("det.ocupado_intervalo", {
        de: formatarData(periodo.check_in),
        ate: formatarData(periodo.check_out)
      });

      lista.appendChild(item);
    });
  }

  function desenharGaleria() {
    galeria.replaceChildren();

    fotografias.forEach((foto, indice) => {
      const divisao = traduzirDivisao(foto.divisao);

      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-md bg-[#e8e6e1]";
      botao.setAttribute("aria-label", t("det.ampliar", { divisao }));

      const img = document.createElement("img");
      img.src = foto.caminho;
      img.alt = `${divisao} - ${alojamento ? alojamento.nome : ""}`;
      img.loading = "lazy";
      img.className = "size-full object-cover transition duration-300 group-hover:scale-105";

      const legenda = document.createElement("span");
      legenda.className = "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3.5 pb-3 pt-7 text-left text-sm text-white transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100";
      legenda.textContent = divisao;

      botao.append(img, legenda);
      botao.addEventListener("click", () => abrirVisualizador(indice));

      galeria.appendChild(botao);
    });
  }

  function desenharTudo() {
    desenharAlojamento();
    desenharOcupacao();
    desenharGaleria();

    if (!visualizador.hidden) mostrarFotografia();
  }

  // ---------- CARREGAR DADOS ----------

  async function carregar() {
    try {
      const resposta = await fetch(`api/alojamento.php?id=${ALOJAMENTO_ID}`);

      if (!resposta.ok) {
        naoEncontrado = true;
        desenharTudo();
        return;
      }

      alojamento = await resposta.json();
    } catch (erro) {
      console.error("Erro ao carregar o alojamento:", erro);
      return;
    }

    try {
      const [respFotos, respOcupacao] = await Promise.all([
        fetch(`api/fotografias.php?id=${ALOJAMENTO_ID}`),
        fetch(`api/ocupacao.php?id=${ALOJAMENTO_ID}`)
      ]);

      fotografias = (await respFotos.json()).fotografias || [];
      ocupacao = (await respOcupacao.json()).ocupacao || [];
    } catch (erro) {
      console.error("Erro ao carregar as fotografias:", erro);
      galeria.textContent = t("comum.erro_carregar");
    }

    desenharTudo();
  }

  // ---------- VISUALIZADOR ----------

  function mostrarFotografia() {
    const foto = fotografias[indiceAtual];

    if (!foto) return;

    const divisao = traduzirDivisao(foto.divisao);

    visualizadorImagem.src = foto.caminho;
    visualizadorImagem.alt = divisao;
    visualizadorLegenda.textContent = `${divisao} - ${indiceAtual + 1} / ${fotografias.length}`;
  }

  function abrirVisualizador(indice) {
    indiceAtual = indice;
    mostrarFotografia();
    visualizador.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function fecharVisualizador() {
    visualizador.hidden = true;
    document.body.style.overflow = "";
  }

  function mudarFotografia(passo) {
    if (fotografias.length === 0) return;

    indiceAtual = (indiceAtual + passo + fotografias.length) % fotografias.length;
    mostrarFotografia();
  }

  visualizador.querySelector(".visualizador-fechar").addEventListener("click", fecharVisualizador);
  visualizador.querySelector(".anterior").addEventListener("click", () => mudarFotografia(-1));
  visualizador.querySelector(".seguinte").addEventListener("click", () => mudarFotografia(1));

  // Fechar ao clicar fora
  visualizador.addEventListener("click", (evento) => {
    if (evento.target === visualizador) fecharVisualizador();
  });

  document.addEventListener("keydown", (evento) => {
    if (visualizador.hidden) return;

    if (evento.key === "Escape") fecharVisualizador();
    if (evento.key === "ArrowLeft") mudarFotografia(-1);
    if (evento.key === "ArrowRight") mudarFotografia(1);
  });

  // ---------- AVALIAÇÕES ----------

  const formAvaliacao = document.getElementById("formulario-avaliacao");
  const botoesEstrela = document.querySelectorAll("#estrelas button");
  const botaoEnviar = formAvaliacao.querySelector("button[type=submit]");
  const mensagemAvaliacao = document.getElementById("mensagem-avaliacao");
  let classificacao = 0;

  function desenharEstrelas() {
    botoesEstrela.forEach((botao) => {
      const cheia = Number(botao.dataset.valor) <= classificacao;
      botao.innerHTML = window.icone(cheia ? "estrela-cheia" : "estrela", "size-8");
    });

    botaoEnviar.disabled = classificacao === 0;
  }

  botoesEstrela.forEach((botao) => {
    botao.addEventListener("click", () => {
      classificacao = Number(botao.dataset.valor);
      desenharEstrelas();
    });
  });

  async function carregarAvaliacoes() {
    const lista = document.getElementById("lista-avaliacoes");
    const media = document.getElementById("media-avaliacoes");

    try {
      const resposta = await fetch(`api/avaliacoes.php?alojamento=${ALOJAMENTO_ID}`);
      const dados = await resposta.json();

      lista.replaceChildren(...dados.avaliacoes.map((avaliacao) => window.cartaoAvaliacao(avaliacao, false)));

      media.innerHTML = dados.total
        ? `<span class="inline-flex items-center gap-2">${window.icone("estrela-cheia", "size-5 text-[#b49468]")} ${dados.media.toLocaleString("pt-PT")} em 5 · ${dados.total} ${dados.total === 1 ? "avaliação" : "avaliações"}</span>`
        : "Ainda não há avaliações. Seja o primeiro a avaliar!";
    } catch (erro) {
      media.textContent = t("comum.erro_carregar");
    }
  }

  formAvaliacao.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    botaoEnviar.disabled = true;

    try {
      const resposta = await fetch("api/avaliacoes.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alojamento_id: ALOJAMENTO_ID,
          nome: document.getElementById("nome-avaliacao").value,
          classificacao,
          comentario: document.getElementById("comentario-avaliacao").value
        })
      });

      const dados = await resposta.json();

      mensagemAvaliacao.textContent = resposta.ok ? dados.mensagem : dados.erro;
      mensagemAvaliacao.className = resposta.ok ? "mt-3 text-sm text-[#1c5a2b]" : "mt-3 text-sm text-[#8a1c13]";
      mensagemAvaliacao.hidden = false;

        if (resposta.ok) {
        // Ligação para a página das avaliações
        const ligacao = document.createElement("a");
        ligacao.href = "avaliacoes.html";
        ligacao.className = "underline underline-offset-4 transition-colors hover:text-[#b49468]";
        ligacao.textContent = t("det.ver_avaliacoes");
        mensagemAvaliacao.append(" ", ligacao);

        formAvaliacao.reset();
        classificacao = 0;
        carregarAvaliacoes();
      }
    } catch (erro) {
      mensagemAvaliacao.textContent = t("comum.erro_carregar");
      mensagemAvaliacao.className = "mt-3 text-sm text-[#8a1c13]";
      mensagemAvaliacao.hidden = false;
    }

    desenharEstrelas();
  });

  desenharEstrelas();

  carregarAvaliacoes();  

  aoMudar(desenharTudo);
  carregar();
})();
