//Função para receber os dados do formulário
const getDadosForm = function(){
    let petJSON = {};
    let status = true;

    let nomePet = document.getElementById('nome');
    let corPet = document.getElementById('cor');
    let imagePet = document.getElementById('image');
    let racaPet = document.getElementById('raca');

    if(nomePet.value == '' || corPet.value == '' || racaPet.value == '' || imagePet.value == ''){
        alert('Todos os dados devem ser preenchidos.');
        status = false;
    }else{
        petJSON.nome = nomePet.value;
        petJSON.cor = corPet.value;
        petJSON.raca = racaPet.value;
        petJSON.image = imagePet.value;
    }

    if(status){
        return petJSON;
    }else{
        return false;
    }
}

//Função para salvar um novo pet
const postPet = async function(dadosPet){
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/novo/pet';

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosPet)
    });

    if(response.status == 201){
        alert('Pet registrado com sucesso.');
        getPets();
    }else{
        alert('Não foi possível registrar o pet, Verifique os dados.');
    }
}

//Função para atualizar um pet
const putPet = async function(dadosPet){
    let id = sessionStorage.getItem('idPet');
    alert(id);
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/atualizar/pet/${id}`;

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosPet)
    });

    if(response.status == 200){
        alert('Pet atualizado com sucesso.');
        getPets();
    }else{
        alert('Não foi possível atualizar o pet, verifique os dados.');
    }
}

//Função para excluir um pet
const deletePet = async function(id) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/excluir/pet/${id}`;

    let response = await fetch(url, {
        method: 'DELETE'
    });

    if(response.status == 200){
        alert('Pet excluído com sucesso!');
        getPets();
    }else{
        alert('Não foi possível excluir o pet.');
    }
}

//Função para listar todos os pets
const getPets = async function(){
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/listar/pets';
    let response = await fetch(url);
    let dados = await response.json();
    setCardItens(dados.pets);
}

//Função para criar a lista de itens no HTML
const setCardItens = function(dadosPets){
    let divListDados = document.getElementById('listDados');
    divListDados.innerHTML = '';

    dadosPets.forEach(function(pet){
        //Cria os elementos no HTML
        let divDados = document.createElement('div');
        let divNome = document.createElement('div');
        let divCor = document.createElement('div');
        let divRaca = document.createElement('div');
        let divOpcoes = document.createElement('div');
        let spanEditar = document.createElement('span');
        let spanExcluir = document.createElement('span');
        let imgEditar = document.createElement('img');
        let imgExcluir = document.createElement('img');
        //Escreve os dados do ARRAY no HTML
        divNome.innerText = pet.nome;
        divCor.innerText = pet.cor;
        divRaca.innerText = pet.raca;
        //Adiciona os atributos nas tagas do HTML
        divDados.setAttribute('id', 'dados');
        divDados.setAttribute('class', 'linha dados');
        imgEditar.setAttribute('src', 'img/editar.png');
        imgExcluir.setAttribute('src', 'img/excluir.png');
        imgEditar.setAttribute('idPet', pet.id);
        imgExcluir.setAttribute('idPet', pet.id);
        //Associa um elemento de outro no HTML
        divListDados.appendChild(divDados);
        divDados.appendChild(divNome);
        divDados.appendChild(divCor);
        divDados.appendChild(divRaca);
        divDados.appendChild(divOpcoes);
        divOpcoes.appendChild(spanEditar);
        divOpcoes.appendChild(spanExcluir);
        spanEditar.appendChild(imgEditar);
        spanExcluir.appendChild(imgExcluir);
        //Evento do click para excluir e editar
        imgExcluir.addEventListener('click', function(){
            let id = imgExcluir.getAttribute('idPet');
            let resposta = confirm('Deseja realmente excluir o pet?');
            if(resposta){
                deletePet(id);
            }
        });

        imgEditar.addEventListener('click', function(){
            let id = imgEditar.getAttribute('idPet');
            getBuscarPet(id);
        });
    });
}

// Função para buscar um pet pelo ID
const getBuscarPet = async function(id){
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/buscar/pet/${id}`;
    let response = await fetch(url);
    let dados = await response.json();

    if(response.status == 200){
        document.getElementById('nome').value = dados.pet[0].nome;
        document.getElementById('cor').value = dados.pet[0].cor;
        document.getElementById('raca').value = dados.pet[0].raca;
        document.getElementById('image').value = dados.pet[0].image;

        document.getElementById('salvar').innerText = 'Atualizar';
        sessionStorage.setItem('idPet', id);
    }
}

//Recebe o botão salvar no HTML juntamente com função de click
const botaoSalvar = document.getElementById('salvar');
botaoSalvar.addEventListener('click', function() {
    let dados = getDadosForm();

    if(dados){
        if(document.getElementById('salvar').innerText == 'Salvar'){
            postPet(dados);
        }else if(document.getElementById('salvar').innerText == 'Atualizar'){
            putPet(dados);
        }
    }
});

// Carrega a lista de pets ao carregar a página
window.addEventListener('load', function(){
    getPets();
});