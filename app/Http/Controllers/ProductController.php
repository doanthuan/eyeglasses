<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Input;

class ProductController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $input = Input::all();

        //init query
        $query = \App\Product::query();

        //filters
        if (Input::has('filters')) {
            //
            $filters = Input::get('filters');
            $filters = (array)json_decode($filters);
            foreach ($filters as $key => $value) {
                $query->where($key,'like', '%'.$value.'%');
            }
        }

        //sort
        $orderBy = Input::get('order','');
        if(!empty($orderBy)){

            $orderDir = (bool)Input::get('dir', 1);
            $orderDir = $orderDir?'DESC':'ASC';

            $query->orderBy($orderBy, $orderDir);
        }

        //paginate
        $defaultPageSize = 10;
        $pageSize = Input::get('limit', $defaultPageSize);
        $products = $query->paginate($pageSize);
        $products->appends($_GET);

        return $products->toJson();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

}
