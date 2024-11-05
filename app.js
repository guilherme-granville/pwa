const categorias = {
    alimentos: ["Arroz", "Feijão", "Macarrão", "Leite", "Açúcar", "Café", "Óleo", "Farinha", "Batata", "Cenoura"],
    limpeza: ["Sabão", "Detergente", "Desinfetante", "Água Sanitária", "Esponja de Aço", "Papel Toalha", "Lustra Móveis", "Sabão em Pó"],
    utilidades: ["Pano de Prato", "Esponja", "Velas", "Pilha", "Guardanapos", "Fósforo", "Sacolas Plásticas", "Lâmpada", "Balde", "Rodo"]
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker registrado com sucesso');
    });
}

document.getElementById('categoria').addEventListener('change', function () {
    const categoriaSelecionada = this.value;
    const itemSelect = document.getElementById('item');
    itemSelect.innerHTML = '<option value="">Selecione...</option>';

    if (categoriaSelecionada && categorias[categoriaSelecionada]) {
        categorias[categoriaSelecionada].forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            itemSelect.appendChild(option);
        });
    }
});

function carregarLista() {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    document.getElementById('lista-compras').innerHTML = '';
    lista.forEach(item => adicionarItem(item.nome, item.quantidade));
}

function adicionarItem(nome, quantidade = 1) {
    const listaCompras = document.getElementById('lista-compras');
    let itemExistente = Array.from(listaCompras.children).find(li => li.dataset.nome === nome);

    if (itemExistente) {
        const qtdAtual = parseInt(itemExistente.dataset.quantidade, 10) + quantidade;
        itemExistente.dataset.quantidade = qtdAtual;
        itemExistente.querySelector('.quantidade').textContent = `Quantidade: ${qtdAtual}`;
    } else {
        const novoItem = document.createElement('li');
        novoItem.dataset.nome = nome;
        novoItem.dataset.quantidade = quantidade;
        novoItem.innerHTML = `
            ${nome} <span class="quantidade">Quantidade: ${quantidade}</span>
            <button class="remove-item">Remover</button>
        `;
        listaCompras.appendChild(novoItem);
    }
    salvarLista();
}

function salvarLista() {
    const itens = Array.from(document.querySelectorAll('#lista-compras li')).map(li => ({
        nome: li.dataset.nome,
        quantidade: parseInt(li.dataset.quantidade, 10)
    }));
    localStorage.setItem('listaCompras', JSON.stringify(itens));
}

document.getElementById('adicionar').addEventListener('click', function () {
    const itemSelecionado = document.getElementById('item').value;
    if (itemSelecionado) {
        adicionarItem(itemSelecionado);
        alert(`${itemSelecionado} foi adicionado à lista!`);
    }
});

document.getElementById('lista-compras').addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        e.target.parentElement.remove();
        salvarLista();
        alert(`Item removido da lista.`);
    }
});

document.getElementById('limpar-lista').addEventListener('click', function () {
    document.getElementById('lista-compras').innerHTML = '';
    salvarLista();
    alert(`Lista limpa.`);
});

document.getElementById('toggle-theme').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('filtro').addEventListener('input', function (e) {
    const filtro = e.target.value.toLowerCase();
    document.querySelectorAll('#lista-compras li').forEach(item => {
        item.style.display = item.dataset.nome.toLowerCase().includes(filtro) ? '' : 'none';
    });
});


carregarLista();
