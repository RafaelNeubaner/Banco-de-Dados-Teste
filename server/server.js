const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const API = express();
API.use(cors()); // Permite que o seu HTML acesse esta API
API.use(express.json()); // Permite entender os dados do formulário

const pool = new Pool({
  user: 'postgres', 
  host: '192.168.1.84',
  database: 'PDCase',
  password: 'postgres',
  port: 5432,
});

API.post('/cadastrar', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
    await pool.query(query, [nome, email, senha]);
    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
  } catch (erro) {
    console.error( erro );
    if (erro.code === '23505') {
      res.status(400).json({ erro: 'Email já cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

API.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND senha = $2';
    const resultado = await pool.query(query, [email, senha]);
    if (resultado.rows.length > 0) {
      res.status( 200 ).json( {
        mensagem: 'Login realizado com sucesso!' ,
        usuario: resultado.rows[ 0 ],
      } );
    } else {
      res.status(401).json({ erro: 'Credenciais inválidas.' });
    }
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

API.get('/dados', (req, res) => {
  const id = req.query.id;
  pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (erro, resultado) => {
    if (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro no servidor.' });
    } else {
      res.status(200).json(resultado.rows[0]);
    }
  });
});

API.post('/alterar', async (req, res) => {
  const { nome, email, senha, id } = req.body;
  try {
    const query = 'UPDATE usuarios SET nome = $1, senha = $2, email = $3 WHERE id = $4';
    await pool.query(query, [nome, senha, email, id]);
    res.status(200).json({ mensagem: 'Dados alterados com sucesso!' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

API.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
} );

API.delete('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

API.listen(3000, () => {
  console.log('Servidor Back-end rodando em http://localhost:3000');
});