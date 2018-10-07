'use strict';

const Web3 = require('web3');
const votingArtifacts = require('../web/src/artifacts/Voting.json');
const Hapi = require('hapi');
const server = Hapi.server({
    host: 'localhost',
    port: 4456,
});

const voteFor = require('../drawbot');

server.route({
    method: 'GET',
    path: '/hello',
    handler: function(request, h) {
        return'hello world';
    },
});

async function start() {
    try {
        await server.start();


        let web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'))

        // VotingContract.setProvider(web3.currentProvider)
        return web3.eth.getAccounts()
        .then(async accounts => {
            var myContract = new web3.eth.Contract(votingArtifacts.abi, '0xb7b2ba99a54ed57c02fdd77a0450bde1bb4cd9c6');

            myContract.events.VotedCadidate(
                { fromBlock: 0},
                function(error, event) {
                    if  (error) {
                        console.error('=====', error)
                        return;
                    }

                    // console.log(event);
                }
            )
            .on('data', async function(event){

                voteFor(Number(event.returnValues.candidateID));

                // console.log('Voted Candidate:', event.returnValues);
                // console.log('Voted Candidate:', event.returnValues.candidateID);
            })
            .on('error', console.error);

            // let candidates = -1;
            // await myContract.methods.getNumOfCandidates().call();

            // await myContract.methods.getCandidate(0).call()
            // .then(r => {
            //      console.log({
            //          name: web3.utils.hexToAscii(r[1]),
            //          party: web3.utils.hexToAscii(r[2]),
            //      })
            // })
        })


    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
