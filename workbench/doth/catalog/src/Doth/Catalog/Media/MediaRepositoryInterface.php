<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:17 AM
 */

namespace Doth\Catalog\Media;

use Doth\Core\Abstracts\RepositoryInterface;

interface MediaRepositoryInterface extends RepositoryInterface{

    public function addImagesToProduct($images, $product);

    public function getProductImages($productId);

}