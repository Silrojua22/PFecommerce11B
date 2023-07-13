import React, { useState, useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import Payment from "../../clientComponents/ShoppingCar/Payment";
import Checkout from "../../clientComponents/ShoppingCar/Checkout.jsx";
import Footer from "../../clientComponents/ShoppingCar/Footer.jsx";
import InternalProvider from "../../clientComponents/ShoppingCar/ContextProvider.jsx";
import { SpinnerCircular } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserDetailAction } from "../../redux/userSlice";
import { getPendingOrderAction } from "../../redux/shopingCartSlice";
import axios from "axios";

// REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
// initMercadoPago("APP_USR-8e95f5fd-f2e0-4982-8ac8-27b1f1b175bb");
// initMercadoPago("TEST-6062b4aa-0752-422b-b693-2282b2ede839");
initMercadoPago("TEST-9b320738-7137-42a2-a2c5-d6956bc6ba9d");

const ShoppingCar = () => {
  const { user } = useAuth0();
  const allItems = useSelector((state) => state.shopingCartReducer.pendingOrder);
  let total = 0;
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(allItems);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.usersReducer.userDetail);

  
  useEffect(() => {
    if (!currentUser.id) {
      dispatch(getUserDetailAction(user?.email));
    }
  }, [dispatch]);
  
  const handleClick = () => {
    setIsLoading(true);
    axios
      .post(`/mercadopago/create-preference/${user?.email}`, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((preference) => {
        setPreferenceId(preference.id);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    dispatch(getPendingOrderAction(currentUser.id));
  };

  const renderSpinner = () => {
    if (isLoading) {
      return (
        <div className="spinner-wrapper">
          <SpinnerCircular color="#009EE3" />
        </div>
      );
    }
  };

  return (
    <InternalProvider
      context={{ preferenceId, isLoading, orderData, setOrderData, total }}
    >
      <main>
        {renderSpinner()}
        <Checkout onClick={handleClick} description />
        <Payment />
      </main>
      <Footer />
    </InternalProvider>
  );
};

export default ShoppingCar;
