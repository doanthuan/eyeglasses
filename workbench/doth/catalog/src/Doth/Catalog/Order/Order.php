<?php
namespace Doth\Catalog\Order;

use Doth\Core\Abstracts\Model;

class Order extends Model{

    protected $table = 'order';
    protected $primaryKey = 'order_id';

    protected $fillable = array( 'amount', 'status', 'customer_id', 'customer_email', 'customer_phone', 'billing_address_id',
        'shipping_address_id', 'payment_method', 'shipping_method', 'shipping_price', 'tax_amount', 'promotion_id', 'note'
    );


}