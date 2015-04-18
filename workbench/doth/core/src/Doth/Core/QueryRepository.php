<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/16/2015
 * Time: 10:21 AM
 */

namespace Doth\Core;


class QueryRepository implements QueryRepositoryInterface{

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

}