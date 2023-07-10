import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";

import close from "../assets/close.svg";

const Product = ({ item, provider, account, etherZon, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const events = await etherZon.queryFilter("Buy");
    const orders = events.filter(
      (event) =>
        event.args.buyer === account &&
        event.args.itemId.toString() === item.id.toString()
    );

    if (orders.length === 0) return;

    const order = await etherZon.orders(account, orders[0].args.orderId);
    setOrder(order);

    // if (orders.lenght === 0) return(
    //   const order = await etherZon.orders(account, orders[0].args.orderId);
    // setOrder(order);
    // )
  };

  const buyHandler = async () => {
    const signer = await provider.getSigner();

    //Buying Item
    let transaction = await etherZon.connect(signer).buy(item.id, {
      value: item.cost,
    });

    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();
  }, [hasBought]);
  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>

          <hr />

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>

          <hr />

          <h2>Overview</h2>

          <p>
            {item.description}
            Mauris hendrerit mi vel arcu rhoncus porta. Pellentesque venenatis
            iaculis erat, eu venenatis risus scelerisque a. Ut ac vulputate
            risus. Donec dignissim erat ac lacinia cursus. Duis ac lacus
            pellentesque purus faucibus blandit non vel risus.
          </p>
        </div>
        <div className="product__order">
          <p>
            FREE Delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>
          {item.stock > 0 ? <p>In Stock</p> : <p>Out of Stock</p>}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>

          <p>Ships from EtherZon</p>
          <p>Sold by EtherZon</p>

          {order && (
            <div className="product_bought">
              Item bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + "000")
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          )}
        </div>

        <button onClick={togglePop} className="product__close">
          <img src={close} alt="CLose" />
        </button>
      </div>
    </div>
  );
};

export default Product;
