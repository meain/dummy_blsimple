pragma solidity ^0.4.18;

// pharma -> Data

// string cro;
// string site_activation_lead_time;
// string screen_failure_rate;
// string enrollment_rate;
// string patient_visit_to_crf_entry;
// string AE_reporting_adherence;
// string pub_key;

contract PharmaData {

    struct CroData {
        string cro;
        string sat;
    }

    mapping ( string => CroData[] ) dataMapping;

    function addData(string _pharma, string _cro, string _sat) public {
        dataMapping[_pharma].push(CroData(_cro, _sat));
    }

    function getDataLength(string _pharma) public returns(uint) {
        return dataMapping[_pharma].length;
    }

    function getData(string _pharma, uint index) public returns(string _cro, string _sat) {
        _cro = dataMapping[_pharma][index].cro;
        _sat = dataMapping[_pharma][index].sat;
    }
}
