<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Product;

use Doth\Catalog\Media\MediaRepositoryInterface;
use Doth\Core\Abstracts\Repository;
use Input, DB;

class ProductRepository extends Repository implements ProductRepositoryInterface
{
    /**
     * @param Product $product
     * @param MediaRepositoryInterface $media
     */
    public function __construct(Product $product, MediaRepositoryInterface $media)
    {
        $this->model = $product;
        $this->media = $media;
    }

    /**
     * @param \Illuminate\Database\Query\Builder $query
     * @param $input
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function filter($query, $input)
    {
        //filters
        if (isset($input['filters'])) {
            $filters = (array)json_decode($input['filters']);
            foreach ($filters as $key => $value) {
                if(is_null($value) || (empty($value) && $value !== 0)){
                    continue;
                }

                if($key == 'color'){
                    if(is_array($value)){
                        foreach($value as $v){
                            $sql[] = "FIND_IN_SET ( {$v}, colors )";
                        }
                        $sql = implode(" OR ", $sql);
                        $query->havingRaw( $sql );
                    }
                    else{
                        $query->havingRaw( "FIND_IN_SET ( {$value}, colors )" );
                    }
                }
                else if($key == 'prices'){
                    $query->where(function($query) use($value)
                    {
                        foreach($value as $v){
                            $query->orWhereRaw( 'price between '.$v );
                        }
                    });
                }
                else if(is_array($value)){
                    $query->whereIn($key, $value);
                }
                else{
                    $query->where($key,'like', '%'.$value.'%');
                }
            }
        }
    }

    public function getList()
    {
        $input = Input::all();

        $query = $this->model->getQuery();
        $query->leftJoin('product_color', 'product.product_id', '=', 'product_color.product_id');
        $query->select('product.*', 'product_color.color_id', \DB::raw( "GROUP_CONCAT(product_color.color_id SEPARATOR ',') as colors" ));
        $query->groupBy('product.product_id');

        $this->filter($query, $input);

        $this->sortBy($query, $input);
        $items = $this->pagination($query, $input);

        return $items;
    }


    public function save($input)
    {
        /**
         * save product
         */
        $product = $this->model;
        if (!$product->validate($input)) {
            $this->setErrors($product->getErrors());
        }
        $product->setData($input);
        $product->save();

        /**
         * update product images and color
         */
        $this->media->addImagesToProduct($input['images'], $product);

        return $product;
    }

}