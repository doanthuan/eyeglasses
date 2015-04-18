<?php
/**
 * Created by JetBrains PhpStorm.
 * User: thuan
 * Date: 4/26/14
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */

namespace Doth\Core\Abstracts;

use Eloquent, Validator;
abstract class Model extends \Illuminate\Database\Eloquent\Model {

    /**
     * Error message bag
     *
     * @var Illuminate\Support\MessageBag
     */
    protected $errors;

    /**
     * Validation rules
     *
     * @var Array
     */
    public static $rules = array();

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
    }

    protected function setErrors($errors)
    {
        $this->errors = $errors;
        return false;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function hasErrors()
    {
        return ! empty($this->errors);
    }

    public function setData($input)
    {
        $keyName = $this->getKeyName();
        if(isset($input[$keyName]) && !empty($input[$keyName]))
        {
            $originModel = $this->find($input[$keyName]);
            if($originModel){
                $this->setRawAttributes($originModel->getAttributes());
                $this->syncOriginal();
                $this->exists = true;
            }
        }
        return $this->fill($input);
    }

    /**
     * Listen for save event
     */
//    protected static function boot()
//    {
//        parent::boot();
//
//        static::saving(function($model)
//        {
//            return $model->validate();
//        });
//    }


    /**
     * Validates current attributes against rules
     */
    public function validate($input)
    {
        $keyName = $this->getKeyName();
        if(!empty($keyName) && isset($input[$keyName]))
        {
            $replace = $input[$keyName];
            foreach (static::$rules as $key => $rule)
            {
                static::$rules[$key] = str_replace(':id', $replace, $rule);
            }
        }

        $v = Validator::make($input, static::$rules);

        if ($v->passes())
        {
            return true;
        }

        $this->setErrors($v->messages());

        return false;
    }



    public function publish($cid, $value, $col = 'status')
    {
        return $this->updateStatus($cid, $value, $col);
    }

    public function updateStatus($cid, $status, $col = 'status')
    {
        if(!is_array($cid))
        {
            $cid = array($cid);
        }
        $keyName = $this->getKeyName();
        $affectedRows = static::whereIn($keyName, $cid)->update(array($col => $status));
        return $affectedRows;
    }

    public function saveOrder($pks = null, $order = null)
    {
        if (empty($pks))
        {
            throw new \InvalidArgumentException('Saving orders error. Invalid primary keys');
        }

        foreach ($pks as $i => $pk)
        {
            $row = static::find((int) $pk);

            if (isset($row) && $row->sort_order != $order[$i])
            {
                $row->sort_order = $order[$i];

                if (!$row->save())
                {
                    throw new \QueryException('Saving orders error.');
                    return false;
                }
            }
        }

        return true;
    }

    public function exists($fields)
    {
        if(!is_array($fields))
        {
            $fields = array($fields);
        }

        $query = $this->query();
        foreach($fields as $field)
        {
            if(is_null($this->$field))
            {
                return false;
            }
            $query->where($field, $this->$field);
        }

        $keyName = $this->getKeyName();
        $keyValue = $this->getKey();
        if(isset($keyValue))
        {
            $query->where($keyName, '!=', $keyValue);
        }
        $row = $query->first();
        if($row){
            return $row->$keyName;
        }
        return false;
    }

}