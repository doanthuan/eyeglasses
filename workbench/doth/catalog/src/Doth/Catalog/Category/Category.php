<?php
namespace Doth\Catalog\Category;

use Str;
use Doth\Core\Abstracts\Model;

class Category extends Model{

	protected $table = 'category';
    protected $primaryKey = 'category_id';

    protected $fillable = array( 'name', 'parent_id', 'path', 'tree_level', 'sort_order', 'alias', 'child_count', 'product_count' );

    public static $rules = array(
        'name' => 'required',
        'parent_id' => 'required'
    );

    //relationship
    public function products()
    {
        return $this->hasMany('\Doth\Catalog\Product\Product', 'category_id', 'category_id');
    }

    public function parent()
    {
        return $this->belongsTo('\Doth\Catalog\Category', 'parent_id');
    }

    public function children()
    {
        return $this->hasMany('\Doth\Catalog\Category', 'parent_id');
    }

    public function setData($input)
    {
        if(empty($input)){
            return;
        }

        if(empty($input['alias'])){
            $input['alias'] = Str::slug( $input['name'] , '-' );
        }

        if(isset($input['parent_id'])){
            $parentCat = static::find($input['parent_id']);
            if(!is_null($parentCat))
            {
                $input['tree_level'] = $parentCat->tree_level + 1;
            }
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



}