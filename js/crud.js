// Cadastro de animais para um PetShop em um formulário com opções Create/Update
// Recebe nome do animal, espécie, peso, altura, raça, tipo pelagem/plumagem e tratamento
// Apresenta registro dos animais em uma tabela com opções Read,Update,Delete
// Os dados de cadastro referentes a especie, raça, tipo/pelagem/plumagem e tratamento
// são carregados de forma filtrada por espécie. Estes também também são provenientes do Firestore
// Base de dados "bdPetShop" com banco de dados noSql Firebase Firestore

 // Imports Firebase
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
 import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc} from  "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
   
 //Dados necessários para configuração e inicialização da conexão Firebase com o app
 const app = initializeApp({
    apiKey: "AIzaSyD2FxAR0cCaWexlY9T__USpnEO4d4k0tSg",
    authDomain: "bdpetshop-90019.firebaseapp.com",
    projectId: "bdpetshop-90019",
    storageBucket: "bdpetshop-90019.appspot.com",
    messagingSenderId: "247837956959",
    appId: "1:247837956959:web:bd1f701df2ed09c98e34ea"
 });
 
//Armazena a base de dados em db
const db = getFirestore(app);

//Carrega a coleção bdAnimais em animaisRef, bdTratamentos em tratamentosRef e bdDetalhesAnimais em detalhesRef
const animaisRef = collection(db, 'bdAnimais');
const tratamentosRef = collection(db, 'bdtratamentos');
const detalhesRef = collection(db, 'bdDetalhesAnimais');

// Recebe conteúdo do form cadastroAnimais
let form = document.getElementById('cadastroAnimais');

var arrayDetalhes = [];

// Carrega dados cadastrados na tabela
await listarDados();

//Carrega a coleção bdTratamentos no combo box #tratamentoAnimal
await carregaCombo(tratamentosRef,'tratamentoAnimal',1);

//Carrega a coleção bdDetalhesAnimais no combo box #especieAnimal e atribui um array com detalhes
//para espécies para injetar nos respectivos combo boxes
await carregaCombo(detalhesRef,'especieAnimal',2);

//Limpa os combo boxes de Raça e PeloPlumagem se clicar no combo box de Espécie
especieAnimal.addEventListener('click', async () => { 
    document.querySelector('#racaAnimal').value = "";
    document.querySelector('#tipoPelPlumAnimal').value = "";
})

//Evento que carrega os dados de raça e pelo plumagem no combo box após o usuário sair do combo box
//de seleção de espécie
especieAnimal.addEventListener('blur', () => { 
    carregaCombosEspecie(); 
})

function carregaCombosEspecie(){
    let especieAux = document.querySelector('#especieAnimal').value;
    const racaDetalhes = arrayDetalhes.filter(detalhes => (detalhes.especieDetalhe == especieAux));
    let estrutura = `<option value""></option>`;
    let count = (racaDetalhes[0].racaDetalhe).length;
    for (let i=0; i<=(count-1); i++)  {
        estrutura += `<option value=${racaDetalhes[0].racaDetalhe[i]}>${racaDetalhes[0].racaDetalhe[i]}</option>`;
    }
    document.getElementById('racaAnimal').innerHTML = estrutura;
        
    estrutura = `<option value""></option>`;
    count = (racaDetalhes[0].pelPlumDetalhe).length;
    for (let i=0; i<=(count-1); i++)  {
        estrutura += `<option value=${racaDetalhes[0].pelPlumDetalhe[i]}>${racaDetalhes[0].pelPlumDetalhe[i]}</option>`;
    }
    document.getElementById('tipoPelPlumAnimal').innerHTML = estrutura;  
}

//Função que irá carregar dados de uma coleção no combo box selecionado por idTagRef
async function carregaCombo(docRef,idTagRef, opRef) {
    arrayDetalhes = [];
    let estrutura = `<option value""></option>`;
    let nrRegistros = 0;   
    const queryRegistros = await getDocs(docRef)
    queryRegistros.forEach((doc) => {
        switch (opRef) {
            case 1: estrutura += `<option value=${doc.data().nomeTratamento}>${doc.data().nomeTratamento}</option>`;
            break;
            case 2: {
                estrutura += `<option value=${doc.data().especieDetalhe}>${doc.data().especieDetalhe}</option>`;
                arrayDetalhes.push(doc.data()); 
            }
            break;
        }          
        nrRegistros++;
    })
    if (nrRegistros > 0) document.getElementById(idTagRef).innerHTML = estrutura; 
}

// Disparo de evento submit através da tag button para inclusão ou edição de registros
form.addEventListener('submit', function(){            
    // Dados do form
    let nmAnimal = document.querySelector('#nomeAnimal').value;
    let espAnimal = document.querySelector('#especieAnimal').value;
    let pesAnimal = document.querySelector('#pesoAnimal').value;
    let altAnimal = document.querySelector('#alturaAnimal').value;
    let racAnimal = document.querySelector('#racaAnimal').value;   
    let tipPsAnimal = document.querySelector('#tipoPelPlumAnimal').value;
    let tratAnimal = document.querySelector('#tratamentoAnimal').value;
    console.log(tipPsAnimal);
    console.log(racAnimal);
    
    // Recebe valor da tag button para identificar inclusão ou edição do elemento
    // Contém vazio se a operação é create ou indice do registro se for update
    let submitButton = document.querySelector('button').value;
       
    if(!submitButton){
        //CREATE - Inserção do registro no banco bdAnimais
        addDoc (animaisRef, {
            nome: nmAnimal, especie: espAnimal, peso: pesAnimal,
            raca: racAnimal, altura: altAnimal, tipoPelPlum: tipPsAnimal,
            tratamento: tratAnimal});
    }else{
        //UPDATE - Atualização de um registro pelo id 
        updateDoc(doc(animaisRef, submitButton),{  
            nome: nmAnimal, especie: espAnimal, peso: pesAnimal,
            raca: racAnimal, altura: altAnimal, tipoPelPlum: tipPsAnimal,
            tratamento: tratAnimal});
    }
       
    // Limpa form e atualiza dados dos animais cadastrados na tabela
    form.reset();
    listarDados();
    document.querySelector('button').value = '';
})

// Carrega registros de bdAnimais atualizando a tabela
async function listarDados(){
    let estrutura = '';
    let nrRegistros = 0;
    
    //READ - Leitura de todos registros - id, registro completo e por campo
    const queryRegistros = await getDocs(animaisRef)
    queryRegistros.forEach((doc) => {
        const {nome, especie, peso, raca, altura, tipoPelPlum, tratamento} = doc.data()
        estrutura += `
            <tr>
                <td>${doc.data().nome}</td>
                <td>${doc.data().especie}</td>
                <td>${doc.data().peso} kg</td>
                <td>${doc.data().altura} cm</td>
                <td>${doc.data().raca}</td>
                <td>${doc.data().tipoPelPlum}</td>
                <td>${doc.data().tratamento}</td>
                <td>
                    <button data-edit="${doc.id}" class="btn btn-warning" value="1">Editar</button> 
                    <button data-remove="${doc.id}" class="btn btn-danger btn-block" value="2">Deletar</button>
                </td> 
            </tr>
            `;
        nrRegistros++;
    })
    // Injeta conteúdo na página de cadastro se houver registros ou mensagem de Nenhum animal cadastrado se vazio
    if (nrRegistros > 0) document.querySelector('table tbody').innerHTML = estrutura;
    else{
        let estrutura = `
        <tr>
            <td colspan="6" align="center">Nenhum animal cadastrado</td>
        </tr>
        `;
        document.querySelector('table tbody').innerHTML = estrutura;
    }

    // Atribui funcionalidade de Edit ou Delete aos botões criados dinamicamente na tabela para cada registro
    // Se o valor do botão for 1 - Edit, se for 2 - Delete
    const buttons = document.querySelectorAll(".btn")
    buttons.forEach((button)=>{
        button.addEventListener("click",()=>{
            switch(button.value){
                case "1":{
                    editaItem(button.dataset.edit); break;
                }
                case "2":{
                    deletaItem(button.dataset.remove); break;
                }
            }
        })
    })
}

// Função utilizada para delete de um registro referenciado por id
async function deletaItem(id){
    const queryRegistroDelete = await doc(animaisRef, id);
    //DELETE - Remoção de registro pelo id
    await deleteDoc(queryRegistroDelete)
    form.reset();
    document.querySelector('button').value = '';
    listarDados();
}

// Função utilizada para edit em um registro referenciado por id
async function editaItem(id){
    // READ - Leitura de um registro unico pelo id
    const queryRegistro = await getDoc(doc(animaisRef, id))
    if (queryRegistro.exists()) {
        console.log(queryRegistro.id)
        console.log(queryRegistro.data())
    
        document.querySelector('#nomeAnimal').value = queryRegistro.data().nome;
        document.querySelector('#especieAnimal').value = queryRegistro.data().especie;
        //AQUI
        carregaCombosEspecie();
        document.querySelector('#pesoAnimal').value = queryRegistro.data().peso;
        document.querySelector('#alturaAnimal').value = queryRegistro.data().altura;
        document.querySelector('#racaAnimal').value = queryRegistro.data().raca;
        document.querySelector('#tipoPelPlumAnimal').value = queryRegistro.data().tipoPelPlum
        document.querySelector('#tratamentoAnimal').value = queryRegistro.data().tratamento;
       
        // Atribui id diretamente a propriedade value da tag button para identificação 
        // de operação de edição em função do indice a ser tratado
        document.querySelector('button').value = id;
    }
}