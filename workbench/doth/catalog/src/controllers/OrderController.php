<?php namespace Doth\Catalog\Controllers;

use Doth\Core\Abstracts\ApiController;

use Doth\Catalog\Order\OrderRepositoryInterface;
use Doth\Core\Exceptions\BusinessException;

use Input;

class OrderController extends ApiController
{

    public function __construct( OrderRepositoryInterface $order )
    {
        $this->order = $order;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $orders = $this->order->getList();

        return $this->respondData($orders);
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
        $order = $this->order->save(\Input::all());
        return $this->respondSuccess('Order created successfully', $order);
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
        $data = $this->order->findOrderWithDetails($id);
        return $this->respondData($data);
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
        $order = $this->order->find($id);
        $this->respondData($order);
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
        $this->order->delete($id);
        $this->respondSuccess('Order deleted');
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
        $this->order->delete($cid);

        return $this->respondSuccess('Orders deleted');
    }

}
