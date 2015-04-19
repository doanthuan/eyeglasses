<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:17 AM
 */

namespace Doth\Catalog\Category;


interface CategoryRepositoryInterface {
    
    public function updatePath($categoryId = 0);

    public function updateChildCount($categoryId = 0);

    public function updateProductCount( $categoryId = 0 );

}