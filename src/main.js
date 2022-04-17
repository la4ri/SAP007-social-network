import { myFunction } from './lib/index.js';
// eslint-disable-next-line
import { auth, loggedIn } from "../../lib/authfirebase.js";

import home from './pages/home';
import login from './pages/login';
import feed from './pages/feed';

myFunction();

const main = document.querySelector('#root');

function redirect() {
  switch (window.location.hash) {
    // case ' ':
    //   main.appendChild(home());
    //   break;
    case '#login':
      main.appendChild(login());
      break;
    case '#feed':

      loggedIn((logged) => {
        if (logged) {
          main.appendChild(feed());
        } else window.location.hash = '#home';
      });

      break;
    default:
      main.appendChild(home());
  }
}

const init = () => {
  window.addEventListener('hashchange', () => {
    main.innerHTML = '';
    redirect();
  });
};

window.addEventListener('load', () => {
  redirect();
  init();
});

// DESLOGAR O USUARIO
export function logout() {
  auth.signOut().then(() => {
    window.location.hash = '';
  }).catch(() => {
    alert('Erro ao fazer logout');
  });
}
