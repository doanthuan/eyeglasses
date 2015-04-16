<?php
namespace App;

use DB, Str;

class Category extends Model{

	protected $table = 'category';
    protected $primaryKey = 'category_id';

    protected $fillable = array( 'name', 'parent_id', 'path', 'tree_level', 'sort_order', 'alias', 'child_count', 'product_count' );

    protected $rules = array(
        'name' => 'required',
        'parent_id' => 'required'
    );

    //relationship
    public function products()
    {
        return $this->hasMany('\App\Product', 'category_id', 'category_id');
    }

    public function parent()
    {
        return $this->belongsTo('\App\Category', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('\App\Category', 'parent_id');
    }

    public function setData($input)
    {
        if(empty($input)){
            return;
        }

        if(empty($input['alias'])){
            $input['alias'] = Str::slug( $input['name'] , '-' );
        }

        $parentCat = static::find($input['parent_id']);
        if(!is_null($parentCat))
        {
            $input['tree_level'] = $parentCat->tree_level + 1;
        }

        parent::setData($input);
    }

    public function validate($input)
    {
        if(parent::validate($input))
        {
            if($this->exists(array('name', 'parent_id')))
            {
                $this->setErrors(trans('Sibling categories can not have the same name'));
                return false;
            }

            if(!empty($this->alias) && $this->exists(array('alias', 'parent_id')))
            {
                $this->setErrors(trans('Sibling categories can not have the same alias'));
                return false;
            }
            return true;
        }
        return false;
    }

    public function updatePath($categoryId = 0)
    {
        if(!is_numeric($categoryId))
        {
            throw new \InvalidArgumentException('Category id is invalid');
        }

        if($categoryId > 0){
            $category = static::find($categoryId);
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

        $rows = static::where('parent_id', $categoryId)->get();

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

        $rows = static::where('parent_id', $categoryId)->get();

        if(count($rows) > 0 ){
            $childCountTotal = 0;
            foreach($rows as $row)
            {
                $childCount = $this->updateChildCount( $row->category_id );
                $childCountTotal += $childCount;
            }
            if( $categoryId > 0)//is not root
            {
                static::where('category_id', $categoryId)->update(array('child_count' => $childCountTotal));
                return $childCountTotal;
            }

        }
        else//is leaf
        {
            static::where('category_id', $categoryId)->update(array('child_count' => 0));
            return 1;
        }
    }

    public function updateProductCount( $categoryId = 0 )
    {
        if(!is_numeric($categoryId))
        {
            throw new \InvalidArgumentException('Category id is invalid');
        }

        $rows = static::where('parent_id', $categoryId)->get();

        if(count($rows) > 0 ){
            $childCountTotal = 0;
            foreach($rows as $row)
            {
                $childCount = $this->updateProductCount( $row->category_id );
                $childCountTotal += $childCount;
            }
            if( $categoryId > 0)//is not root
            {
                static::where('category_id', $categoryId)->update(array('product_count' => $childCountTotal));
                return $childCountTotal;
            }

        }
        else//is leaf, count and update
        {
            $childCount = \Goxob::getModel('catalog/product')->countProduct( array( $categoryId ) );
            static::where('category_id', $categoryId)->update(array('product_count' => $childCount));
            return $childCount;
        }
    }

}