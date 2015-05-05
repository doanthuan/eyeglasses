<?php namespace Doth\Catalog\Controllers;

use Doth\Core\Abstracts\ApiController;

use Doth\Catalog\Media\MediaRepositoryInterface;

use Request;
use Storage;
use File;
use Str;

class MediaController extends ApiController
{

    public function __construct( MediaRepositoryInterface $media )
    {
        $this->media = $media;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $medias = $this->media->getList();

        return $medias->toJson();
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

    /**
     * upload image
     *
     * @return Response
     */
    public function upload()
    {
        //
        if (Request::file('file')->isValid())
        {
            //
            $file = Request::file('file');

            $fileName = $file->getClientOriginalName();
            $fileName = pathinfo($fileName, PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $random = Str::random(6);
            $fileName = $fileName.'_'.$random.'.'.$extension;
            $uploadDir = public_path('uploads');

            Request::file('file')->move($uploadDir, $fileName);

            $data['filename'] = $fileName;
            $data['original_filename'] = $file->getClientOriginalName();
            $row = $this->media->save($data);
            echo $row->id;exit;
        }
    }
}
