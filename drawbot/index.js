const rp = require('request-promise');
const PQueue = require('p-queue');

const queue = new PQueue({concurrency: 1});

async function getPenState() {
    var options = {
        uri: 'http://localhost:4242/v1/pen',
        method: 'get',
        json: true,
    };

    rp(options)
    .then(r => {
        console.log(r)
    })
}

async function setPenStatus(down = false) {
    var options = {
        uri: 'http://localhost:4242/v1/pen',
        method: 'put',
        json: true,
        body: {
            state: down ? 0: 1,
        }
    };

    await rp(options)
    .then(r => {
        console.log(r)
    })
    .catch(e => {
        console.log(e)
    })
}

async function setPenLocation(x, y) {
    var options = {
        uri: 'http://localhost:4242/v1/pen',
        method: 'put',
        json: true,
        body: {
            x,
            y,
        }
    };

    await rp(options)
    .then(r => {
        console.log(r)
    })
    .catch(e => {
        console.log(e)
    })
}

async function drawX(topLeftX, topLeftY) {
    await setPenStatus(false);
    // move to position
    await setPenLocation(topLeftX, topLeftY);

    const boxWidth = 3.0;
    const boxHeight = 3.0;

    // draw X
    await setPenStatus(true);
    await setPenLocation(topLeftX + boxWidth, topLeftY + boxHeight);
    await setPenStatus(false);
    await setPenLocation(topLeftX + boxWidth, topLeftY);
    await setPenStatus(true);
    await setPenLocation(topLeftX, topLeftY + boxHeight);
    await setPenStatus(false);
}

// (async function() {
//
//     const candidate1X = 16.4;
//     const candidate1Y = 19.8;
//
//     const candidate2X = 16.4;
//     const candidate2Y = 30.5;
//
//     await setPenStatus(false);
//     // await setPenLocation(10, 10);
//     await drawX(candidate2X, candidate2Y);
//     await setPenStatus(false);
//     await setPenLocation(0, 0);
// })();


const voteFor = async (candidate) => {


    queue.add(async () => {
        console.log('/////', candidate)

        const candidate1X = 16.4;
        const candidate1Y = 19.8;

        const candidate2X = 16.4;
        const candidate2Y = 30.5;

        await setPenStatus(false);
        if (candidate === 0) {
            await drawX(candidate1X, candidate1Y);
        }

        if (candidate === 1) {
            await drawX(candidate2X, candidate2Y);
        }
        await setPenStatus(false);
        await setPenLocation(0, 0);
    });
};

module.exports = voteFor;
