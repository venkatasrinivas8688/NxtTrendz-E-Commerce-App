import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    this.setState(prevState => {
      const isProductAlreadyExist = prevState.cartList.find(
        eachItem => eachItem.id === product.id,
      )
      if (isProductAlreadyExist) {
        return {
          cartList: prevState.cartList.map(eachItem =>
            eachItem.id === product.id
              ? {...eachItem, quantity: eachItem.quantity + product.quantity}
              : eachItem,
          ),
        }
      }
      return {
        cartList: [...prevState.cartList, product],
      }
    })
  }

  decrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachItem => {
        if (eachItem.id === productId && eachItem.quantity >= 1) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return eachItem
      }),
    }))
  }

  incrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachItem =>
        eachItem.id === productId
          ? {...eachItem, quantity: eachItem.quantity + 1}
          : eachItem,
      ),
    }))
  }

  deleteCartItem = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(
        eachItem => eachItem.id !== productId,
      ),
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state

    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            incrementCartItemQuantity: this.incrementCartItemQuantity,
            decrementCartItemQuantity: this.decrementCartItemQuantity,
            removeAllCartItems: this.removeAllCartItems,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App
