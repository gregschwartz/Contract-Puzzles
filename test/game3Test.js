const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signer = ethers.provider.getSigner(0);

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example
    const address = await signer.getAddress();

    return { game, signer };
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage
    const signer3 = await ethers.provider.getSigner(3);
    const signer2 = await ethers.provider.getSigner(2);
    const signer1 = await ethers.provider.getSigner(1);

    //address3:1
    //address2:3
    //address1:2
    const balances = [null, 2, 3, 1];
    assert(balances[3] > 0);
    assert(balances[2] > balances[1]);
    assert(balances[1] > balances[3]);

    await game.connect(signer3).buy({ value: '1' });
    await game.connect(signer2).buy({ value: '3' });
    await game.connect(signer1).buy({ value: '2' });

    // TODO: win expects three arguments
    await game.win(await signer1.getAddress(), await signer2.getAddress(), await signer3.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
