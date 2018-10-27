pragma solidity ^0.4.18;

contract PharmaData {

    struct CroData {
        string cro;
        string sat;
    }

    mapping ( string => CroData[] ) dataMapping;

    function addData(string _pharma, string _cro, string _sat) public {
        dataMapping[_pharma].push(CroData(_cro, _sat));
    }

    function getDataLength(string _pharma) constant public returns(uint) {
        return dataMapping[_pharma].length;
    }

    function getData(string _pharma, uint index) constant public returns(string _cro, string _sat) {
        _cro = dataMapping[_pharma][index].cro;
        _sat = dataMapping[_pharma][index].sat;
    }
}
