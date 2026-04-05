// Selecionando elementos do DOM
const form = document.getElementById('formAluguel');
const resultado = document.getElementById('resultado');
const listaAlugueis = document.getElementById('listaAlugueis');
const busca = document.getElementById('busca');

// Carrega dados salvos no localStorage
let alugueis = JSON.parse(localStorage.getItem('alugueis')) || [];
console.log("Dados carregados do localStorage:", alugueis);

// Função para renderizar a lista de aluguéis
function atualizarLista(filtro = '') {
  listaAlugueis.innerHTML = '';

  alugueis
    .filter(item => item.categoria.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.categoria} - ${item.dias} dias - Total: R$${item.total}</span>
        <div>
          <button onclick="editarAluguel(${index})">Editar</button>
          <button onclick="removerAluguel(${index})">Excluir</button>
        </div>
      `;
      listaAlugueis.appendChild(li);
    });

  console.log("Lista atualizada. Total de registros:", alugueis.length);
}

// Evento de busca (filtragem dinâmica)
busca.addEventListener('input', (e) => {
  const termo = e.target.value;
  console.log(`Filtrando resultados por: "${termo}"`);
  atualizarLista(termo);
});

// Evento principal do formulário
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const carro = document.getElementById('carro').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;

  // Validação
  if (!carro || !checkin || !checkout) {
    alert('Preencha todos os campos!');
    console.warn("Tentativa de envio com campos vazios.");
    return;
  }

  const dataCheckin = new Date(checkin);
  const dataCheckout = new Date(checkout);

  if (dataCheckout <= dataCheckin) {
    alert('A data de check-out deve ser após o check-in.');
    console.warn("Data de check-out inválida.");
    return;
  }

  // Calcula o total de dias
  const dias = (dataCheckout - dataCheckin) / (1000 * 60 * 60 * 24);
  const valorDiaria = parseFloat(carro);
  const total = (valorDiaria * dias).toFixed(2);

  // Exibe na tela e no console
  resultado.textContent = `Carro alugado por ${dias} dias. Total: R$${total}`;
  console.log("Carro selecionado:", carro == 80 ? 'Econômico' : carro == 120 ? 'Confort' : 'Luxo');
  console.log("Check-in:", checkin);
  console.log("Check-out:", checkout);
  console.log("Dias de aluguel:", dias);
  console.log("Total a pagar: R$", total);

  // Salva os dados no localStorage
  const novoAluguel = {
    categoria:
      carro == 80 ? 'Econômico' :
      carro == 120 ? 'Confort' :
      'Luxo',
    dias,
    total
  };

  alugueis.push(novoAluguel);
  localStorage.setItem('alugueis', JSON.stringify(alugueis));
  console.log("Novo aluguel salvo:", novoAluguel);
  console.log("LocalStorage atualizado:", alugueis);

  atualizarLista();
  form.reset();
});

// Função para editar um registro
function editarAluguel(index) {
  const aluguel = alugueis[index];
  console.log(`Editando registro #${index}:`, aluguel);

  // Exemplo simples: remove o item e reabre o formulário com valores
  removerAluguel(index);
  document.getElementById('carro').value =
    aluguel.categoria === 'Econômico' ? 80 :
    aluguel.categoria === 'Confort' ? 120 : 200;
  alert("O item foi removido da lista. Ajuste os valores e salve novamente.");
}

// Função para remover um registro
function removerAluguel(index) {
  console.log(`Removendo registro #${index}:`, alugueis[index]);
  alugueis.splice(index, 1);
  localStorage.setItem('alugueis', JSON.stringify(alugueis));
  atualizarLista();
  console.log("Item removido com sucesso. Lista atual:", alugueis);
}

// Inicializa a lista ao carregar a página
atualizarLista();
console.log("Sistema de aluguel iniciado e pronto para uso.");
