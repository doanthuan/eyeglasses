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

    protected function filter($query, $input)
    {
        //filters
        if (isset($input['filters'])) {
            $filters = (array)json_decode($input['filters']);
            foreach ($filters as $key => $value) {
                if(is_null($value) || (empty($value) && $value != 0)){
                    continue;
                }
                if(is_array($value)){
                    $query->whereIn($key, $value);
                }
                else{
                    $query->where($key,'like', '%'.$value.'%');
                }
            }
        }

        return $query;
    }

    protected function sortBy(&$query, $input)
    {
        //sort
        if(isset($input['order']) && !empty($input['order'])){

            $orderBy = $input['order'];
            $orderDir = $input['dir']?'DESC':'ASC';

            $query->orderBy($orderBy, $orderDir);
        }
    }

    protected function pagination(&$query, $input)
    {
        //paginate
        if(isset($input['limit'])){//if pagination
            $pageSize = $input['limit'];
            $curPage = $input['page'];

            $orgQuery = clone $query;
            $query->groups = null;
            $total = $query->count();

            $items = $orgQuery->skip(($curPage - 1)  * $pageSize)->take($pageSize)->get();

            $paginator = new \Illuminate\Pagination\LengthAwarePaginator($items, $total, $pageSize, $curPage);
            $paginator->appends($_GET);
            return $paginator;
        }
        else{
            $items= $query->get();
            return $items;
        }
    }

    public function getList()
    {
        $input = Input::all();

        $query = $this->model->getQuery();

        $this->filter($query, $input);

        $this->sortBy($query, $input);

        $items = $this->pagination($query, $input);

        return $items;
    }

    public function find($id)
    {
        return $this->model->find($id);
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
            throw new BusinessException('Deleting error. Invalid request ids');
        }

        $this->model->destroy($ids);
    }
}