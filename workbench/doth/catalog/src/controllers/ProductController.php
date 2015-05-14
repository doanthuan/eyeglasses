<?php namespace Doth\Catalog\Controllers;

use Doth\Core\Abstracts\ApiController;

use Doth\Catalog\Product\ProductRepositoryInterface;
use Input;

class ProductController extends ApiController
{

    public function __construct( ProductRepositoryInterface $product )
    {
        $this->product = $product;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $products = $this->product->getList();

        return $this->respondData($products);
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
        $product = $this->product->save(\Input::all());
        return $this->respondSuccess('Product created successfully', $product);
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
        $product = $this->product->find($id);
        return $this->respondData($product);
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

    /**
     * Multiple deletes
     *
     * @param  [] $cid
     * @return Response
     */
    public function delete()
    {
        $cid = Input::get('cid');
        $this->product->delete($cid);

        return $this->respondSuccess('Products deleted');
    }
}
