<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Order;

use Doth\Core\Abstracts\Repository;
use Input;

/**
 * Class OrderRepository
 * @package Doth\Catalog\Order
 */
class OrderRepository extends Repository implements OrderRepositoryInterface{

    /**
     * @param Order $order
     */
    public function __construct( Order $order )
    {
        $this->model = $order;
    }

    public function findOrderWithDetails($orderId)
    {
        $order = $this->find($orderId);
        $billing = \DB::table('order_address')->where('order_id', $orderId)->where('type', 0)->first();
        $shipping = \DB::table('order_address')->where('order_id', $orderId)->where('type', 1)->first();
        $orderItems = \DB::table('order_product')->where('order_id', $orderId)->get();
        return [
            'order' => $order,
            'billing' => $billing,
            'shipping' => $shipping,
            'orderItems' => $orderItems
        ];
    }

}