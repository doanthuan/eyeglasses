<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Cart;

use Doth\Catalog\Product\ProductRepositoryInterface;
use Doth\Core\Exceptions\BusinessException;
use Input, DB, Session;

class CartRepository implements CartRepositoryInterface
{
    public function __construct( ProductRepositoryInterface $product )
    {
        $this->product = $product;
    }

    public function add($productId, $data)
    {
        //check product existed
        $product = $this->product->find($productId);
        if(!isset($product))
        {
            throw new BusinessException('Could not find product');
        }

        //if product not existed in cart session, add it to cart
        $cartProducts = Session::get('cart_products', array());
        $cartProducts[$productId] = $data;
        Session::put('cart_products', $cartProducts);
        return true;
    }

    public function remove($productId)
    {
        $cartProducts = Session::get('cart_products', array());
        if(array_key_exists($productId ,$cartProducts))
        {
            unset($cartProducts[$productId]);
            Session::put('cart_products', $cartProducts);
        }
        return true;
    }

    public function getCartItems()
    {
        $cartItems = Session::get('cart_products');
        return $cartItems;
    }

    public function getCartProducts()
    {
        $cartItems = $this->getCartItems();
        if($cartItems == null){
            return;
        }
        $productIds = array_keys( $cartItems );
        $products = \Doth\Catalog\Product\Product::whereIn('product.product_id', $productIds)->get();
        foreach($products as $product)
        {
            $product->cart = $cartItems[$product->product_id];
            $product->subTotal =  $product->price + $cartItems[$product->product_id]['price_options'];
        }
        return $products;
    }

    public function getTotalAmount()
    {
        $total = 0;
        $products = $this->getCartProducts();
        if(count($products) > 0){
            foreach($products as $product)
            {
                $itemCartInfo = $product->cart;
                $total += ( intval($product->price) + intval($itemCartInfo['price_options']) );
            }
        }
        return $total;
    }
}