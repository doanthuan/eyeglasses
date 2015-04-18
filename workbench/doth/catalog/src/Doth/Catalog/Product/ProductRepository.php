<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Product;

use Doth\Core\QueryRepositoryInterface;
use Input;

class ProductRepository implements ProductRepositoryInterface{

    /**
     * @param Product $product
     * @param QueryRepositoryInterface $query
     */
    public function __construct( Product $product, QueryRepositoryInterface $query )
    {
        $this->model = $product;
        $this->query = $query;
    }

    public function getList()
    {
        $query = $this->model->query();

        $items = $this->query->filterQuery($query, Input::all());

        return $items;
    }

    public function deleteImages()
    {
        // delete all related images
        foreach($this->model->images()->get() as $image)
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
            $this->model->images()->update(array('default' => 0));
        }

        //loop file and save images
        foreach($images as $i => $file)
        {
            if(is_null($file))continue;

            $image = new Image();
            $image->product_id = $this->model->product_id;
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
                $this->model->setErrors($image->getErrors());
                return false;
            }
        }

        return true;
    }

    public function saveAttributes($input)
    {
        //get old attributes before delete
        $attributes = $this->model->attributes()->get();

        //remove old attributes
        $this->model->attributes()->detach();

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
                $this->model->attributes()->attach($attribute->attr_id, array('attr_value' => $value));
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

    public function getCartQty()
    {
        if(isset($this->model->cart_qty)){
            return $this->model->cart_qty;
        }
        if(isset($this->model->pivot->quantity)){
            return $this->model->pivot->quantity;
        }
    }

    public function getTotal()
    {
        $qty = $this->getCartQty();
        return $this->model->price * $qty;
    }
}