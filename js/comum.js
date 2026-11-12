// Ícones
window.icone = function (nome, classe) {
    return '<span class="icone icone-' + nome + ' ' + classe + '" aria-hidden="true"></span>';
};

// Estrelas
window.estrelas = function (quantas, tamanho) {
    let html = "";

    for (let i = 1; i <= 5; i++) {
        html += window.icone(i <= quantas ? "estrela-cheia" : "estrela", tamanho);
    }

    return html;
};

// Favoritos
window.favoritos = {
    lista: function () {
        try {
            return JSON.parse(localStorage.getItem("favoritos")) || [];
        } catch (erro) {
            return [];
        }
    },

    tem: function (id) {
        return this.lista().includes(Number(id));
    },

    alternar: function (id) {
        id = Number(id);
        let lista = this.lista();

        if (lista.includes(id)) {
            lista = lista.filter((item) => item !== id);
        } else {
            lista.push(id);
        }

        try {
            localStorage.setItem("favoritos", JSON.stringify(lista));
        } catch (erro) {}

        document.dispatchEvent(new Event("favoritos-mudaram"));
    }
};

// Cartão de alojamento

window.cartaoAlojamento = function (prefixo, alojamento) {
    const { t, plural } = window.idiomas;

    function criar(tag, classe, texto) {
        const el = document.createElement(tag);

        if (classe) el.className = classe;
        if (texto !== undefined) el.textContent = texto;

        return el;
    }

    const cartao = criar("article", prefixo + "-card group flex flex-col overflow-hidden rounded-3xl border border-[#e8e1d7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl");

    // Fotografia
    const caixaImagem = criar("div", prefixo + "-imagem relative h-64 overflow-hidden md:h-72");
    const imagem = document.createElement("img");

    imagem.src = alojamento.imagem;
    imagem.alt = alojamento.nome;
    imagem.loading = "lazy";
    imagem.className = "size-full object-cover transition duration-500 group-hover:scale-105";

    caixaImagem.appendChild(imagem);

    // Botão de favorito por cima da fotografia    
    const coracao = criar("button", "group/fav absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#14245d] shadow-md transition hover:scale-110 aria-pressed:text-[#c0392b]");
    coracao.type = "button";
    coracao.innerHTML = window.icone("coracao", "size-6");
    function atualizarCoracao() {
        const guardado = window.favoritos.tem(alojamento.id);
        coracao.setAttribute("aria-pressed", guardado);
        coracao.setAttribute("aria-label", guardado ? "Remover dos favoritos" : "Guardar nos favoritos");
    }

    coracao.addEventListener("click", function () {
        window.favoritos.alternar(alojamento.id);
        atualizarCoracao();
    });

    atualizarCoracao();
    caixaImagem.appendChild(coracao);

    // Informações
    const info = criar("div", prefixo + "-info flex grow flex-col px-6 pb-7 pt-6");

    // Nome e tipologia na mesma linha
    const cabecalho = criar("div", "cartao-cabecalho mb-4 flex items-center justify-between gap-3");


    function formatarNome(nome) {
        return nome
            .trim()

            // Corrigir nomes e abreviaturas
            .replace(/\bDra\.?\s+Ines\b/gi, "Dra. Inês")

            .replace(
                /^Quarto\s*[–-]\s*(\d+)\s+(\d+)\s+Andar\b/i,
                "Quarto $1 – $2.º andar"
            )

            .replace(
                /^Quarto\s*[–-]\s*(\d+)\s+Res\s+Do\s+Chao\b/i,
                "Quarto $1 – rés do chão"
            )

            // Outros alojamentos com indicação de andar
            .replace(/\b(\d+)\s+Andar\b/gi, "$1.º andar")

            // Rés do chão
            .replace(/\bRes\s+Do\s+Chao\b/gi, "rés do chão")

            // Frente mar
            .replace(/\bFrente\s+Mar\b/gi, "frente mar")

            // Uniformizar espaços e separadores
            .replace(/\s*[–-]\s*/g, " – ")
            .replace(/\s+/g, " ")
            .trim();
    }

    const nome = criar(
        "h3",
        "cartao-nome min-w-0 font-['Georgia',serif] text-2xl leading-snug text-[#14245d]",
        formatarNome(alojamento.nome)
    );


    const tipologia = criar(
        "span",
        "cartao-tipologia shrink-0 rounded-full bg-[#f2efe9] px-3 py-1.5 text-xs text-[#14245d]",
        alojamento.tipologia
    );

    cabecalho.append(nome, tipologia);
    info.appendChild(cabecalho);

    // Capacidade e quartos
    const detalhes = criar("div", prefixo + "-detalhes mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#666]");

    
    function criarDetalhe(icone, texto) {
        const elemento = criar("span", "cartao-detalhe inline-flex items-center gap-2");
        elemento.innerHTML = window.icone(icone, "size-[18px] text-[#14245d]");
        elemento.appendChild(criar("span", "", texto));

        return elemento;
    }



    detalhes.appendChild(
        criarDetalhe(
            "hospedes",
            plural("comum.hospedes", alojamento.capacidade)
        )
    );

    detalhes.appendChild(
        criarDetalhe(
            "quartos",
            plural("comum.quartos", alojamento.quartos)
        )
    );

    info.appendChild(detalhes);

    // Ligação para os detalhes
    const ligacao = criar(
        "a",
        "botao-detalhes mt-auto inline-flex w-fit items-center gap-2 border-b border-[#14245d] pb-1 text-xs tracking-wider text-[#14245d] transition-all hover:gap-3.5 hover:border-[#b49468] hover:text-[#b49468]",
        t("comum.ver_detalhes")
    );

    ligacao.href = "detalhes.html?id=" + alojamento.id;

    const seta = criar("span", "cartao-seta");
    seta.innerHTML = window.icone("seta", "size-4");
    seta.setAttribute("aria-hidden", "true");

    ligacao.appendChild(seta);
    info.appendChild(ligacao);

    cartao.append(caixaImagem, info);

    return cartao;
};

window.cartaoAvaliacao = function (avaliacao, comAlojamento) {
    const cartao = document.createElement("li");
    cartao.className = "flex flex-col gap-3 rounded-3xl border border-[#e8e1d7] bg-white p-6";

    const topo = document.createElement("div");
    topo.className = "flex items-center justify-between gap-3";

    const nome = document.createElement("strong");
    nome.className = "text-[#14245d]";
    nome.textContent = avaliacao.nome;

    const estrelas = document.createElement("span");
    estrelas.className = "flex shrink-0 gap-0.5 text-[#b49468]";
    estrelas.innerHTML = window.estrelas(avaliacao.classificacao, "size-5");
    estrelas.setAttribute("aria-label", avaliacao.classificacao + " em 5 estrelas");

    topo.append(nome, estrelas);
    cartao.appendChild(topo);

    if (comAlojamento) {
        const ligacao = document.createElement("a");
        ligacao.href = "detalhes.html?id=" + avaliacao.alojamento_id;
        ligacao.className = "w-fit text-sm text-[#1d2d78] underline underline-offset-4 transition-colors hover:text-[#b49468]";
        ligacao.textContent = avaliacao.alojamento_nome;
        cartao.appendChild(ligacao);
    }

    if (avaliacao.comentario) {
        const texto = document.createElement("p");
        texto.className = "leading-relaxed text-[#687583]";
        texto.textContent = avaliacao.comentario;
        cartao.appendChild(texto);
    }

    const data = document.createElement("span");
    data.className = "text-xs text-[#999]";
    data.textContent = new Date(avaliacao.criado_em).toLocaleDateString("pt-PT");
    cartao.appendChild(data);

    return cartao;
};

document.addEventListener("DOMContentLoaded", function () {

    // Esconder a ligação da página atual
    const caminhoAtual =
        location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("header nav a").forEach(function (link) {

        if (link.closest(".logo")) {
            return;
        }

        const caminhoLink =
            new URL(link.href).pathname.split("/").pop() || "index.html";

        if (caminhoLink === caminhoAtual) {
            link.hidden = true;
        } else {
            link.hidden = false;
        }
    });


    // Abrir e fechar o menu de idiomas
    const botaoIdioma = document.getElementById("botao-idioma");
    const opcoesIdioma = document.getElementById("opcoes-idioma");

    if (botaoIdioma && opcoesIdioma) {

        botaoIdioma.addEventListener("click", function (evento) {
            evento.stopPropagation();

            const aberto = opcoesIdioma.classList.toggle("aberto");

            botaoIdioma.setAttribute("aria-expanded", aberto);
        });


        // Fechar o menu ao clicar fora dele
        document.addEventListener("click", function (evento) {

            if (!evento.target.closest(".seletor-idioma")) {
                opcoesIdioma.classList.remove("aberto");

                botaoIdioma.setAttribute("aria-expanded", "false");
            }
        });


        // Alterar o idioma selecionado
        opcoesIdioma.querySelectorAll("[data-idioma]").forEach(function (botao) {

            botao.addEventListener("click", function () {
                const idioma = botao.dataset.idioma;

                opcoesIdioma.classList.remove("aberto");

                botaoIdioma.setAttribute("aria-expanded", "false");

                if (
                    window.idiomas &&
                    typeof window.idiomas.mudar === "function"
                ) {
                    window.idiomas.mudar(idioma);
                } else {
                    console.warn("Não foi possível alterar o idioma.");
                }
            });
        });
    }
});