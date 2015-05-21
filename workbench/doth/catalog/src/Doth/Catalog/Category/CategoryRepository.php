<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Category;

use Doth\Core\Abstracts\Repository;
use Input;

/**
 * Class CategoryRepository
 * @package Doth\Catalog\Category
 */
class CategoryRepository extends Repository implements CategoryRepositoryInterface{

    /**
     * @param Category $category
     */
    public function __construct( Category $category )
    {
        $this->model = $category;
    }

    public function updatePath($categoryId = 0)
    {
        if(!is_numeric($categoryId))
        {
            throw new \InvalidArgumentException('Category id is invalid');
        }

        if($categoryId > 0){

            
            $category = $this->model->find($categoryId);
            $parent = $category->parent;
            if(isset($parent)){
                $category->path = $parent->path . '/'. $category->category_id;
            }
            else{
                $category->path = ''.$category->category_id;
            }
            if(!$category->save())
            {
                $this->setErrors($category->getErrors());
                return false;
            }
        }

        $rows = $this->model->where('parent_id', $categoryId)->get();

        if(count($rows) > 0 ){
            foreach($rows as $row)
            {
                if(!$this->updatePath( $row->category_id ))
                {
                    return false;
                }
            }
        }

        return true;
    }

}