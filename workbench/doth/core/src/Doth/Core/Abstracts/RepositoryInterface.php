<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/19/2015
 * Time: 10:04 AM
 */

namespace Doth\Core\Abstracts;


interface RepositoryInterface {

    public function setErrors($errors);

    public function getErrors();

    public function hasErrors();

    public function filterQuery($query, $input);

    public function getList();

    public function find($id);

    public function save($input);

}