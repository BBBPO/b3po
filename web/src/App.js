import React, { Component } from 'react';
import './App.css';
import DisplayAccounts from './DisplayAccounts';

import { default as Web3} from "web3"
// import { default as contract } from "truffle-contract"

import votingArtifacts from "./artifacts/Voting.json"

// VotingContract.setProvider(window.web3.currentProvider)
//     VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})

let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:9988'))


class App extends Component {

    state = {
        numOfCandidates: -1,

        voteComplete: false,
    };


    async voteForCandidate(candidateId) {
        await this.state.myContract.methods.vote(
            web3.utils.fromAscii('web'),
            candidateId
        )
        .send({
            from: this.state.account,
            gas: 6721975
        })
        .then(r => {
            this.setState({ voteComplete: true })
        })
        .catch(e => {
            console.log(e)
            alert('error:', e)
        })
    }


    componentDidMount() {
        // var VotingContract = contract(votingArtifacts)

        // VotingContract.setProvider(web3.currentProvider)
        return web3.eth.getAccounts()
        .then(async accounts => {

            this.setState({
                account: accounts[0],
            })

            var myContract = new web3.eth.Contract(votingArtifacts.abi, '0x02cc57d51281b30e60d97f56caec34112fb8ccad');

            this.setState({ myContract })
            // myContract.events.AddedCandidate(
            //     { fromBlock: 0},
            //     function(error, event) {
            //         if  (error) {
            //             console.error('=====', error)
            //             return;
            //         }
            //         console.log(event);
            //  }
            // )
            // .on('data', function(event){
            //     console.log('New Candidate:', event);
            // })
            // .on('error', console.error);


            let candidates = -1;
            await myContract.methods.getNumOfCandidates().call()
            .then(r => {
                candidates = r;
                 this.setState({numOfCandidates: r})
            })

            await myContract.methods.getCandidate(0).call()
            .then(r => {
                 this.setState({candidate0: {
                     name: web3.utils.hexToAscii(r[1]),
                     party: web3.utils.hexToAscii(r[2]),
                 }})
            })



            if (candidates < 3) {
                await myContract.methods.addCandidate(
                    web3.utils.fromAscii('robertfdsfdsfs'),
                    web3.utils.fromAscii('testing2323')
                )
                .send({
                    from: accounts[0],
                    gas: 6721975
                })
                .then(r => {

                })
                .catch(e => {
                    console.log(e)
                    alert('error:', e)
                })

                await myContract.methods.getNumOfCandidates().call()
                .then(r => {
                     this.setState({numOfCandidates: r})
                })
            }
          //   console.log(accounts[0])
          //   VotingContract.defaults({from: accounts[0],gas:6721975})
          //
          //   console.log(VotingContract)
          //
          //   return VotingContract.deployed()
          //   .then((instance) => {
          //
          //     // calls getNumOfCandidates() function in Smart Contract,
          //     // this is not a transaction though, since the function is marked with "view" and
          //     // truffle contract automatically knows this
          //     instance.getNumOfCandidates().then((numOfCandidates) => {
          //         this.setState({numOfCandidates})
          //     })
          // })
        })

    }


    render() {


        return (
            <div className="App">
                <header>
                    <DisplayAccounts />
                </header>
                <div>
                    <p># Candidates: {this.state.numOfCandidates}</p>

                    { this.state.voteComplete
                        ? (<span>Vote completed!</span>)
                        : (
                            <div>
                                <button onClick={() => this.voteForCandidate(0)}>Candidate 1</button>
                                <button onClick={() => this.voteForCandidate(1)}>Candidate 2</button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;
