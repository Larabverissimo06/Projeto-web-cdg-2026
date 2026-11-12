// Alojamentos em destaque na página inicial.
(function () {
  const grelha = document.getElementById("destaques-grid");
  let alojamentos = [];

  const idsDestaque = [70, 42, 66];

  // Coração dos favoritos nos cartões fixos
  [...grelha.children].forEach((cartao) => {
    const caixaImagem = cartao.firstElementChild;
    caixaImagem.classList.add("relative");
    caixaImagem.appendChild(window.botaoFavorito(Number(cartao.dataset.id)));
  });

  function desenhar() {
    // Sem dados: ficam os cartões fixos
    if (alojamentos.length === 0) return;

    grelha.replaceChildren();

    const destaques = idsDestaque
      .map((id) => alojamentos.find((alojamento) => alojamento.id === id))
      .filter(Boolean);

    destaques.forEach((alojamento) => {
      grelha.appendChild(window.cartaoAlojamento("destaque", alojamento));
    });
  }

  fetch("api/alojamentos.php")
    .then((resposta) => resposta.json())
    .then((dados) => {
      alojamentos = dados.alojamentos || [];
      desenhar();
    })
    .catch((erro) => console.error("Erro ao carregar os destaques:", erro));

  window.idiomas.aoMudar(desenhar);
})();