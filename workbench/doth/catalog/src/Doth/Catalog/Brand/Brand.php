<?php
namespace Doth\Catalog\Brand;

use Str;
use Doth\Core\Abstracts\Model;

class Brand extends Model{

	protected $table = 'brand';
    protected $primaryKey = 'id';

    protected $fillable = array( 'name', 'for_men', 'for_women' );

    public static $rules = array(
        'name' => 'required'
    );

    //relationship
    public function products()
    {
        return $this->hasMany('\Doth\Catalog\Product\Product', 'brand_id', 'brand_id');
    }




}