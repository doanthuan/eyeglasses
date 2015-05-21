<?php namespace Doth\Catalog\Controllers;

use Doth\Catalog\Cart\CartRepositoryInterface;
use Doth\Core\Abstracts\ApiController;

use Doth\Core\Exceptions\BusinessException;
use Input, Session;

class CartController extends ApiController {

    public function __construct(CartRepositoryInterface $cart)
    {
        $this->cart = $cart;
    }

	public function anyIndex()
	{
        $products = $this->cart->getCartProducts();
        if(!$products){
            throw new BusinessException('Cart is empty!');
        }
        $totalAmount = $this->cart->getTotalAmount();
        $data['products'] = $products;
        $data['totalAmount'] = $totalAmount;
        return $this->respondData($data);
	}

    public function postAdd()
    {
        $productId = Input::get('productId', 0);
        $data['color'] = Input::get('color');
        $data['package'] = Input::get('package');
        $data['lens'] = Input::get('lens');
        $data['upgrades'] = Input::get('upgrades', []);
        $data['price_options'] = Input::get('price_options', 0);

        $this->cart->add($productId, $data);

        return $this->respondSuccess('Add item to cart successfully');
    }

    public function postRemove()
    {
        $productId = Input::get('productId',  0);
        $this->cart->remove($productId);

        return $this->respondSuccess('Remove item from cart successfully');
    }

}