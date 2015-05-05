<?php
/**
 * Created by PhpStorm.
 * User: doanthuan
 * Date: 4/15/2015
 * Time: 10:15 AM
 */

namespace Doth\Catalog\Media;

use Doth\Core\Abstracts\Repository;
use Input;

/**
 * Class MediaRepository
 * @package Doth\Catalog\Media
 */
class MediaRepository extends Repository implements MediaRepositoryInterface{

    /**
     * @param Media $media
     */
    public function __construct( Media $media )
    {
        $this->model = $media;
    }
}