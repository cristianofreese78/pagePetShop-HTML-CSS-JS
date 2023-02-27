/* INJEÇÃO DE HTML NA TAG MAIN DO ARQUIVO INDEX.HTML */
async function injectContent() {
  let url = location.href; 
  file = url.split('='); 
  let view = (file[1] != undefined) ? file[1] : 'inicio'; 

  const resp = await fetch(`views/${view}.html`); 
  const html = await resp.text(); 

  let inject = document.getElementById('content'); 
  inject.innerHTML = html; //aplica a injeção de conteúdo no container de destino
}

// Injeção de conteúdo no corpo da página conforme o link escolhido na NavBar
injectContent();
