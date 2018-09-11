// web3 
// projeto https://github.com/ethereum/web3.js
//documentação https://github.com/ethereum/wiki/wiki/JavaScript-API

//geth --rpc --rpcaddr "localhost" --rpcport "8545" --rpcapi "web3,eth,net,personal" --rpccorsdomain "*" --datadir "./private"

//load
window.addEventListener('load', function() {
    // conexaoURL();
    conexaoMetamask();
    checkWeb3();
    carregarEvento();
});

function conexaoURL() {
    // var urlNode = 'http://127.0.0.1:7545';
    var urlNode = 'http://localhost:8080';
    window.web3 = new Web3(new Web3.providers.HttpProvider(urlNode));
}

function conexaoMetamask() {
    window.web3 = new Web3(web3.currentProvider)
}

//Check the web3 connection
function checkWeb3(){
    // Set the connect status on the app
    if (web3 && web3.isConnected()) {
        console.info('Connected');
        $('#no_status').text("Conectado");
        // Set version
        setWeb3Version();
        checkNodeStatus();
    } else {
        console.info('Not Connected');
        $('#no_status').text("Desconectado");
    }
}

//Get web3 version
function setWeb3Version() {
    var versionJson = {};
    // Asynchronous version
    web3.version.getNode(function(error, result){
        if(error){
            console.info(error);
        } else {
            $('#versionGeth').text(result);
            console.info(result);
        }
    });
}

//check if the client is listening and peer count
function checkNodeStatus()  {
    // it is Asynch
    web3.net.getListening(function(error, result){
        if(error) {
            console.info('get_peer_count ' + error);
        } else {
            // get the peer count
            web3.net.getPeerCount(  function(  error,  result ) {
                if(error){
                    console.info('get_peer_count ' + error);
                } else {
                    $('#nodes').text(result);
                    console.info('Peer Count: ' + result);
                }
            });
            listAccounts();
        }
    });
}

function listAccounts() {
    web3.eth.getAccounts(function(error, result) {
        if(error){
            console.info('accounts ' + error);
        } else {
            var accounts = result;
            $('#sizeAccounts').text(result.length);

            var accounts_ul = $("#accounts_ul");
            accounts_ul.empty;

            for (var i = 0;  i < accounts.length; i++) {
                accounts_ul.append('<li>' + result[i] + "</li>");
            }
        }
    })
}

$("#btnBalance").click(function() {
    var account = $("#account").val();
    web3.eth.getBalance(account, web3.eth.defaultBlock, function(error, result) {
        if(error){
            console.error('getBalance ' + error);
        } else {
            console.info(result);
            var balance = web3.fromWei(result, 'ether').toFixed(2);
            // var balance = result;
            $("#accountBalance").val(balance);
        }
    })
})


$("#btnSendEther").click(function() {
    var from = $("#from").val();
    var to = $("#to").val();
    var value = $("#valueToSend").val();

    var transacao = {
        "from": from,
        "to": to,
        "value": web3.toWei(value, 'ether'),
        "gas": 300000
    }
    
    web3.eth.sendTransaction(transacao, function(error, result) {
        if(error){
            console.error('sendTransaction ' + error);
        } else {
            console.info(result);
            $("#labelResultSendEther").text(result);
        }
    })
})

$("#btnTransaction").click(function() {
    var transacao = $("#transaction").val();
    web3.eth.getTransactionReceipt(transacao, function (error, result) {
        console.log(result.status);
        $("#resultTransaction").val(JSON.stringify(result, null, '\t' ));
    });
})

// var endereco
var enderecoEvento = "0x09436342fad0711cbe4a75547732fc89740d30ee";
var abi = [{"constant":false,"inputs":[{"name":"_nome","type":"string"}],"name":"setPresentePessoa","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_enderecoPessoa","type":"address"}],"name":"getPresentePessoa","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"statusEvento","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"donoEvento","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"encerrarEvento","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"presenteEvento","type":"address"}],"name":"Presente","type":"event"}];

function carregarInstanciaEvento() {
    var EventoContrato = web3.eth.contract(abi);
    var EventoInstance = EventoContrato.at(enderecoEvento);
    return EventoInstance;
}

function carregarEvento() {
    var instance = carregarInstanciaEvento();
    instance.donoEvento(function (error, valor) {
        console.info(error);
        console.info(valor);
        $("#donoEvento").text(valor);
    });
    instance.statusEvento(function (error, valor) {
        console.info(error);
        console.info(valor);
        //fazer if
        $("#statusEvento").text(valor);
    });    
    startEvents();
}

function transferirTokens() {
    var endereco = $("#transferirPara").val();
    var quantidade = $("#quantidadeTransferir").val();
    var instance = carregarInstanciaToken();

    instance.transfer.sendTransaction(endereco, quantidade, function (error, result) {
       console.info(result); 
    });
}

function startEvents() {
    var instance = carregarInstanciaEvento();
    var evento  = instance.Presente();
    evento.watch(function(error, result){
        console.info(result);
        alert(result);
    });
}
// web3.eth.getTransactionReceipt(hash [, callback])