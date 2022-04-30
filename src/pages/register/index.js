import {
  auth, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, updateName,
} from '../../lib/authfirebase.js';

export default () => {
  const container = document.createElement('div');
  container.classList.add('login-container');

  const createAccount = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userName = document.getElementById('name').value;
    console.log(userName);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      window.location.href = '#feed';
      alert('usuario criado e logado');

      const user = auth.currentUser;

      updateName(user, userName);
    } catch (error) {
      alert(getErrorMessage(error));
      const errorCode = error.code;
      console.log(errorCode);
    }
  };

  const template = `
    <div class="music-container">
    </div>
    <div class = "DEUS">
      <div class="logo-container">
      <img class="logo" src="/pages/style/logo.png">
      </div>
        <div class="form">
        <div class="error" id="email-required-error">Email é obrigatório</div>
        <div class="error" id="email-invalid-error">Ops, email inválido</div>
        <div class="error" id="password-required-error">Ops, senha inválida</div>
        <div class="error" id="user-invalid-error">Usuário inválido!</div>
        <input class="control" type="text" placeholder="Usúario" id="name" required></input>
        <input class="control" type="email" placeholder="Email" id="email" required></input>
        <input class="control" type="password" placeholder="Senha" id="password" required></input>
        <button class="botao" id="bt-register" disable="true">Cadastre-se</button>
        <p class="text-center">OU</p>
        <button class="botao" id="bt-google">Acesse pelo Google</button>
      </div>
      </div>
      `;

  container.innerHTML = template;

  // AUTENTICAÇÃO VIA GOOGLE
  const provider = new GoogleAuthProvider();
  function loginGoogle() {
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.href = '#feed';
        alert('usuario logado');
      })
      .catch((error) => {
        alert(getErrorMessage(error));
      });
  }

  const form = {
    registerButton: () => document.getElementById('bt-register'),
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    password: () => document.getElementById('password'),
    userInvalidError: () => document.getElementById('user-invalid-error'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    user: () => document.getElementById('name'),

  };

  // validador do email
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  function isEmailValid() {
    const email = form.email().value;
    if (!email) {
      return false;
    }
    return validateEmail(email);
  }

  // validador de usuário
  function validateUser(user) {
    return /^[a-zA-Z0-9_]+$/.test(user);
  }
  function isUserValid() {
    const user = form.user().value;
    if (!user) {
      return false;
    }
    return validateUser(user);
  }

  // Mensagens de erro
  function getErrorMessage(error) {
    if (error.code === 'auth/user-not-found') {
      return 'Usúario não encontrado';
    }
    if (error.code === 'auth/wrong-password') {
      return 'Senha Incorreta';
    }
    if (error.code === 'auth/internal-error') {
      return 'Verifique se você preencheu todos os campos e tente novamente!';
    }
    if (error.code === 'auth/invalid-email') {
      return 'Email invalido, tente novamente!';
    }
    if (error.code === 'auth/popup-closed-by-user') {
      return 'Não foi possivel acessar o Gmail, tente novamente!';
    }
    if (error.code === 'auth/missing-email') {
      return 'Digite um email valido';
    }
    if (error.code === 'auth/email-already-in-use') {
      return 'Já existe uma conta criada com este email';
    }
    if (error.code === 'auth/weak-password') {
      return 'Sua senha precisa ter pelo menos 6 caracteres';
    }
  }

  // // mensagens de erro UserName
  function userErrors() {
    const userName = form.user().value;
    if (!userName) {
      form.userInvalidError().style.display = 'block';
    } else {
      form.userInvalidError().style.display = 'none';
    }
  }

  // mensagens de erro Email
  function emailErrors() {
    const email = form.email().value;
    if (!email) {
      form.emailRequiredError().style.display = 'block';
    } else {
      form.emailRequiredError().style.display = 'none';
    }
    if (validateEmail(email)) {
      form.emailInvalidError().style.display = 'none';
    } else {
      form.emailInvalidError().style.display = 'block';
    }
  }

  // mensagens de erro Password
  function passawordErrors() {
    const password = form.password().value;
    if (!password) {
      form.passwordRequiredError().style.display = 'block';
    } else {
      form.passwordRequiredError().style.display = 'none';
    }
  }

  function buttonsDisable() {
    const emailValid = isEmailValid();
    const userValid = isUserValid();
    form.registerButton().disabled = !emailValid || !userValid;
  }

  function onchangeEmail() {
    buttonsDisable();
    emailErrors();
  }

  function onchangePassword() {
    buttonsDisable();
    passawordErrors();
  }
  function onchangeUser() {
    buttonsDisable();
    userErrors();
  }

  container.querySelector('#password').addEventListener('change', onchangePassword);
  container.querySelector('#email').addEventListener('change', onchangeEmail);
  container.querySelector('#name').addEventListener('change', onchangeUser);
  container.querySelector('#bt-google').addEventListener('click', loginGoogle);
  container.querySelector('#bt-register').addEventListener('click', createAccount);

  return container;
};
