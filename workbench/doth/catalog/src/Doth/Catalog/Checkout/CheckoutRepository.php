<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Checkout;

use Doth\Catalog\Order\Order;
use Doth\Core\Exceptions\BusinessException;
use Input, DB, Session;

class CheckoutRepository implements CheckoutRepositoryInterface
{
    public function placeOrder($cart, $billing, $shipping, $payment)
    {
        //save order
        $order = new Order();
        $order->amount = $cart['totalAmount'];
        $order->customer_email = $billing['email'];
        $order->customer_phone = $billing['phone'];
        $order->status = 1;//created
        $order->save();
        $orderId = $order->order_id;

        //save order items
        foreach($cart['products'] as $product){
            $orderItem = [];
            $orderItem['order_id'] = $orderId;
            $orderItem['product_id'] = $product['product_id'];
            $orderItem['name'] = $product['name'];
            $orderItem['price'] = $product['price'];
            $orderItem['total'] = $product['subTotal'];

            \DB::table('order_product')->insert($orderItem);
        }

        //save billing
        $billing['type'] = 0; //billing
        $billing['order_id'] = $orderId;
        \DB::table('order_address')->insert($billing);

        //save shipping
        $shipping['type'] = 1;//shipping
        $shipping['order_id'] = $orderId;
        \DB::table('order_address')->insert($shipping);

        //make payment
        $paymentOk = $this->doPayment($payment, $cart['totalAmount']);

        //update order status
        if($paymentOk){
            $order->status = 2;//paid
        }
        else{
            $order->status = -1;//error
        }
        $order->save();

        //clean up cart
        \Session::forget('cart_products');

        return $orderId;
    }

    public function doPayment($payment, $amount)
    {
        \Stripe\Stripe::setApiKey("sk_test_ruokmHKTZo15KD295MH1cIaV");
        $token = $payment['token'];
        $amount = $amount;

        // Create the charge on Stripe's servers - this will charge the user's card
        try {
            $charge = \Stripe\Charge::create(array(
                    "amount" => $amount, // amount in cents, again
                    "currency" => "usd",
                    "source" => $token,
                    "description" => "Example charge")
            );
            return true;
        } catch(\Stripe\Error\Card $e) {
            // The card has been declined
            throw new BusinessException($e->getMessage());
        }
    }

}