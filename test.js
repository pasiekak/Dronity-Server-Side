const ClientModel = require('./seqDB/models').Client;
const OperatorModel = require('./seqDB/models').Operator;

const test = async () => {
    // let client = await ClientModel.findOne({where: { id: 1}})
    // let hisAddress = await client.getAddress();
    // console.log('Client: ', client.dataValues);
    // console.log('His address: ', hisAddress.dataValues);

    let operator = await OperatorModel.findOne({where: { id: 1 }})
    let hisImage = await operator.getImages();
    console.log('Operator: ', operator.dataValues);
    console.log('His image: ', hisImage);
}

module.exports = test;