import { auth } from '../../lib/authfirebase.js';
import {
  dataBase, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, where, updateDoc, orderBy, serverTimestamp, Timestamp
} from '../../lib/firestore.js';

export default () => {
  const container = document.createElement('div');
  const user = auth.currentUser;
  const userId = user.uid;
  const userEmail = user.email;

  console.log(user);
  console.log(userId);
  console.log(userEmail);

  // liga o banco de dados e diz qual banco usar(nome do banco entre aspas)
  const collectionName = collection(dataBase, 'posts');

  // // //Queries traz todos posts de todos usuarios
  const queryAllPosts = query(collectionName, /*where('user.userId', '==', userId),*/ orderBy('data', 'asc'));

  //Query traz post de um user só
  const queryPosts = query(collectionName, where('user.userId', '==', userId), orderBy('data', 'asc'));

  const template = `
    <h1> MEU FEED</h1>
    <textarea id="inputPost" type="text"> </textarea>
    <button id="submitPost" > Postar </button>  

    <ul id="feed"></ul>

    <button id="logout"> Sair</button>
    `;

  container.innerHTML = template;

  container.querySelector('#logout').addEventListener('click', logout);
  container.querySelector('#submitPost').addEventListener('click', () => {
    const postMessage = container.querySelector('#inputPost').value;
    let date = Timestamp.now()

    console.log(date)
    showPostOnFeed(userId, postMessage, date);

  });

  // adiciona os novos posts na area do feed dentro da ul
  function showPostOnFeed(userId, postMessage, date, id) {
    const feed = container.querySelector('#feed');
    date = date.toDate();
    let templatePost = ""

    if (userId == user.uid) {

      templatePost = `
      <li class="post" style="display:block" id="">
        <div class="show-post" post-id="${id}" style="display:block">
          <p post-id="${id}" clas="userId"> Usuário: ${userId} </p>
          <p post-id="${id}" class="messageContent">Mensagem: ${postMessage}</p>
           <p post-id="${id}" class="date">Data: ${date.toLocaleString("pt-BR")} </p>
          <button post-id="${id}" class="likePost">Curtir </button>
          <button post-id="${id}" class="editPost">Editar</button>
          <button post-id="${id}" class="deletePost">Deletar</button>
        </div>
          <form class="edit-form" post-id="${id}" style="display: none;"> 
            <textarea post-id="${id}" class="edit-text" type="text">${postMessage}</textarea>
            <button post-id="${id}" class="save" > Salvar </button>  
            <button post-id="${id}" class="cancel">Cancelar</button>

          </form>
      </li>
    `;
    } else {
      templatePost = `
      <li class="post" style="display:block" id="">
        <div class="show-post" post-id="${id}" style="display:block">
          <p post-id="${id}" clas="userId"> Usuário: ${userId} </p>
          <p post-id="${id}" class="messageContent">Mensagem: ${postMessage}</p>
           <p post-id="${id}" class="date">Data: ${date.toLocaleString("pt-BR")} </p>
          <button post-id="${id}" class="likePost">Curtir </button>
        </div>
      </li>`

    }

    feed.innerHTML = templatePost + feed.innerHTML;

    //Ouve botao de editar
    const btn = container.querySelectorAll('.editPost')
    if (btn) {
      btn.forEach(button => {
        button.addEventListener('click', event => {
          console.log('btn clicked');
          showEditPost(button)
        })
      })

    }

    //ouve botao salvar post editado
    const btnSave = container.querySelectorAll('.save')
    if (btnSave) {
      btnSave.forEach(button => {
        let postId = button.getAttribute('post-id')
        const edit = container.querySelector('.edit-form[post-id="' + postId + '"]')
        const postFeed = container.querySelector('.show-post[post-id="' + postId + '"]')

        button.addEventListener('click', event => {
          console.log('btn clicked');

          if (edit.style.display == 'block') {

            editForm(postId)
            edit.style.display = "none"
            postFeed.style.display = "block"

          } else {
            edit.style.display = "block"
            postFeed.style.display = "none"
          }

        })
      })

    }

    const btnCancel = container.querySelectorAll('.cancel')
    if (btnCancel) {
      btnCancel.forEach(button => {
        let postId = button.getAttribute('post-id')
        const edit = container.querySelector('.edit-form[post-id="' + postId + '"]')
        const postFeed = container.querySelector('.show-post[post-id="' + postId + '"]')

        button.addEventListener('click', event => {
          console.log('btn clicked');

          if (edit.style.display == 'block') {
            edit.style.display = "none"
            postFeed.style.display = "block"

          } else {
            edit.style.display = "block"
            postFeed.style.display = "none"
          }

        })
      })

    }
  }

  //mostra e esconde o form de editar post
  function showEditPost(button) {
    let postId = button.getAttribute('post-id')

    console.log(button)
    const edit = container.querySelector('.edit-form[post-id="' + postId + '"]')
    console.log(edit)
    const postFeed = container.querySelector('.show-post[post-id="' + postId + '"]')

    const btnCancel = container.querySelector('.cancel[post-id="' + postId + '"]')

    if (edit.style.display == 'none') {
      edit.style.display = "block"
      postFeed.style.display = "none"
    } else {
      edit.style.display = "none"
      postFeed.style.display = "block"
    }

  }

  //Edita o conteudo do post
  function editForm(postId) {
    let newText = container.querySelector('.edit-text[post-id="' + postId + '"]')
    let newDate = container.querySelector('.date[post-id="' + postId + '"]')
    const btnCancel = container.querySelector('.cancel[post-id="' + postId + '"]')
    let postText = container.querySelector('.messageContent[post-id="' + postId + '"]')
    let date = Timestamp.now()
    date = date.toDate();

    postText.textContent = ""
    newText = newText.value
    postText.textContent = newText

    newDate.textContent = ""
    date = date.toLocaleString('pt-BR')
    newDate.textContent = date
    console.log(postText)


    //manda para banco post editado
    let collectionUpdate = doc(dataBase, "posts", postId)
    updateDoc(collectionUpdate, {
      mensagem: newText,
      data: new Date()
    });
  }

  // deslogar do app
  function logout() {
    auth.signOut().then(() => {
      // alert('usuario deslogou');
      window.location.href = '#';
    });
  }

  // consulta os dados do banco de dados
  async function readDocument() {
    await getDocs(queryAllPosts)
      .then((snapshot) => {
        // console.log(snapshot.docs)
        //   let postsList = []
        snapshot.docs.forEach((doc) => {
          console.log(doc.id)
          showPostOnFeed(doc.data().user.userId, doc.data().mensagem, doc.data().data, doc.id);
          //     postsList.push({...doc.data(), id: doc.id})

        });

      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  readDocument();

  // ADD documentos posts no banco
  container.querySelector('#submitPost').addEventListener('click', (e) => {
    e.preventDefault();
    const addPost = container.querySelector('#inputPost');
    const date = new Date();
    console.log(date);
    addDoc(collectionName, {
      data: date,
      mensagem: addPost.value,
      user: {
        userId: user.uid,
        photUrl: user.photoURL,
      },
    })
      .then(() => {
        const addPost = container.querySelector('#inputPost');
        addPost.value = '';
      });
  });

  // Coleta de dados em real time
  // onSnapshot(collectionName, (snapshot) => {
  //   let postsList = []
  //   snapshot.docs.forEach((doc) => {
  //     postsList.push({ ...doc.data(), id: doc.id  })
  //   });
  //   console.log(postsList)

  // })

  // async function readDocument(){
  //   const mySnapshot = await getDoc(nomedocumento);
  //   if(mySnapshot.exists()){
  //     const docData = mySnapshot.data()
  //     console.log(`dados: ${JSON.stringify(docData)}`)
  //   }
  // }



  return container;
};
