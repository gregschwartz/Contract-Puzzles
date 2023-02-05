const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { id } = require('ethers/lib/utils');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = ethers.utils.hexlify("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf");
    const first20BytesOfThreshold = ethers.utils.hexDataSlice(threshold, 0, 20);
    // console.log("threshold",threshold, ethers.utils.getAddress("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf"));
    // console.log("first20BytesOfThreshold",first20BytesOfThreshold);
    
    // console.log("contract provider",game.provider);
    // console.log("signer",await ethers.provider.getSigner());
    // console.log("signer's pr",await ethers.provider.getSigner().getProvider());

    process.stdout.write("Searching for suitable addresses: ");
    for(var i=0; i<1000; i++) {
      const wallet = await ethers.Wallet.createRandom({provider: game.provider});
      const address = await wallet.getAddress();

      process.stdout.write(".");

      if(address < first20BytesOfThreshold) {
        console.log(" Found! ", address);
        const connectedWallet = wallet.connect(game.provider);

        //send eth to it
        const fundedWallet = await ethers.provider.getSigner();
        await fundedWallet.sendTransaction({to: address, value: ethers.utils.parseEther("1")});

        await game.connect(connectedWallet).win();
        break;
      }
    }

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
