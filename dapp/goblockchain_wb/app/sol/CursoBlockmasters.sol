pragma solidity 0.4.24;

contract CursoBlockmaster{
    enum StatusEvento{ATIVO, INATIVO}
    StatusEvento public statusEvento;
    
    mapping (address => Pessoa) presentes;
    address public donoEvento;
    event Presente(address presenteEvento);
    
    constructor() public {
        donoEvento = msg.sender;
        statusEvento = StatusEvento.ATIVO;
    }
    
    function getPresentePessoa(address _enderecoPessoa) public view returns (bool){
        return presentes[_enderecoPessoa].presente;
    }
    
    struct Pessoa {
        address endereco;
        string nome;
        bool presente;
    }
    
    function setPresentePessoa(string _nome) public {
        require(presentes[msg.sender].endereco == 0x0);
        require(statusEvento == StatusEvento.ATIVO);
        presentes[msg.sender] = Pessoa({endereco: msg.sender, nome: _nome, presente: true});
        emit Presente(msg.sender);
    }
    
    modifier apenasDono() {
        require(msg.sender == donoEvento);
        _;
    }
    
    function encerrarEvento() public apenasDono {
        statusEvento = StatusEvento.INATIVO;
    }
}