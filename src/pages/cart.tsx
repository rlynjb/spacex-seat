import React, { Fragment } from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client';

import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';
import { GetCartItems } from './__generated__/GetCartItems';
import { cartItemsVar } from '../cache';

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

const Cart = () => {
  const cartItems = useReactiveVar(cartItemsVar);
  // ^^ ref: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies

  // NOTE: for some reason, useQuery is returning undefined
  const { loading, error } = useQuery<GetCartItems>(GET_CART_ITEMS);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Cart</Header>
      {
        cartItems.length === 0
        ? ( <p data-testid="empty-message">No items in your cart</p> )
        : (
          <Fragment>
            {
              cartItems.map((launchId: any) =>
                ( <CartItem key={launchId} launchId={launchId} /> )
              )
            }
            <BookTrips cartItems={cartItems || []} />
          </Fragment>
        )
      }
    </Fragment>
  );
};

export default Cart;