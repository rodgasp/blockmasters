window.addEventListener("load", function(){
    //Conexão MetaMask
    window.web3 = new Web3(web3.currentProvider);
    
    //Conexão Geth Dev Local
    //var urlNode = "http://localhost:8545";
    //window.web3 = new Web3(new Web3.providers.HttpProvider(urlNode));
    
    checkWeb3();
});

function checkWeb3(){
    if(web3 && web3.isConnected()){
        $("#no_status").html("Web3 Conectado");
        setWeb3Version();
        checkNodeStatus();
        listAccounts();
        loadContractData();
    }
}

function setWeb3Version(){
    web3.version.getNode(function(error, result){
        if(error){
            console.error(error);
        }else{
            $("#versionGeth").html(result);
        }
    });
}

function checkNodeStatus(){
    web3.net.getListening(function(error, result){
        if(error){
            console.error(error);
        }else{
            web3.net.getPeerCount(function(error, result){
                if(error){
                    console.error(error);
                }else{
                    $("#nodes").html(result);
                }
            });
        }
    });
}

function listAccounts(){
    web3.eth.getAccounts(function(error, result){
        if(error){
            console.error(error);
        }else{
            var accounts = result;
            $("#sizeAccounts").text(accounts.length);
            var accounts_ul = $("#accounts_ul");

            accounts_ul.empty;
            accounts_ul.html("");

            for(var i = 0; i < accounts.length; i++){
                accounts_ul.append('<li><span>'+ accounts[i]+'</span></li>');
            }

        }
    });
}

var contractAddress = '0x3bd33ac29fe04254970ac525db7b6f0348784ff9';
var contractAbi = ([{"constant":false,"inputs":[{"name":"_nome","type":"string"}],"name":"setPresentePessoa","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_enderecoPessoa","type":"address"}],"name":"getPresentePessoa","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"statusEvento","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"donoEvento","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"encerrarEvento","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"presenteEvento","type":"address"}],"name":"Presente","type":"event"}]);

function loadContract(){
    var contract = web3.eth.contract(contractAbi);
    var contractInstance = contract.at(contractAddress);
    return contractInstance;
}

function loadContractData(){
    var instance = loadContract();
    instance.donoEvento(function(error, result){
        $("#donoEvento").html(result);
    });

    instance.statusEvento(function(error, result){
        var resultado = result.toNumber();
        $("#statusEvento").html(resultado);
        if(resultado==0){
            $("#btnEncerrar").show();
        }
    });
    checkEvents();
}

$("#btnConfirmar").click(function(){
    var nome = $("#nome").val();
    var instance = loadContract();
    instance.setPresentePessoa(nome, function(error, result){
        if(error){
            console.error(error);
        }else{
            console.log(result);
        }
    });
});

$("#btnVerificar").click(function(){
    var address = $("#address").val();
    var instance = loadContract();
    instance.getPresentePessoa(address, function(error, result){
        if(error){
            console.error(error);
        }else{
            $("#retornoPresenca").html(result?"Presente":"Não Presente");
        }
    });
});

$("#btnEncerrar").click(function(){
    var instance = loadContract();
    instance.encerrarEvento(function(error, result){
        if(error){
            console.error(error);
        }else{
            console.log(result);
            loadContractData();
        }
    });
});

function checkEvents(){
    console.log("checkEvents");
    var instance = loadContract();
    var evento = instance.Presente();
    evento.watch(function(error, result){
        console.log("Evento Presente:");
        console.info(result);
        console.log(result);
        alert(result);
    });
}