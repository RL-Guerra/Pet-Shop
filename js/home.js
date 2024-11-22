//Obtém o contêiner onde os cards dos pets serão exibidos
const characterContainerPets = document.getElementById('characterContainer');

//Função que busca a lista de pets da API
async function fetchCharactersPets(){
    try{
        const response = await fetch('https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto3/fecaf/listar/pets');
        const data = await response.json();
        displayCharactersPets(data.pets);
    }catch (error){
        console.error("Erro ao buscar pets:", error);
    }
}

//Função para exibir os pets no HTML
function displayCharactersPets(pets){
    characterContainerPets.innerHTML = '';
    pets.forEach(pet => {
        const petDiv = document.createElement('div');
        petDiv.className = 'character';
        petDiv.innerHTML = `
            <h3>${pet.nome}</h3>
            <img src="${pet.image}" alt="${pet.nome}" width="150">
            <p>Cor: ${pet.cor}</p>
            <p>Raça: ${pet.raca}</p>
        `;
        characterContainerPets.appendChild(petDiv);
    });
}

//Chama a função para buscar pets ao carregar a página
fetchCharactersPets();

//Função do evento de click no icone de menu
document.getElementById('menuIcon').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
});