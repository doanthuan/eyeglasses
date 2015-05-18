<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Media;

use Doth\Core\Abstracts\Repository;
use Input, DB;

/**
 * Class MediaRepository
 * @package Doth\Catalog\Media
 */
class MediaRepository extends Repository implements MediaRepositoryInterface{

    /**
     * @param Media $media
     */
    public function __construct(Media $media)
    {
        $this->model = $media;
    }

    public function addImagesToProduct($images, $product)
    {
        if (isset($images) && count($images) > 0) {
            //remove old images
            $this->removeImagesFromProduct($product->product_id);

            $newColors = [];
            foreach ($images as $img) {
                if (isset($img['media_id'])) {
                    /** @var \Doth\Catalog\Media\Media $media */
                    $media = Media::find($img['media_id']);
                }
                if ($media) {
                    $media->product_id = $product->product_id;
                    $media->save();
                    if(!in_array($media->color_id, $newColors)){
                        $newColors[] = $media->color_id;
                    }
                }
            }

            //set thumbnail
            $thumbnail = $images[0];
            if ($thumbnail) {
                $thumbnail = Media::find($thumbnail['media_id']);
                if ($thumbnail) {
                    $product->thumbnail = $thumbnail->filename;
                    $product->save();
                }
            }

            // remove empty media
            $this->clean();


            //remove old colors
            DB::table('product_color')->where('product_id', $product->product_id)->delete();

            //add colors to product
            foreach ($newColors as $colorId) {
                DB::table('product_color')->insert(
                    ['color_id' => $colorId, 'product_id' => $product->product_id]
                );
            }
        }
    }

    /**
     * remove images by product id
     * @param $productId
     */
    protected function removeImagesFromProduct($productId)
    {
        Media::where('product_id', $productId)->delete();
    }

    protected function clean()
    {
        Media::where('product_id', null)->delete();
    }

    public function getProductColors($productId)
    {
        return \DB::table('product_color')->where('product_id', $productId)->lists('product_color.color_id');
    }

    public function getProductImages($productId)
    {
        return Media::where('product_id', $productId)->get();
    }
}