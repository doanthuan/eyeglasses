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

            //@var Category $category
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

    public function updateChildCount($categoryId = 0)
    {
        if(!is_numeric($categoryId))
        {
            throw new \InvalidArgumentException('Category id is invalid');
        }

        $rows = $this->model->where('parent_id', $categoryId)->get();

        if(count($rows) > 0 ){
            $childCountTotal = 0;
            foreach($rows as $row)
            {
                $childCount = $this->updateChildCount( $row->category_id );
                $childCountTotal += $childCount;
            }
            if( $categoryId > 0)//is not root
            {
                $this->model->where('category_id', $categoryId)->update(array('child_count' => $childCountTotal));
                return $childCountTotal;
            }

        }
        else//is leaf
        {
            $this->model->where('category_id', $categoryId)->update(array('child_count' => 0));
            return 1;
        }
    }

    public function updateProductCount( $categoryId = 0 )
    {
        if(!is_numeric($categoryId))
        {
            throw new \InvalidArgumentException('Category id is invalid');
        }

        $rows = $this->model->where('parent_id', $categoryId)->get();

        if(count($rows) > 0 ){
            $childCountTotal = 0;
            foreach($rows as $row)
            {
                $childCount = $this->updateProductCount( $row->category_id );
                $childCountTotal += $childCount;
            }
            if( $categoryId > 0)//is not root
            {
                $this->model->where('category_id', $categoryId)->update(array('product_count' => $childCountTotal));
                return $childCountTotal;
            }

        }
        else//is leaf, count and update
        {
            $childCount = \Goxob::getModel('catalog/product')->countProduct( array( $categoryId ) );
            $this->model->where('category_id', $categoryId)->update(array('product_count' => $childCount));
            return $childCount;
        }
    }
}