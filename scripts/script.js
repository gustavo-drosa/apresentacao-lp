"use strict";

// 01. Fecha o menu mobile após a escolha de um link ou clique fora dele.
function inicializarMenuMobile() {
  // Conceitos: seleção do DOM, eventos e foco. O elemento details já abre e fecha
  // sem JavaScript; aqui acrescentamos formas convenientes de fechá-lo.

  const menuMobile = document.querySelector(".menu-mobile");

  if (menuMobile) {
    const botaoMenu = menuMobile.querySelector(".nav__menu-btn");

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

    document.addEventListener("click", (evento) => {
      if (!menuMobile.contains(evento.target)) {
        menuMobile.removeAttribute("open");
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menuMobile.open) {
        menuMobile.removeAttribute("open");
        botaoMenu.focus();
      }
    });
  }
}

document.documentElement.classList.add("js");
inicializarMenuMobile();
