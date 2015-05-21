<?php namespace Doth\Catalog\Controllers;

use Doth\Catalog\Cart\CartRepositoryInterface;
use Doth\Catalog\Checkout\CheckoutRepository;
use Doth\Core\Abstracts\ApiController;

use Input, Session;

class CheckoutController extends ApiController {

    public function __construct(CheckoutRepository $checkout)
    {
        $this->checkout = $checkout;
    }

	public function postPlaceOrder()
	{
        $cart = Input::get('cart');
        $billing = Input::get('billing');
        $shipping = Input::get('shipping');
        $payment = Input::get('payment');
        $orderId = $this->checkout->placeOrder($cart, $billing, $shipping, $payment);
        return $this->respondSuccess('Create order successful', ['order_id' => $orderId]);
	}



}