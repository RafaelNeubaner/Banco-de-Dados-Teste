logged = document.getElementById("logged");
url = window.location.href;

if (document.getElementById("formCadastro")) {
  const formCadastro = document.getElementById("formCadastro");
  formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
    };

    const resposta = await fetch(
      "https://slush-dude-tackle.ngrok-free.dev/cadastrar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
         },
        body: JSON.stringify(dados),
      },
    );
    const response = await resposta.json();
    if (resposta.ok) {
      alert(`${response.mensagem}`);
      formCadastro.reset();
    } else {
      alert(`${response.erro}`);
    }
  });
}

document
  .getElementById("formLogin")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = document.getElementById("lemail").value;
    const senha = document.getElementById("lsenha").value;
    const dados = {
      email: email,
      senha: senha,
    };

    const resposta = await fetch(
      "https://slush-dude-tackle.ngrok-free.dev/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(dados),
      },
    );
    const response = await resposta.json();
    if (resposta.ok) {
      localStorage.setItem("usuario", JSON.stringify(response));
      const dadosLogin = JSON.parse(localStorage.getItem("usuario"));
      console.log(localStorage.getItem("usuario"));
      logged.classList.remove("hidden");
      altnome = document.getElementById("altnome");
      altemail = document.getElementById("altemail");
      altsenha = document.getElementById("altsenha");
      listUser();
      const resposta2 = await fetch(
        `https://slush-dude-tackle.ngrok-free.dev/dados?id=${encodeURIComponent(dadosLogin.usuario.id)}`,
      {headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        }}
      );
      if (resposta2.ok) {
        const usuario = await resposta2.json();
        altnome.value = usuario.nome;
        altemail.value = usuario.email;
        altsenha.value = usuario.senha;
        console.log(usuario);
      } else {
        alert("Erro ao buscar os dados do usuário.");
      }
    } else {
      alert(`${response.erro}`);
    }
  });

document
  .getElementById("formAlterarDados")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("altnome").value;
    const email = document.getElementById("altemail").value;
    const senha = document.getElementById("altsenha").value;
    const dados = {
      nome: nome,
      email: email,
      senha: senha,
      id: JSON.parse(localStorage.getItem("usuario")).usuario.id,
    };
    console.log(dados);
    const resposta = await fetch("https://slush-dude-tackle.ngrok-free.dev/alterar", {
      method: "POST",
      headers: { "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" },
      body: JSON.stringify(dados),
    } );
    
    const response = await resposta.json();
    if (resposta.ok) {
      alert( `${response.mensagem}` );
      listUser();
    } else {
      alert(`${response.erro}`);
    }
  });

async function listUser() {
  const tabela = document.getElementById("usuariosContainer");
  const totalUsuarios = document.getElementById("totalUsuarios");
  let contador = 0;
  const response = await fetch( "https://slush-dude-tackle.ngrok-free.dev/usuarios"
    ,{headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        }}
  );
  if (!response.ok) {
    alert("Erro ao buscar a lista de usuários.");
    return;
  }
  const userList = await response.json();
  tabela.innerHTML = "";
  for (const user of userList) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td><button class="excluir" data-id="${user.id}">Excluir</button></td>
    `;
    tabela.appendChild(linha);
    contador++;
  }
  totalUsuarios.textContent = contador;
  console.log(contador);
  const botoesExcluir = document.querySelectorAll(".excluir");
  for (const botao of botoesExcluir) {
    botao.addEventListener("click", async () => {
      const id = botao.getAttribute("data-id");
      const resposta = await fetch(`https://slush-dude-tackle.ngrok-free.dev/usuarios/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        method: "DELETE",
      });
      if (resposta.ok) {
        alert("Usuário excluído com sucesso!");
        listUser();
      } else {
        alert("Deu algum erro ao excluir o usuário.");
      }
    });
  }
}
