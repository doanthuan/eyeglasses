<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Brand;

use Doth\Core\Abstracts\Repository;
use Input;

/**
 * Class BrandRepository
 * @package Doth\Catalog\Brand
 */
class BrandRepository extends Repository implements BrandRepositoryInterface{

    /**
     * @param Brand $brand
     */
    public function __construct( Brand $brand )
    {
        $this->model = $brand;
    }

}