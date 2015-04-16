<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/8/2015
 * Time: 10:45 AM
 */

namespace Doth\Catalog\Product;

use Doth\Catalog\Abstracts\Model;

class Product extends Model{

    protected $table = 'product';
    protected $primaryKey = 'product_id';
    public $timestamps = true;

    protected $fillable = array('name','alias','price','short_description','description','sku', 'quantity','cost',
        'weight', 'vendor_id', 'tax', 'status', 'created_at', 'updated_at', 'hits', 'sold', 'sort_order', 'category_id',
        'attr_set_id', 'old_price', 'published_date', 'new_from', 'new_to', 'hot_from', 'hot_to',
        'meta_title', 'meta_key', 'meta_desc', 'related_products', 'frontpage'
    );

    public static $rules = array(
        'attr_set_id'=>'required|integer',
        'name'=>'required'
    );

    //relationship
    public function images()
    {
        return $this->hasMany('\Doth\Catalog\Image', 'product_id', 'product_id');
    }

    public function category()
    {
        return $this->belongsTo('\Doth\Catalog\Category','category_id', 'category_id');
    }

    public function attributeSet()
    {
        return $this->belongsTo('\Doth\Catalog\AttributeSet','attr_set_id', 'attr_set_id');
    }

    public function attributes()
    {
        return $this->belongsToMany('\Doth\Catalog\Attribute', 'product_attribute_value', 'product_id', 'attr_id')
            ->withPivot('attr_value');
    }

    public function reviews()
    {
        return $this->hasMany('\Doth\Catalog\Review', 'product_id', 'product_id');
    }

    public function relatedProducts()
    {
        return $this->belongsToMany('\Goxob\Catalog\Model\Product','product_related', 'product_id', 'related_id');
    }

    public function setData($input)
    {
        if(!empty($input['price']))
        {
            $input['price'] = \Goxob\Locale\Helper\Currency::priceToNumber($input['price']);
        }

        if(isset($input['name'])){
            $input['alias'] = Str::slug( $input['name'] , '-' );
        }

        parent::setData($input);
    }

}