// app.js
// Usamos módulo ES para organização
// Regras: classe Aluno, array em memória, métodos com arrow functions, addEventListener

class Aluno {
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = Number(idade);
    this.curso = curso;
    this.notaFinal = Number(notaFinal);
  }

  isAprovado() {
    return this.notaFinal >= 7;
  }

  toString() {
    return `${this.nome} | ${this.idade} anos | ${this.curso} | Nota: ${this.notaFinal.toFixed(1)} | ${this.isAprovado() ? 'Aprovado' : 'Reprovado'}`;
  }
}

// Array que guarda os alunos em memória
let alunos = [];

// Elementos DOM
const form = document.getElementById('alunoForm');
const nomeEl = document.getElementById('nome');
const idadeEl = document.getElementById('idade');
const cursoEl = document.getElementById('curso');
const notaEl = document.getElementById('notaFinal');
const alunoIndexEl = document.getElementById('alunoIndex');

const tabelaBody = document.querySelector('#tabelaAlunos tbody');
const resultado = document.getElementById('resultado');

// Funções utilitárias (arrow functions)
const limparFormulario = () => {
  nomeEl.value = '';
  idadeEl.value = '';
  cursoEl.value = 'JavaScript';
  notaEl.value = '';
  alunoIndexEl.value = -1;
};

const renderTabela = () => {
  tabelaBody.innerHTML = ''; // limpa
  alunos.forEach((aluno, index) => {
    const tr = document.createElement('tr');

    const tdNome = document.createElement('td');
    tdNome.textContent = aluno.nome;
    tr.appendChild(tdNome);

    const tdIdade = document.createElement('td');
    tdIdade.textContent = aluno.idade;
    tr.appendChild(tdIdade);

    const tdCurso = document.createElement('td');
    tdCurso.textContent = aluno.curso;
    tr.appendChild(tdCurso);

    const tdNota = document.createElement('td');
    tdNota.textContent = aluno.notaFinal.toFixed(1);
    tr.appendChild(tdNota);

    const tdAprovado = document.createElement('td');
    tdAprovado.textContent = aluno.isAprovado() ? 'Sim' : 'Não';
    tr.appendChild(tdAprovado);

    const tdAcoes = document.createElement('td');
    tdAcoes.classList.add('actions');

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.title = 'Editar';
    btnEditar.addEventListener('click', () => editarAluno(index)); // função anônima p/ evento
    tdAcoes.appendChild(btnEditar);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.title = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirAluno(index));
    tdAcoes.appendChild(btnExcluir);

    tr.appendChild(tdAcoes);
    tabelaBody.appendChild(tr);
  });
};

// CRUD
const cadastrarOuEditar = (event) => {
  event.preventDefault(); // impede reload do form
  const nome = nomeEl.value.trim();
  const idade = idadeEl.value;
  const curso = cursoEl.value;
  const notaFinal = notaEl.value;

  if (!nome || !idade || notaFinal === '') {
    alert('Preencha todos os campos.');
    return;
  }

  const index = Number(alunoIndexEl.value);
  if (index >= 0) {
    // editar
    alunos[index] = new Aluno(nome, idade, curso, notaFinal);
    console.log('Aluno editado:', alunos[index].toString());
    alert('Aluno editado com sucesso!');
  } else {
    // cadastrar
    const novo = new Aluno(nome, idade, curso, notaFinal);
    alunos.push(novo);
    console.log('Aluno cadastrado:', novo.toString());
    alert('Aluno cadastrado com sucesso!');
  }

  limparFormulario();
  renderTabela();
};

const editarAluno = (index) => {
  const aluno = alunos[index];
  if (!aluno) return;
  nomeEl.value = aluno.nome;
  idadeEl.value = aluno.idade;
  cursoEl.value = aluno.curso;
  notaEl.value = aluno.notaFinal;
  alunoIndexEl.value = index;
  // mostrar feedback
  console.log('Editando aluno:', aluno.toString());
};

const excluirAluno = (index) => {
  if (!confirm('Confirma exclusão deste aluno?')) return;
  const removido = alunos.splice(index, 1)[0];
  console.log('Aluno excluído:', removido.toString());
  alert('Aluno excluído com sucesso!');
  renderTabela();
};

// Relatórios (filter, map, reduce, sort)
const listarAprovados = () => {
  const aprovados = alunos.filter(a => a.isAprovado());
  if (aprovados.length === 0) {
    resultado.textContent = 'Nenhum aluno aprovado.';
    return;
  }
  resultado.innerHTML = `<strong>Aprovados (${aprovados.length}):</strong><br>` +
    aprovados.map(a => a.toString()).join('<br>');
};

const mediaNotas = () => {
  if (alunos.length === 0) { resultado.textContent = 'Sem alunos para calcular média.'; return; }
  const soma = alunos.reduce((acc, a) => acc + a.notaFinal, 0);
  const media = soma / alunos.length;
  resultado.textContent = `Média das notas: ${media.toFixed(2)}`;
};

const mediaIdades = () => {
  if (alunos.length === 0) { resultado.textContent = 'Sem alunos para calcular média.'; return; }
  const soma = alunos.reduce((acc, a) => acc + a.idade, 0);
  const media = soma / alunos.length;
  resultado.textContent = `Média das idades: ${media.toFixed(2)} anos`;
};

const nomesOrdem = () => {
  if (alunos.length === 0) { resultado.textContent = 'Sem alunos.'; return; }
  const nomes = alunos.map(a => a.nome).sort((a,b) => a.localeCompare(b, 'pt-BR'));
  resultado.innerHTML = `<strong>Nomes em ordem alfabética:</strong><br>` + nomes.join('<br>');
};

const quantidadePorCurso = () => {
  if (alunos.length === 0) { resultado.textContent = 'Sem alunos.'; return; }
  const counts = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});
  resultado.innerHTML = `<strong>Quantidade por curso:</strong><br>` +
    Object.entries(counts).map(([curso, qtd]) => `${curso}: ${qtd}`).join('<br>');
};

const limparResultado = () => {
  resultado.textContent = '';
};

// Event listeners (addEventListener e funções anônimas / arrow functions)
form.addEventListener('submit', cadastrarOuEditar); // função nomeada
document.getElementById('btnLimpar').addEventListener('click', () => { limparFormulario(); });
document.getElementById('listarAprovados').addEventListener('click', () => listarAprovados());
document.getElementById('mediaNotas').addEventListener('click', () => mediaNotas());
document.getElementById('mediaIdades').addEventListener('click', () => mediaIdades());
document.getElementById('nomesOrdem').addEventListener('click', () => nomesOrdem());
document.getElementById('qtdPorCurso').addEventListener('click', () => quantidadePorCurso());
document.getElementById('limparRelatorio').addEventListener('click', () => limparResultado());

// Inicialização (se desejar, populate com exemplo)
const seed = () => {
  alunos.push(new Aluno('Ana Silva', 22, 'JavaScript', 8.5));
  alunos.push(new Aluno('Bruno Lima', 19, 'Python', 6.9));
  alunos.push(new Aluno('Carlos Rocha', 25, 'Java', 7.2));
  renderTabela();
};
seed();
