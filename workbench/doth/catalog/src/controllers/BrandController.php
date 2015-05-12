<?php namespace Doth\Catalog\Controllers;

use Doth\Core\Abstracts\ApiController;

use Doth\Catalog\Brand\BrandRepositoryInterface;
use Doth\Core\Exceptions\BusinessException;

use Input;

class BrandController extends ApiController
{

    public function __construct( BrandRepositoryInterface $brand )
    {
        $this->brand = $brand;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $brands = $this->brand->getList();

        return $this->respondData($brands);
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
        $brand = $this->brand->save(\Input::all());
        return $this->respondSuccess('Brand created successfully', $brand);
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
        $brand = $this->brand->find($id);
        return $this->respondData($brand);
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
        $brand = $this->brand->find($id);
        $this->respondData($brand);
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
        $this->brand->delete($id);
        $this->respondSuccess('Brand deleted');
    }

    /**
     * Multiple deletes
     *
     * @param  [] $cid
     * @return Response
     */
    public function delete()
    {
        $cid = Input::get('cid');
        $this->brand->delete($cid);

        return $this->respondSuccess('Brands deleted');
    }

}
