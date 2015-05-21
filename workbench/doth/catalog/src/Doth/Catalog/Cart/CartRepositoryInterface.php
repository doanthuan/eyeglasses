<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:17 AM
 */

namespace Doth\Catalog\Cart;


interface CartRepositoryInterface {

    public function add($productId, $data);
    public function remove($productId);
    public function getCartItems();
    public function getCartProducts();
    public function getTotalAmount();
}