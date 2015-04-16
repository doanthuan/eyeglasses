<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/8/2015
 * Time: 10:45 AM
 */

namespace App;

class Product extends Model{

    protected $table = 'product';
    protected $primaryKey = 'product_id';
    //public $timestamps = true;

    protected $fillable = array('name','alias','price','short_description','description','sku', 'quantity','cost',
        'weight', 'vendor_id', 'tax', 'status', 'created_at', 'updated_at', 'hits', 'sold', 'sort_order', 'category_id',
        'attr_set_id', 'old_price', 'published_date', 'new_from', 'new_to', 'hot_from', 'hot_to',
        'meta_title', 'meta_key', 'meta_desc', 'related_products', 'frontpage'
    );

    protected $rules = array(
        'attr_set_id'=>'required|integer',
        'name'=>'required'
    );

    //relationship
    public function images()
    {
        return $this->hasMany('\App\Image', 'product_id', 'product_id');
    }

    public function category()
    {
        return $this->belongsTo('\App\Category','category_id', 'category_id');
    }

    public function attributeSet()
    {
        return $this->belongsTo('\App\AttributeSet','attr_set_id', 'attr_set_id');
    }

    public function attributes()
    {
        return $this->belongsToMany('\App\Attribute', 'product_attribute_value', 'product_id', 'attr_id')
            ->withPivot('attr_value');
    }

    public function reviews()
    {
        return $this->hasMany('\App\Review', 'product_id', 'product_id');
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

    public function getCartQty()
    {
        if(isset($this->cart_qty)){
            return $this->cart_qty;
        }
        if(isset($this->pivot->quantity)){
            return $this->pivot->quantity;
        }
    }

    public function getTotal()
    {
        $qty = $this->getCartQty();
        return $this->price * $qty;
    }

    public function deleteImages()
    {
        // delete all related images
        foreach($this->images()->get() as $image)
        {
            $image->delete();
        }
    }

    public function saveImages($images, $overwrite = true, $defaultImg = null)
    {
        if(is_null($images)){
            return true;
        }

        //remove old images
        if($overwrite){
            $this->deleteImages();
        }

        //get default image index
        if(!is_null($defaultImg) && strpos($defaultImg, 'new_') !== false)// default in new images
        {
            $defaultImgIndex = substr($defaultImg, 4);

            //reset default images
            $this->images()->update(array('default' => 0));
        }

        //loop file and save images
        foreach($images as $i => $file)
        {
            if(is_null($file))continue;

            $image = new Image();
            $image->product_id = $this->product_id;
            if(isset($defaultImgIndex) && $defaultImgIndex == $i){
                $image->default = 1;
            }
            if(is_string($file)){
                $image->img_name = $file;
            }
            else if(is_object($file)){
                $image->setFile($file);
            }
            if(!$image->save())
            {
                $this->setErrors($image->getErrors());
                return false;
            }
        }

        return true;
    }

    public function saveAttributes($input)
    {
        //get old attributes before delete
        $attributes = $this->attributes()->get();

        //remove old attributes
        $this->attributes()->detach();

        foreach($attributes as $attribute)
        {
            $value = null;
            if(isset($input['attr_name_'.$attribute->attr_id])){
                $value = $input['attr_name_'.$attribute->attr_id];
            }
            if(is_array($value))
            {
                $value = implode(';', $value);
            }
            if(!is_null($value)){
                $this->attributes()->attach($attribute->attr_id, array('attr_value' => $value));
            }
        }
        return true;
    }

    public function countProduct(array $categories)
    {
        if(empty($categories))
        {
            throw new \InvalidArgumentException('Categories empty');
        }
        $count = static::select(DB::raw('COUNT(DISTINCT product_id) as count'))
            ->whereIn('category_id', $categories)
            ->where('status', true)->pluck('count');

        return $count;
    }

}