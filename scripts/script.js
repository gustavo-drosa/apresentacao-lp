"use strict";

// 01. Menu Mobile
function inicializarMenuMobile() {
  const menuMobile = document.querySelector(".menu-mobile");

  if (menuMobile) {
    const botaoMenu = menuMobile.querySelector(".menu-mobile-botao");

    // Fecha ao clicar em qualquer link e move o foco para a seção de destino
    menuMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuMobile.removeAttribute("open");
        const destino = document.querySelector(link.getAttribute("href"));
        if (destino) {
          destino.setAttribute("tabindex", "-1");
          destino.focus({ preventScroll: true });
        }
      });
    });

    // Fecha ao clicar em qualquer lugar fora do menu
    document.addEventListener("click", (evento) => {
      if (!menuMobile.contains(evento.target)) {
        menuMobile.removeAttribute("open");
      }
    });

    // Fecha ao apertar a tecla ESC e devolve o foco para o botão de abrir
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menuMobile.open) {
        menuMobile.removeAttribute("open");
        if (botaoMenu) botaoMenu.focus();
      }
    });
  }
}

// 02. Ano automático do rodapé
function atualizarAnoRodape() {
  const anoRodape = document.querySelector("[data-ano]");
  if (anoRodape) {
    const anoAtual = new Date().getFullYear();
    anoRodape.textContent = anoAtual;
    if (anoRodape.tagName.toLowerCase() === "time") {
      anoRodape.setAttribute("datetime", String(anoAtual));
    }
  }
}

// 03. Barra de Progresso de Leitura
function inicializarProgresso() {
  const barraProgresso = document.querySelector("#progresso-leitura");
  if (!barraProgresso) return;

  function atualizarProgresso() {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    const progresso =
      altura > 0 ? Math.min(1, Math.max(0, window.scrollY / altura)) : 0;
    barraProgresso.style.transform = `scaleX(${progresso})`;
  }

  window.addEventListener("scroll", atualizarProgresso, { passive: true });
  window.addEventListener("resize", atualizarProgresso);
  window.addEventListener("load", atualizarProgresso);
  atualizarProgresso();

  if ("ResizeObserver" in window) {
    const observadorTamanho = new ResizeObserver(atualizarProgresso);
    observadorTamanho.observe(document.body);
  }
}

// 04. Clipboard API: copia o e-mail e fornece feedback
function inicializarCopiaEmail() {
  const botaoCopiar = document.querySelector("#copiar-email");
  const linkEmail = document.querySelector(
    '.canais-contato a[href^="mailto:"]',
  );
  const feedback = document.querySelector("#feedback-copia");

  if (!botaoCopiar || !linkEmail || !feedback) return;

  botaoCopiar.addEventListener("click", async () => {
    const email = linkEmail.getAttribute("href").replace("mailto:", "");
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = "E-mail copiado!";

      setTimeout(() => {
        feedback.textContent = "";
      }, 3000);
    } catch {
      feedback.textContent = `A cópia automática não está disponível. Selecione e copie: ${email}`;
    }
  });
}

// 05. Demonstração de formulário: valida dados e prepara um rascunho de e-mail
function inicializarFormulario() {
  const formulario = document.querySelector("#form-contato");
  if (!formulario) return;

  const campos = [...formulario.querySelectorAll("input, select, textarea")];
  const feedback = document.querySelector("#feedback-formulario");
  const abrirRascunho = document.querySelector("#abrir-rascunho");
  const botaoPreparar = formulario.querySelector('[type="submit"]');

  formulario.noValidate = true;
  if (botaoPreparar) botaoPreparar.disabled = false;

  function validarCampo(campo) {
    let mensagemErro = "";
    const valor = campo.value.trim();

    if (!valor) {
      mensagemErro =
        campo.tagName === "SELECT"
          ? "Selecione um assunto."
          : "Preencha este campo; somente espaços não são aceitos.";
    } else if (campo.type === "email" && campo.validity.typeMismatch) {
      mensagemErro = "Informe um e-mail válido, como nome@exemplo.com.";
    } else if (campo.maxLength > 0 && campo.value.length > campo.maxLength) {
      mensagemErro = `Use no máximo ${campo.maxLength} caracteres.`;
    } else if (!campo.validity.valid) {
      mensagemErro = "Confira o valor informado neste campo.";
    }

    const erro = document.querySelector(`#erro-${campo.id}`);
    if (erro) {
      erro.textContent = mensagemErro;
      erro.hidden = mensagemErro === "";
    }
    campo.setAttribute("aria-invalid", String(mensagemErro !== ""));
    return mensagemErro === "";
  }

  campos.forEach((campo) => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (abrirRascunho) {
        abrirRascunho.hidden = true;
        abrirRascunho.removeAttribute("href");
      }
      if (feedback) feedback.hidden = true;
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (abrirRascunho) {
      abrirRascunho.hidden = true;
      abrirRascunho.removeAttribute("href");
    }
    const camposInvalidos = campos.filter((campo) => !validarCampo(campo));
    if (feedback) feedback.hidden = false;

    if (camposInvalidos.length > 0) {
      if (feedback) {
        feedback.dataset.tipo = "erro";
        feedback.textContent =
          "Revise os campos indicados. Nenhuma mensagem foi enviada.";
      }
      camposInvalidos[0].focus();
      return;
    }

    const dados = new FormData(formulario);
    const nome = dados.get("nome").trim();
    const email = dados.get("email").trim();
    const assunto = dados.get("assunto").trim();
    const mensagem = dados.get("mensagem").trim();
    const titulo = `Contato pelo portfólio — ${assunto}`;
    const corpo = [`Nome: ${nome}`, `E-mail: ${email}`, "", mensagem].join(
      "\n",
    );

    if (abrirRascunho) {
      abrirRascunho.href = `${formulario.action}?subject=${encodeURIComponent(
        titulo,
      )}&body=${encodeURIComponent(corpo)}`;
      abrirRascunho.hidden = false;
    }
    if (feedback) {
      feedback.dataset.tipo = "orientacao";
      feedback.textContent =
        "Rascunho preparado! Clique no botão abaixo para abrir seu e-mail e enviar:";
    }
  });
}

// Inicialização única de todas as funções
document.documentElement.classList.add("js");
inicializarMenuMobile();
atualizarAnoRodape();
inicializarProgresso();
inicializarCopiaEmail();
inicializarFormulario();
