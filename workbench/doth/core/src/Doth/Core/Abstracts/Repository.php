<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/18/2015
 * Time: 10:42 AM
 */

namespace Doth\Core\Abstracts;
use Input;

abstract class Repository implements RepositoryInterface{

    protected $errors;

    public function setErrors($errors)
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

    public function filterQuery($query, $input)
    {
        //filters
        if (isset($input['filters'])) {
            $filters = $input['filters'];
            $filters = (array)json_decode($filters);
            if(is_array($filters)){
                foreach ($filters as $key => $value) {
                    $query->where($key,'like', '%'.$value.'%');
                }
            }
        }

        //sort
        if(isset($input['order']) && !empty($input['order'])){

            $orderBy = $input['order'];
            $orderDir = $input['dir']?'DESC':'ASC';

            $query->orderBy($orderBy, $orderDir);
        }

        //paginate
        $defaultPageSize = 10;
        $pageSize = $input['limit']?$input['limit']:$defaultPageSize;

        $items = $query->paginate($pageSize);
        $items->appends($_GET);

        return $items;
    }

    public function getList()
    {
        $query = $this->model->query();

        $items = $this->filterQuery($query, Input::all());

        return $items;
    }

    public function save($input)
    {
        //store item to db
        if(!$this->model->validate($input))
        {
            $this->setErrors($this->model->getErrors());
        }
        $this->model->setData($input);
        $this->model->save();
        return $this->model;
    }

    public function delete($ids)
    {
        if (empty($ids)){
            throw new BusinessException('Deleting category error. Invalid request ids');
        }

        $this->model->destroy($ids);
    }
}