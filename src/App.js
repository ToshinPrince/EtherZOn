import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import EtherZon from "./abis/EtherZon.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [etherZon, setEtherZon] = useState(null);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [account, setAccount] = useState(null);

  const togglePop = async () => {
    console.log("togglePop....");
  };

  const loadBlockchainData = async () => {
    //Connect to Bloackchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);
    //Connect to smart contract(Creating javaScript Version of contract)
    const etherZon = new ethers.Contract(
      config[network.chainId].etherzon.address,
      EtherZon,
      provider
    );
    setEtherZon(etherZon);

    //Load Products

    const items = [];

    for (var i = 0; i < 9; i++) {
      const item = await etherZon.items(i + 1);
      items.push(item);
    }
    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>EtherZon Top Sellers</h2>

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Games"} items={toys} togglePop={togglePop} />
        </>
      )}
    </div>
  );
}

export default App;
