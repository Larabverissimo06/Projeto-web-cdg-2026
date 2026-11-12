const botao = document.querySelector('#menu-botao');
const menu = document.querySelector('#menu-principal');
const icone = document.querySelector('#menu-icone');

function abrirMenu() {
  menu.classList.replace('hidden', 'flex');
  botao.setAttribute('aria-expanded', 'true');
  icone.className = 'icone icone-fechar size-6';
  document.body.classList.add('overflow-hidden');
}

function fecharMenu() {
  menu.classList.replace('flex', 'hidden');
  botao.setAttribute('aria-expanded', 'false');
  icone.className = 'icone icone-menu size-6';
  document.body.classList.remove('overflow-hidden');
}

botao.addEventListener('click', () => {
  if (botao.getAttribute('aria-expanded') === 'true') {
    fecharMenu();
  } else {
    abrirMenu();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
    fecharMenu();
    botao.focus();
  }
});

window.matchMedia('(min-width: 1024px)').addEventListener('change', (evento) => {
  if (evento.matches) {
    fecharMenu();
  }
});