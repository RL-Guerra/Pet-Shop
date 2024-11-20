/********************************************************************
 * Objetivo: Sistema de cadastro, edição, exclusão e listagem de pets
 * Data: 20/11/2024
 * Autor: Raphael
 * Versão: 1.0
 ********************************************************************/


//Receber o botão salvar do HTML
const botaoSalvar = document.getElementById('salvar')

//Receber os dados do formulário
const getDadosForm = function(){
    let petJSON = {}
    let status = true

    //Recebe das caixas do HTML os dados a serão enviados para a API
    let nomePet = document.getElementById('nome')
    let corPet = document.getElementById('cor')
    let fotoPet = document.getElementById('image')
    let racaPet = document.getElementById('raca')

    if(nomePet == '' || corPet == '' || fotoPet == '' || racaPet == ''){
        alert('Todos os dados devem ser preenchidos.')
        status = false
    }else{
        //Criamos um objeto JSON como os atributos necessário
        petJSON.title     = nomePet.value
        petJSON.subtitle  = corPet.value
        petJSON.image     = fotoPet.value
        petJSON.price     = racaPet.value
    }

    if(status){
        return petJSON
    }else{
        return false
    }

}

//Função para salvar um pet novo
const postPet = async function(dadosPet){
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/novo/pet'

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosPet)
    })

    if(response.status == 201){
        alert('Registro inserido com sucesso.')
        getPets()
    }else{
        alert('Não foi possível inserir o pet, verifique os dados encaminhados.')
    }
}

//Função para alterar um pet existente
const putPet = async function(dadosPet){

    let id = sessionStorage.getItem('idPet')

    alert(id)
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/atualizar/pet/${id}`

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosPet)
    })

    if(response.status == 200){
        alert('Registro atualizado com sucesso.')
        getPets()
    }else{
        alert('Não foi possível atualizar o pet, verifique os dados encaminhados.')
    }

}

//Função para excluir um pet
const deletePet = async function(id){
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/excluir/pet/${id}`

    let response = await fetch(url, {
        method: 'DELETE'
    })

    if(response.status == 200){
        alert('Registro excluído com sucesso!')
        getPets()
    }else{
        alert('Não foi possível excluir o registro.')
    }
}

//Função para listar todos os livros
const getPets = async function(){
    //URL da API
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/listar/pets'

    //Executa a URL no servidor para trazer a lista de pets
    let response = await fetch(url)

    //Converte o retorno em JSON
    let dados = await response.json()

    //Chama a função para criar a lista de pet
    setCardItens(dados)
}

//Função para criar a lista de itens no HTML
const setCardItens = function(dadosPets){
    //Recebe a caixa principal onde será criado a lista de livros
    let divListDados = document.getElementById('listDados')

    //Limpa a lista de dados antes de carregar novamente
    divListDados.innerText = ''

    dadosPets.pets.forEach(function(pet){

        //Cria os elementos no HTML
        let divDados    = document.createElement('div')
        let divNome    = document.createElement('div')  
        let divCor = document.createElement('div')
        let divRaca    = document.createElement('div')
        let divOpcoes   = document.createElement('div')
        let spanEditar  = document.createElement('span')
        let spanExcluir = document.createElement('span')
        let imgEditar   = document.createElement('img')
        let imgExcluir  = document.createElement('img')

        //Escrevendo os dados do ARRAY de pets nos elementos HTML
        divNome.innerText      = pet.nome
        divCor.innerText   = pet.cor
        divRaca.innerText      = pet.raca


        //Adiciona atributos nas tags HTML
        divDados.setAttribute('id', 'dados')
        divDados.setAttribute('class', 'linha dados')
        imgEditar.setAttribute('src', 'img/editar.png')
        imgExcluir.setAttribute('src', 'img/excluir.png')

        imgEditar.setAttribute('idpet', pet.id)
        imgExcluir.setAttribute('idpet', pet.id)

        //Associa um elemento dentro de outro no HTML
        divListDados.appendChild(divDados)
        divDados.appendChild(divNome)
        divDados.appendChild(divCor)
        divDados.appendChild(divRaca)
        divDados.appendChild(divOpcoes)
        divOpcoes.appendChild(spanEditar)
        divOpcoes.appendChild(spanExcluir)
        spanEditar.appendChild(imgEditar)
        spanExcluir.appendChild(imgExcluir)


        //Craindo eventos de click para os elementos do excluir e editar
        imgExcluir.addEventListener('click',function(){
            let id = imgExcluir.getAttribute('idpet')
            let resposta = confirm('Deseja realmente excluir o pet?')
            if(resposta){
                deletePet(id)
            }
        })

        //Evento de click para o editar
        imgEditar.addEventListener('click', function(){
            //Recebe o id do pet
            let id = imgEditar.getAttribute('idpet')

            getBuscarPet(id)

        })

    })


}

//Função para buscar um pet pelo ID
const getBuscarPet = async function(id){
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/buscar/pet/${id}`

    let response = await fetch(url)

    let dados = await response.json()

    if(response.status == 200){
        //Coloca os dados da API nas caixas do formulário
        document.getElementById('nome').value      = dados.pets[0].nome
        document.getElementById('cor').value   = dados.pets[0].cor
        document.getElementById('image').value      = dados.pets[0].image
        document.getElementById('raca').value      = dados.pets[0].raca

        //Altera o texto do botão para a palavra Atualizar
        document.getElementById('salvar').innerText = 'Atualizar'

        //Guardando o ID do livro na área de sessão do navegador, para ser utilizado no put
        sessionStorage.setItem('idPet',id)
    }

}

botaoSalvar.addEventListener('click', function(){
    //postPet()
    let dados = getDadosForm()

    if(dados){
        //Validação para identificar qual requisição na API será realizado (POST ou PUT)
        if(document.getElementById('salvar').innerText == 'Salvar'){
            postPet(dados)
        }else if(document.getElementById('salvar').innerText == 'Atualizar'){
            putPet(dados)
        }
    }
})

window.addEventListener('load', function(){
    getPets()
})