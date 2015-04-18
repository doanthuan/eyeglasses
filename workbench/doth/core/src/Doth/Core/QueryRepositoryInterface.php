<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/16/2015
 * Time: 10:21 AM
 */

namespace Doth\Core;


interface QueryRepositoryInterface {
    public function filterQuery($query, $input);
}