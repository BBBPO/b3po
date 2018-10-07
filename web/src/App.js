import React, { Component } from 'react';
import './App.css';
import DisplayAccounts from './DisplayAccounts';

import { default as Web3} from "web3"
// import { default as contract } from "truffle-contract"

import logo from './logo.svg';
import Button from './Button';

import votingArtifacts from "./artifacts/Voting.json"

// VotingContract.setProvider(window.web3.currentProvider)
//     VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})

// let web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/79aafdce8f1a428d8a7ead4a95d7fc90'))



class App extends Component {

    state = {
        numOfCandidates: -1,

        voteComplete: false,
    };


    async voteForCandidate(candidateId) {
        const accounts = await this.state.web3.eth.getAccounts();
        if (accounts.length === 0) {
            alert('no account found')
        }

        this.setState({
            account: accounts[0],
        })

        var myContract = new this.state.web3.eth.Contract(votingArtifacts.abi, '0xb7b2ba99a54ed57c02fdd77a0450bde1bb4cd9c6');


        await myContract.methods.vote(
            this.state.web3.utils.fromAscii('web'),
            candidateId
        )
        .send({
            from: accounts[0],
            gas: 6721975
        })
        .then(r => {
            this.setState({ voteComplete: true })
        })
        .catch(e => {
            debugger;
            console.log(e)
            alert('error:', e)
        })
    }


    async componentDidMount() {
        // var VotingContract = contract(votingArtifacts)
        let web3 = null;
        if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/79aafdce8f1a428d8a7ead4a95d7fc90'))
        }

        this.setState({ web3 })


        // VotingContract.setProvider(web3.currentProvider)
      //   try {
      //       const accounts = await web3.eth.getAccounts();
      //       if (accounts.length === 0) {
      //           alert('no account found')
      //       }
      //
      //       this.setState({
      //           account: accounts[0],
      //       })
      //
      //       var myContract = new web3.eth.Contract(votingArtifacts.abi, '0xb7b2ba99a54ed57c02fdd77a0450bde1bb4cd9c6');
      //
      //       this.setState({ myContract })
      //       // myContract.events.AddedCandidate(
      //       //     { fromBlock: 0},
      //       //     function(error, event) {
      //       //         if  (error) {
      //       //             console.error('=====', error)
      //       //             return;
      //       //         }
      //       //         console.log(event);
      //       //  }
      //       // )
      //       // .on('data', function(event){
      //       //     console.log('New Candidate:', event);
      //       // })
      //       // .on('error', console.error);
      //
      //
      //       let candidates = -1;
      //       await myContract.methods.getNumOfCandidates().call()
      //       .then(r => {
      //           candidates = r;
      //            this.setState({numOfCandidates: r})
      //       })
      //
      //       await myContract.methods.getCandidate(0).call()
      //       .then(r => {
      //            this.setState({candidate0: {
      //                name: web3.utils.hexToAscii(r[1]),
      //                party: web3.utils.hexToAscii(r[2]),
      //            }})
      //       })
      //
      //
      //
      //       if (candidates < 3) {
      //           await myContract.methods.addCandidate(
      //               web3.utils.fromAscii('robertfdsfdsfs'),
      //               web3.utils.fromAscii('testing2323')
      //           )
      //           .send({
      //               from: accounts[0],
      //               gas: 6721975
      //           })
      //           .then(r => {
      //
      //           })
      //           .catch(e => {
      //               console.log(e)
      //               alert('error:', e)
      //           })
      //
      //           await myContract.methods.getNumOfCandidates().call()
      //           .then(r => {
      //                this.setState({numOfCandidates: r})
      //           })
      //       }
      //     //   console.log(accounts[0])
      //     //   VotingContract.defaults({from: accounts[0],gas:6721975})
      //     //
      //     //   console.log(VotingContract)
      //     //
      //     //   return VotingContract.deployed()
      //     //   .then((instance) => {
      //     //
      //     //     // calls getNumOfCandidates() function in Smart Contract,
      //     //     // this is not a transaction though, since the function is marked with "view" and
      //     //     // truffle contract automatically knows this
      //     //     instance.getNumOfCandidates().then((numOfCandidates) => {
      //     //         this.setState({numOfCandidates})
      //     //     })
      //     // })
      // } catch(e) {
      //           debugger;
      //           console.error('unable to load web3 account', e)
      //       }
    }


    render() {


        return (
            <div className="Container">
                <div className="App">
                    <header className="App-header">
                        <img src={logo} alt="logo" />
                    </header>
                    <div className="content">


                        { this.state.voteComplete
                            ? (
                                <div>
                                    <div className="voted">
                                        <h1>Congratulations!</h1>
                                        <img src="./ivoted.png" width="200px" />
                                    </div>
                                </div>
                            )
                            : (
                                <div>
                                    <p>Please select one of the following candidates by clicking on the button below.</p>
                                    <div className="candidate-buttons">
                                        <Button
                                            onClick={() => this.voteForCandidate(0)}
                                            title="Gavin Newsome"
                                        />
                                        <Button
                                            onClick={() => this.voteForCandidate(1)}
                                            title="Jon Cox"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
