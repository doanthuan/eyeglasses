<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:17 AM
 */

namespace Doth\Catalog\Product;

use Doth\Core\Abstracts\RepositoryInterface;

interface ProductRepositoryInterface extends RepositoryInterface{

    public function findByAlias($alias);

}