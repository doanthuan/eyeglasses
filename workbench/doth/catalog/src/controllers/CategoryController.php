<?php namespace Doth\Catalog\Controllers;

use Doth\Core\Abstracts\ApiController;

use Doth\Catalog\Category\CategoryRepositoryInterface;
use Doth\Core\Exceptions\BusinessException;

use Input;

class CategoryController extends ApiController
{

    public function __construct( CategoryRepositoryInterface $category )
    {
        $this->category = $category;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $categories = $this->category->getList();

        return $this->respondData($categories);
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
        $category = $this->category->save(\Input::all());
        return $this->respondSuccess('Category created successfully', $category);
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
        $this->category->delete($id);
        $this->respondSuccess('Category deleted');
    }

    public function delete()
    {
        $cid = Input::get('cid');
        if (empty($cid)){
            throw new BusinessException('Deleting category error. Invalid request ids');
        }

        $this->category->delete($cid);

        return $this->respondSuccess('Categories deleted');
    }

}
