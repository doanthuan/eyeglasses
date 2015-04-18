<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/18/2015
 * Time: 10:42 AM
 */

namespace Doth\Core\Traits;

trait Repository {

    protected $errors;

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
}