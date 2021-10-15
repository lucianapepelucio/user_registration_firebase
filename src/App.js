import React from 'react';
import { useState } from 'react';
import './style.css';
import firebase from './firebaseConnection';

function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cargo, setCargo] = useState('');
    const [nome, setNome] = useState('');

    const [user, setUser] = useState({});

    async function novoUsuario(){
      await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
          await firebase.firestore().collection('users')
          .doc(value.user.uid)
          .set({
            nome: nome,
            cargo: cargo,
            status: true
          })
          .then(() => {
            setNome('');
            setCargo('');
            setEmail('');
            setSenha('');
          })
          .catch(() => {
             alert('Ocorreu um erro no cadastro do usuário');
          })
      })
      .catch((error) => {
          if(error.code === 'auth/weak-password'){
             alert('Senha fraca!');
             setEmail('');
             setSenha('');
          } else if(error.code === 'auth/email-already-in-use'){
             alert('Esse e-mail já foi cadastrado!');
             setEmail('');
             setSenha('');
          }
      })
    }

    async function logout(){
      await firebase.auth().signOut()
      setUser({});
      setEmail('');
      setSenha('');
    }

    async function login(){
      await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then( async (value) => {
         await firebase.firestore().collection('users')
         .doc(value.user.uid)
         .get()
         .then((snapshot) => {
            setUser({
              nome: snapshot.data().nome,
              cargo: snapshot.data().cargo,
              status: snapshot.data().status,
              email: value.user.email
            });
         })
         .catch((error) => {
          console.log('Ocorreu um erro ao buscar as informações!' + error);
         })
      })
      .catch((error) => {
         console.log('Ocorreu um erro ao logar!' + error);
      })

    }

  return (
    <div>
        <h1>React JS + Firebase</h1> <br/>

        <div className="container">
          <label>Nome: </label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
          <label>Cargo: </label>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)}/>
          <label>Email: </label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label>Senha: </label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/> <br/>
          
         <button onClick={ login }>Fazer Login</button>
         <button onClick={ novoUsuario }>Cadastrar</button>
         <button onClick={ logout }>Sair da Conta</button> 
        </div>

        <hr/> <br/>

        {Object.keys(user).length > 0 && (
          <div>
             <strong>Olá, </strong> {user.nome} <br/>
             <strong>Cargo: </strong> {user.cargo} <br/>
             <strong>Email: </strong> {user.email} <br/>
             <strong>Status: </strong> {user.status ? 'Ativo' : 'Desativado'} <br/>
          </div>
        )}
    </div>
  );
}

export default App;
