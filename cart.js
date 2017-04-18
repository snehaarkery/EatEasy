import React from 'react'
import Cart  from 'react-shopping-cart-starter-kit'
 
const myProducts = {
  "product-1" : { "Name" : "Cheerios",   "Price" : "2.99"  },
  "product-2" : { "Name" : "Peanut Butter",  "Price" : "4.99" },
 
}
 
const MyComponent = React.createClass({
    submit() {
        const selection = this.refs.cart.getSelection()
        alert(JSON.stringify(selection))
    },
    addItem(key) {
        this.refs.cart.addItem(key, 1, this.props.products[key])
    },
    render() {
        const products = this.props.products
        return (
            <div>
                <h4>Products</h4>
                <ul>
                    {Object.keys(products).map(key => {
                        return (
                            <li key={key}>
                                <a href='#' onClick={() => this.addItem(key)}>
                                    {products[key]['Name']}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <hr />
                <Cart ref='cart' columns={['Name', 'Price']} />
                <hr />
                <button onClick={this.submit}>
                    Submit
                </button>
            </div>
        )
    }
})
 
React.render(
    <MyComponent products={myProducts} />,
    document.getElementById('main')
)