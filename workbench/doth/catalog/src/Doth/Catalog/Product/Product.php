<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/8/2015
 * Time: 10:45 AM
 */

namespace Doth\Catalog\Product;

use Doth\Core\Abstracts\Model;
use Str;

class Product extends Model{

    protected $table = 'product';
    protected $primaryKey = 'product_id';
    public $timestamps = true;

    protected $fillable = array('name','alias','price','short_description','description', 'thumbnail',
        'sku', 'quantity', 'status', 'created_at', 'updated_at', 'hits', 'sold', 'sort_order', 'category_id',
        'meta_title', 'meta_key', 'meta_desc', 'frontpage',
        'brand_id', 'gender', 'face_shape', 'frame_size', 'frame_type', 'frame_material', 'frame_shape',
        'spring_hinge', 'eligible', 'lens_width', 'lens_height', 'bridge_width', 'temple_length'
    );

    public static $rules = array(
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

    public function reviews()
    {
        return $this->hasMany('\Doth\Catalog\Review', 'product_id', 'product_id');
    }

    public function relatedProducts()
    {
        return $this->belongsToMany('\Doth\Catalog\Product','product_related', 'product_id', 'related_id');
    }

    public function setData($input)
    {
//        if(!empty($input['price']))
//        {
//            $input['price'] = \Goxob\Locale\Helper\Currency::priceToNumber($input['price']);
//        }

        if(isset($input['name'])){
            $input['alias'] = Str::slug( $input['name'] , '-' );
        }
        if(!isset($input['status'])){
            $input['status'] = 1;
        }

        parent::setData($input);
    }

}