<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:17 AM
 */

namespace Doth\Catalog\Product;


interface ProductRepositoryInterface {

    public function getList();

    public function deleteImages();

    public function saveImages($images, $overwrite = true, $defaultImg = null);

    public function saveAttributes($input);

    public function countProduct(array $categories);

    public function getCartQty();

    public function getTotal();
}